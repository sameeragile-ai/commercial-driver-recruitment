import React, { useState, useMemo, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { ConditionalOfferLetter, PositionType } from '../../types';
import {
  FileText,
  Plus,
  CheckCircle2,
  Clock,
  Download,
  Printer,
  Shield,
  PenTool,
  Check,
  Send,
  AlertTriangle,
  Building,
  User,
} from 'lucide-react';

export const OfferLettersView: React.FC = () => {
  const {
    offers,
    currentTenantId,
    tenants,
    drivers,
    payTemplates,
    users,
    currentUserId,
    createOffer,
    approveOffer,
    signOffer,
    addToast,
    setView,
  } = useStore();

  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  // New offer form state
  const [targetDriverId, setTargetDriverId] = useState('');
  const [selectedPayTemplateId, setSelectedPayTemplateId] = useState('');
  const [proposedStartDate, setProposedStartDate] = useState('2026-11-02');
  const [orientationLocation, setOrientationLocation] = useState('Apex Terminal Dallas, 4800 Logistics Way, Dallas TX 75247');

  // E-signature pad state
  const [sigType, setSigType] = useState<'type' | 'draw'>('type');
  const [signatureText, setSignatureText] = useState('');
  const [hasDrawn, setHasDrawn] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const activeTenant = tenants.find((t) => t.id === currentTenantId) || tenants[0];
  const currentUser = users.find((u) => u.id === currentUserId);
  const isManager = currentUser?.role === 'Admin' || currentUser?.role === 'Recruiting Manager';

  const tenantOffers = useMemo(() => {
    return offers.filter((o) => o.tenantId === currentTenantId);
  }, [offers, currentTenantId]);

  const tenantDrivers = useMemo(() => {
    return drivers.filter((d) => d.tenantId === currentTenantId);
  }, [drivers, currentTenantId]);

  const tenantPayTemplates = useMemo(() => {
    return payTemplates.filter((p) => p.tenantId === currentTenantId && p.status === 'Approved');
  }, [payTemplates, currentTenantId]);

  const activeOffer = tenantOffers.find((o) => o.id === selectedOfferId) || tenantOffers[0];

  const handleGenerateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const driver = tenantDrivers.find((d) => d.id === targetDriverId);
    const payTemplate = tenantPayTemplates.find((p) => p.id === selectedPayTemplateId) || tenantPayTemplates[0];

    if (!driver || !payTemplate) return;

    const offerId = createOffer({
      tenantId: currentTenantId,
      driverId: driver.id,
      driverName: `${driver.firstName} ${driver.lastName}`,
      position: driver.targetPosition,
      payTemplateId: payTemplate.id,
      paySummary: `${payTemplate.baseRateDisplay} + ${payTemplate.detentionPay}`,
      bonusesSummary: payTemplate.bonuses.join('; '),
      benefitsSummary: payTemplate.benefits.join('; '),
      proposedStartDate,
      orientationLocation,
      approvalStatus: isManager ? 'Approved by Manager' : 'Pending Manager Approval',
      approvedByManager: isManager ? currentUser?.name : undefined,
      managerApprovedAt: isManager ? new Date().toISOString() : undefined,
    });

    setShowGenerateModal(false);
    setSelectedOfferId(offerId);
  };

  const handleSign = () => {
    if (!activeOffer) return;
    const finalSig = sigType === 'type' ? signatureText : 'Digital Canvas Signature';
    if (!finalSig.trim()) return;

    signOffer(activeOffer.id, finalSig);
    setSignatureText('');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold font-heading text-[#14161A]">
            Conditional Offer Letters & Pre-Employment Agreements
          </h1>
          <p className="text-xs text-[#5B616B] mt-0.5">
            Auto-generate branded carrier offers with mandatory Part 391 compliance statements and digital e-signatures
          </p>
        </div>

        <button
          onClick={() => {
            if (tenantDrivers[0]) setTargetDriverId(tenantDrivers[0].id);
            if (tenantPayTemplates[0]) setSelectedPayTemplateId(tenantPayTemplates[0].id);
            setShowGenerateModal(true);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-xl shadow-xs transition-all active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #0E7C7B 0%, #2563EB 100%)',
          }}
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>Draft Offer Letter</span>
        </button>
      </div>

      {/* Main Split: Left Offers Roster, Right Offer Document Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Offers List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold text-[#9AA0A8] uppercase tracking-wider">
            Generated Offers ({tenantOffers.length})
          </div>

          <div className="space-y-2.5">
            {tenantOffers.map((offer) => {
              const isSelected = activeOffer?.id === offer.id;
              return (
                <div
                  key={offer.id}
                  onClick={() => setSelectedOfferId(offer.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-[#0E7C7B] shadow-md ring-1 ring-[#0E7C7B]/20'
                      : 'bg-white border-[#ECEAE4] hover:bg-[#FAF9F6] shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#14161A] font-heading">
                        {offer.driverName}
                      </h4>
                      <p className="text-[11px] text-[#5B616B]">{offer.position}</p>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                        offer.approvalStatus === 'Signed by Driver'
                          ? 'bg-emerald-100 text-emerald-800'
                          : offer.approvalStatus === 'Approved by Manager'
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {offer.approvalStatus}
                    </span>
                  </div>

                  <div className="mt-2 text-[11px] text-[#5B616B] truncate">
                    Pay: {offer.paySummary}
                  </div>

                  <div className="mt-2 pt-2 border-t border-[#ECEAE4] flex items-center justify-between text-[10px] text-[#9AA0A8]">
                    <span>Start: {offer.proposedStartDate}</span>
                    <span>v{offer.version}</span>
                  </div>
                </div>
              );
            })}

            {tenantOffers.length === 0 && (
              <div className="p-8 bg-white border border-[#ECEAE4] rounded-2xl text-center text-xs text-[#9AA0A8]">
                No offer letters drafted yet. Click "Draft Offer Letter" to begin.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Branded Letter Document Preview */}
        {activeOffer ? (
          <div className="lg:col-span-8 bg-white rounded-2xl border border-[#ECEAE4] p-8 shadow-sm space-y-6 print:border-none print:shadow-none">
            {/* Document Header Controls */}
            <div className="flex items-center justify-between pb-4 border-b border-[#ECEAE4] print:hidden">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#0E7C7B]">
                  ID: {activeOffer.id}
                </span>
                <span className="text-xs text-[#5B616B]">· Version {activeOffer.version}.0</span>
              </div>

              <div className="flex items-center gap-2">
                {activeOffer.approvalStatus === 'Pending Manager Approval' && isManager && (
                  <button
                    onClick={() => approveOffer(activeOffer.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0E7C7B] hover:bg-[#0c6b6a] rounded-xl flex items-center gap-1.5 shadow-2xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Manager Sign-Off</span>
                  </button>
                )}

                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 text-xs font-medium text-[#14161A] bg-[#FAF9F6] hover:bg-[#ECEAE4] border border-[#ECEAE4] rounded-xl flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
              </div>
            </div>

            {/* Letterhead */}
            <div className="flex items-start justify-between border-b border-[#14161A]/10 pb-6">
              <div>
                <div className="text-xl font-black font-heading tracking-tight text-[#14161A]">
                  {activeTenant.name}
                </div>
                <div className="text-xs text-[#5B616B] mt-1 space-y-0.5">
                  <div>US DOT #{activeTenant.dotNumber} · ICC MC #{activeTenant.mcNumber}</div>
                  <div>Corporate Headquarters · {activeTenant.hqLocation}</div>
                  <div>Phone: {activeTenant.contactPhone} · {activeTenant.contactEmail}</div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-[#0E7C7B] block">
                  CONDITIONAL OFFER
                </span>
                <span className="text-xs text-[#5B616B] font-mono mt-1 block">
                  Date: {new Date(activeOffer.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Salutation & Position */}
            <div className="space-y-4 text-xs leading-relaxed text-[#14161A]">
              <div>
                <strong>TO:</strong> {activeOffer.driverName}
                <br />
                <strong>POSITION OFFERED:</strong> Commercial Motor Vehicle Driver ({activeOffer.position})
                <br />
                <strong>PROPOSED START DATE:</strong> {activeOffer.proposedStartDate}
                <br />
                <strong>REPORTING TERMINAL:</strong> {activeOffer.orientationLocation}
              </div>

              <p>
                Dear {activeOffer.driverName.split(' ')[0]},
              </p>
              <p>
                On behalf of <strong>{activeTenant.name}</strong>, we are pleased to extend this formal
                conditional offer of employment for the position of Commercial Motor Vehicle Driver. We have
                been impressed by your background, professional driving record, and commitment to roadway safety.
              </p>

              {/* Compensation Terms Box */}
              <div className="p-4 rounded-xl border border-[#ECEAE4] bg-[#FAF9F6] space-y-2">
                <h4 className="font-bold text-[#14161A] text-xs uppercase tracking-wider">
                  Compensation & Benefits Schedule
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#9AA0A8] block">Base Pay Structure</span>
                    <strong className="text-[#14161A]">{activeOffer.paySummary}</strong>
                  </div>
                  <div>
                    <span className="text-[#9AA0A8] block">Performance Incentives</span>
                    <span>{activeOffer.bonusesSummary}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-[#ECEAE4] text-xs">
                  <span className="text-[#9AA0A8] block">Benefits Package</span>
                  <span>{activeOffer.benefitsSummary}</span>
                </div>
              </div>

              {/* MANDATORY LEGAL DISCLAIMER CALLOUT (FMCSA Part 391) */}
              <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/80 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-amber-900 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" strokeWidth={1.5} />
                  <span>Mandatory Statutory Pre-Employment Notice</span>
                </div>
                <p className="text-amber-950 font-medium leading-relaxed">
                  THIS CONDITIONAL OFFER DOES NOT GUARANTEE EMPLOYMENT. Final approval and official onboarding
                  are strictly contingent upon successful completion and verification of all FMCSA Part 391
                  Driver Qualification (DQ) requirements, including but not limited to:
                </p>
                <ul className="list-disc pl-5 space-y-0.5 text-amber-900">
                  <li>Satisfactory 3-year commercial driving record review (MVR & PSP history).</li>
                  <li>Receipt of verifiable DOT Employment Verifications (VOE) from prior carriers.</li>
                  <li>Negative pre-employment DOT drug & alcohol screen (49 CFR Part 40).</li>
                  <li>Full registration & clean status in the FMCSA Drug & Alcohol Clearinghouse.</li>
                  <li>Valid Medical Examiner's Certificate (DOT Medical Card) and successful road evaluation.</li>
                </ul>
              </div>

              <p>
                Failure to meet any of the aforementioned compliance standards or falsification of application data
                will result in immediate revocation of this conditional offer.
              </p>
            </div>

            {/* Signatures Block */}
            <div className="pt-6 border-t border-[#ECEAE4] grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              {/* Carrier Manager Signature */}
              <div className="p-4 rounded-xl border border-[#ECEAE4] bg-[#FAF9F6] space-y-2">
                <span className="text-[10px] font-semibold text-[#9AA0A8] uppercase tracking-wider block">
                  Carrier Authorization
                </span>
                <div className="font-serif italic text-base font-bold text-[#14161A]">
                  {activeOffer.approvedByManager || 'Pending Recruiting Manager Sign-Off'}
                </div>
                <div className="text-[11px] text-[#5B616B]">
                  {activeOffer.approvedByManager ? `Approved on ${new Date(activeOffer.managerApprovedAt || '').toLocaleDateString()}` : 'Awaiting Manager Review'}
                </div>
              </div>

              {/* Driver Signature / Sign Pad */}
              <div className="p-4 rounded-xl border border-[#ECEAE4] bg-white space-y-2">
                <span className="text-[10px] font-semibold text-[#9AA0A8] uppercase tracking-wider block">
                  Driver Acceptance & E-Signature
                </span>

                {activeOffer.driverSignature ? (
                  <div className="space-y-1">
                    <div className="font-serif italic text-lg font-bold text-[#0E7C7B]">
                      {activeOffer.driverSignature.signatureText}
                    </div>
                    <div className="text-[10px] text-[#5B616B] font-mono">
                      Signed: {new Date(activeOffer.driverSignature.signedAt).toLocaleString()}
                    </div>
                    <div className="text-[10px] text-[#9AA0A8] font-mono">
                      IP: {activeOffer.driverSignature.ipAddress}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Type legal name to e-sign"
                      value={signatureText}
                      onChange={(e) => setSignatureText(e.target.value)}
                      className="w-full text-xs px-3 py-1.5 border border-[#ECEAE4] rounded-lg outline-none font-serif italic"
                    />
                    <button
                      onClick={handleSign}
                      disabled={!signatureText.trim()}
                      className="w-full py-1.5 text-xs font-semibold text-white bg-[#0E7C7B] disabled:opacity-50 hover:bg-[#0c6b6a] rounded-lg transition-colors"
                    >
                      Sign & Accept Offer
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Modal: Generate Offer */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl border border-[#ECEAE4] shadow-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold font-heading text-[#14161A]">
              Draft Conditional Offer Letter
            </h3>

            <form onSubmit={handleGenerateOffer} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#14161A] font-medium mb-1">Select Candidate *</label>
                <select
                  value={targetDriverId}
                  onChange={(e) => setTargetDriverId(e.target.value)}
                  className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg bg-white"
                >
                  {tenantDrivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.firstName} {d.lastName} ({d.cdlNumber} - {d.targetPosition})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#14161A] font-medium mb-1">Select Approved Compensation Package *</label>
                <select
                  value={selectedPayTemplateId}
                  onChange={(e) => setSelectedPayTemplateId(e.target.value)}
                  className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg bg-white"
                >
                  {tenantPayTemplates.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.baseRateDisplay})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#14161A] font-medium mb-1">Proposed Orientation Start Date</label>
                <input
                  type="date"
                  value={proposedStartDate}
                  onChange={(e) => setProposedStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[#14161A] font-medium mb-1">Orientation Location & Terminal</label>
                <input
                  type="text"
                  value={orientationLocation}
                  onChange={(e) => setOrientationLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#ECEAE4]">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-[#ECEAE4] text-[#5B616B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#0E7C7B] text-white font-semibold shadow-xs"
                >
                  Generate Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
