import React, { useState, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { extractDriverLicenseWithGemini, LicenseOcrResult } from '../../lib/gemini';
import {
  ScanLine,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Shield,
  FileCheck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Camera,
  Check,
} from 'lucide-react';

interface DocumentOcrScannerProps {
  preselectedDriverId?: string | null;
}

export const DocumentOcrScanner: React.FC<DocumentOcrScannerProps> = ({
  preselectedDriverId,
}) => {
  const {
    drivers,
    currentTenantId,
    users,
    currentUserId,
    updateDriverDocument,
    updateDriver,
    addToast,
    setView,
  } = useStore();

  const tenantDrivers = drivers.filter((d) => d.tenantId === currentTenantId);
  const [selectedDriverId, setSelectedDriverId] = useState<string>(
    preselectedDriverId || (tenantDrivers[0]?.id || '')
  );

  const selectedDriver = drivers.find((d) => d.id === selectedDriverId);

  const [isScanning, setIsScanning] = useState(false);
  const [ocrResult, setOcrResult] = useState<LicenseOcrResult | null>(null);
  const [hasScanned, setHasScanned] = useState(false);
  const [sampleType, setSampleType] = useState<'sample_texas' | 'sample_ohio' | 'custom'>('sample_texas');

  // Sample license images (synthetic realistic visuals)
  const sampleImages: Record<string, string> = {
    sample_texas: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=700&auto=format&fit=crop&q=80',
    sample_ohio: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=700&auto=format&fit=crop&q=80',
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const runOcrScan = async () => {
    setIsScanning(true);
    setOcrResult(null);

    try {
      const result = await extractDriverLicenseWithGemini('mock_base64_data', {
        firstName: selectedDriver?.firstName,
        lastName: selectedDriver?.lastName,
        dob: selectedDriver?.dateOfBirth,
        state: selectedDriver?.cdlState,
        cdlNumber: selectedDriver?.cdlNumber,
      });

      // Simulate the scan sweep taking 2.2 seconds for realistic UX
      setTimeout(() => {
        setOcrResult(result);
        setIsScanning(false);
        setHasScanned(true);
        addToast('OCR Complete', 'Commercial driver license data extracted & cross-verified', 'success');
      }, 2200);
    } catch (err) {
      setIsScanning(false);
      addToast('Scan Error', 'Unable to complete scan; check file format', 'error');
    }
  };

  const handleApplyToProfile = () => {
    if (!selectedDriver || !ocrResult) return;

    // Update driver profile with extracted fields
    updateDriver(selectedDriver.id, {
      cdlNumber: ocrResult.licenseNumber.value,
      cdlState: ocrResult.state.value,
      cdlClass: (ocrResult.cdlClass.value as any) || selectedDriver.cdlClass,
      cdlExpiration: ocrResult.expirationDate.value,
      dateOfBirth: ocrResult.dateOfBirth.value,
    });

    // Update CDL document status
    const cdlDoc = selectedDriver.documents.find((d) => d.type === 'CDL Front');
    if (cdlDoc) {
      updateDriverDocument(selectedDriver.id, cdlDoc.id, {
        status: 'Approved',
        verifiedBy: users.find((u) => u.id === currentUserId)?.name || 'Recruiter OCR',
        verifiedAt: new Date().toISOString(),
        ocrExtracted: {
          cdlNumber: ocrResult.licenseNumber,
          state: ocrResult.state,
          fullName: ocrResult.fullName,
          dob: ocrResult.dateOfBirth,
          class: ocrResult.cdlClass,
          expiration: ocrResult.expirationDate,
        },
      });
    }

    addToast('Profile Synchronized', 'Candidate record updated with verified CDL credentials', 'success');
    setView('driver_profile', selectedDriver.id);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold font-heading text-[#14161A]">
              AI Commercial Driver License (CDL) Recognition & OCR
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#0E7C7B]/10 text-[#0E7C7B] font-mono font-medium">
              Gemini Vision
            </span>
          </div>
          <p className="text-xs text-[#5B616B] mt-0.5">
            Automated credential extraction, field confidence assessment, and profile discrepancy flagging
          </p>
        </div>

        {/* Candidate Selector */}
        <div className="flex items-center gap-2.5">
          <label className="text-xs text-[#5B616B]">Target Candidate:</label>
          <select
            value={selectedDriverId}
            onChange={(e) => {
              setSelectedDriverId(e.target.value);
              setOcrResult(null);
              setHasScanned(false);
            }}
            className="text-xs px-3 py-1.5 bg-white border border-[#ECEAE4] rounded-xl outline-none shadow-2xs font-medium"
          >
            {tenantDrivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.firstName} {d.lastName} ({d.cdlNumber} - {d.cdlState})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Split: Scan Window Left, Extracted Fields Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: License Card & Scan Viewport */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-[#ECEAE4] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold font-heading text-[#14161A]">
              CDL Document Capture
            </h3>
            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setSampleType('sample_texas')}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  sampleType === 'sample_texas' ? 'bg-[#0E7C7B] text-white' : 'text-[#5B616B] hover:bg-[#FAF9F6]'
                }`}
              >
                Sample TX CDL
              </button>
              <button
                onClick={() => setSampleType('sample_ohio')}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  sampleType === 'sample_ohio' ? 'bg-[#0E7C7B] text-white' : 'text-[#5B616B] hover:bg-[#FAF9F6]'
                }`}
              >
                Sample OH CDL
              </button>
            </div>
          </div>

          {/* Visual License Card with Animated Laser Scan Line */}
          <div className="relative w-full aspect-[16/10] bg-[#14161A] rounded-xl overflow-hidden shadow-inner border border-[#ECEAE4] group">
            {/* Background Simulated Driver License Design */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between text-white font-mono select-none bg-gradient-to-br from-slate-800 to-slate-950">
              <div className="flex items-start justify-between border-b border-white/20 pb-3">
                <div>
                  <div className="text-xs uppercase font-sans tracking-widest text-[#0E7C7B] font-bold">
                    COMMERCIAL DRIVER LICENSE
                  </div>
                  <div className="text-lg font-bold tracking-tight">
                    STATE OF {selectedDriver?.cdlState || 'TEXAS'}
                  </div>
                </div>
                <div className="text-xs text-right opacity-80">
                  CLASS {selectedDriver?.cdlClass || 'A'}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 my-auto">
                <div className="w-24 h-28 bg-slate-700/60 rounded border border-white/20 flex flex-col items-center justify-center text-[10px] text-white/50">
                  <Camera className="w-6 h-6 mb-1 opacity-40" />
                  <span>PHOTO</span>
                </div>
                <div className="col-span-2 text-xs space-y-1.5 opacity-90">
                  <div>
                    <span className="text-[10px] opacity-60 block">NAME</span>
                    <span className="font-bold">
                      {selectedDriver?.lastName}, {selectedDriver?.firstName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] opacity-60 block">LICENSE NUMBER</span>
                    <span className="font-bold text-[#F5A524]">{selectedDriver?.cdlNumber}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <span className="opacity-60 block">DOB</span>
                      <span>{selectedDriver?.dateOfBirth}</span>
                    </div>
                    <div>
                      <span className="opacity-60 block">EXP</span>
                      <span className="text-emerald-400">{selectedDriver?.cdlExpiration}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] opacity-60 border-t border-white/20 pt-2">
                <span>ENDORSEMENTS: T, N</span>
                <span>RESTRICTIONS: B</span>
              </div>
            </div>

            {/* Scanning Laser Beam Effect */}
            {isScanning && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#0E7C7B] to-transparent shadow-[0_0_15px_#0E7C7B] animate-scan z-10" />
            )}
          </div>

          {/* Trigger Scan Button */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={runOcrScan}
              disabled={isScanning}
              className="flex-1 py-2.5 px-4 text-xs font-semibold text-white rounded-xl shadow-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #0E7C7B 0%, #2563EB 100%)',
              }}
            >
              <ScanLine className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} strokeWidth={1.5} />
              <span>{isScanning ? 'Scanning & Parsing Image...' : 'Execute AI Document Scan'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Extracted Fields & Discrepancies */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-[#ECEAE4] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold font-heading text-[#14161A]">
              Extracted Credential Fields
            </h3>
            {hasScanned && (
              <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>Extraction Complete</span>
              </span>
            )}
          </div>

          {/* If scan completed, show fields with confidence badge */}
          {ocrResult ? (
            <div className="space-y-4">
              {/* Discrepancy Warnings */}
              {ocrResult.discrepancies.length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Discrepancy Detected Against Application</span>
                  </div>
                  {ocrResult.discrepancies.map((disc, idx) => (
                    <p key={idx} className="text-[11px] text-amber-800 leading-snug">
                      • {disc}
                    </p>
                  ))}
                </div>
              )}

              {/* Extracted Fields Table */}
              <div className="space-y-2 text-xs divide-y divide-[#ECEAE4]">
                {[
                  { label: 'License Number', data: ocrResult.licenseNumber },
                  { label: 'Issuing State', data: ocrResult.state },
                  { label: 'Full Legal Name', data: ocrResult.fullName },
                  { label: 'Date of Birth', data: ocrResult.dateOfBirth },
                  { label: 'Commercial Class', data: ocrResult.cdlClass },
                  { label: 'Endorsements', data: ocrResult.endorsements },
                  { label: 'Restrictions', data: ocrResult.restrictions },
                  { label: 'Expiration Date', data: ocrResult.expirationDate },
                  { label: 'Residential Address', data: ocrResult.address },
                ].map(({ label, data }) => {
                  const confPct = Math.round(data.confidence * 100);
                  const isLowConf = confPct < 92;

                  return (
                    <div key={label} className="pt-2 flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] text-[#9AA0A8] uppercase tracking-wider block">
                          {label}
                        </span>
                        <span className="font-semibold text-[#14161A] text-xs font-mono truncate block">
                          {data.value}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-medium ${
                            isLowConf
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {confPct}% conf
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Confirm & Sync Action */}
              <div className="pt-4 border-t border-[#ECEAE4] flex items-center justify-end gap-2.5">
                <button
                  onClick={() => setOcrResult(null)}
                  className="px-3 py-1.5 text-xs text-[#5B616B] hover:text-[#14161A] border border-[#ECEAE4] rounded-xl"
                >
                  Discard
                </button>
                <button
                  onClick={handleApplyToProfile}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0E7C7B] hover:bg-[#0c6b6a] rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Confirm & Sync Profile</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-xs text-[#9AA0A8] space-y-2">
              <ScanLine className="w-8 h-8 mx-auto opacity-40 text-[#5B616B]" strokeWidth={1.5} />
              <p>No document scanned yet.</p>
              <p className="text-[11px] text-[#5B616B]">
                Click "Execute AI Document Scan" to extract CDL parameters using Gemini Vision.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
