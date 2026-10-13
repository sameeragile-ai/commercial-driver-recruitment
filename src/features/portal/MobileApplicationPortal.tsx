import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import {
  Truck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Shield,
  Smartphone,
  Save,
  PenTool,
  Lock,
  User,
  MapPin,
  Clock,
  Check,
  FileCheck,
} from 'lucide-react';

interface MobileApplicationPortalProps {
  onBackToApp?: () => void;
}

export const MobileApplicationPortal: React.FC<MobileApplicationPortalProps> = ({
  onBackToApp,
}) => {
  const {
    currentTenantId,
    tenants,
    drivers,
    updateDriver,
    addToast,
    setView,
  } = useStore();

  const activeTenant = tenants.find((t) => t.id === currentTenantId) || tenants[0];

  // Pick or default candidate for previewing the portal
  const tenantDrivers = drivers.filter((d) => d.tenantId === currentTenantId);
  const [selectedDriverId, setSelectedDriverId] = useState<string>(tenantDrivers[0]?.id || '');
  const activeDriver = drivers.find((d) => d.id === selectedDriverId) || tenantDrivers[0];

  const [step, setStep] = useState(1);
  const totalSteps = 7;

  // Auto-save feedback state
  const [lastSavedTime, setLastSavedTime] = useState('Saved just now');
  const [isSaving, setIsSaving] = useState(false);

  // Form states with smart prefill from driver record (data reuse!)
  const [formData, setFormData] = useState({
    firstName: activeDriver?.firstName || 'Michael',
    lastName: activeDriver?.lastName || 'Miller',
    phone: activeDriver?.phone || '(214) 555-0199',
    email: activeDriver?.email || 'michael.miller@emaildriver.net',
    dob: activeDriver?.dateOfBirth || '1984-06-14',
    address: '4824 Elm Creek Pkwy',
    city: activeDriver?.city || 'Fort Worth',
    state: activeDriver?.state || 'TX',
    zip: activeDriver?.zip || '76132',
    cdlNumber: activeDriver?.cdlNumber || 'TX9841280',
    cdlState: activeDriver?.cdlState || 'TX',
    cdlClass: activeDriver?.cdlClass || 'Class A',
    cdlExpiration: activeDriver?.cdlExpiration || '2028-06-14',
    experienceYears: activeDriver?.totalExperienceYears || 4,
    equipmentType: '53ft Dry Van / Refrigerated Trailer',
    priorEmployer1: 'Heartland Express Carrier',
    priorDates1: '2023 - 2026',
    priorEmployer2: 'Swift Transportation',
    priorDates2: '2020 - 2023',
    accidents: 0,
    violations: 0,
    clearinghouseConsent: true,
    mvrConsent: true,
    signatureName: `${activeDriver?.firstName || 'Michael'} ${activeDriver?.lastName || 'Miller'}`,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Auto-save trigger
  const triggerAutoSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setLastSavedTime('Saved just now');
    }, 600);
  };

  const handleNext = () => {
    triggerAutoSave();
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Final submission
      if (activeDriver) {
        updateDriver(activeDriver.id, {
          applicationCompleted: true,
          applicationCompletedAt: new Date().toISOString(),
          stage: 'application_submitted',
        });
      }
      setIsSubmitted(true);
      addToast('Application Submitted', 'Full DOT Part 391 application received with digital signature', 'success');
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const stepTitles = [
    'Personal & Contact Details',
    'Commercial CDL Credentials',
    '3-10 Year Employment History',
    'Driving Equipment & Experience',
    'Safety Record & Violations',
    'FMCSR Disclosures & Consents',
    'Applicant Electronic Signature',
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#14161A] flex flex-col items-center p-4 sm:p-6 font-sans">
      {/* Top Demo Bar */}
      <div className="w-full max-w-xl mb-4 flex items-center justify-between text-xs text-[#5B616B]">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-[#0E7C7B]" />
          <span className="font-semibold text-[#14161A]">Driver Mobile View</span>
          <span className="font-mono text-[10px] bg-white border border-[#ECEAE4] px-1.5 py-0.5 rounded">
            /apply/{activeDriver?.applicationToken || 'secure-token'}
          </span>
        </div>

        <button
          onClick={onBackToApp || (() => setView('dashboard'))}
          className="text-xs text-[#0E7C7B] hover:underline font-semibold"
        >
          Exit to Recruiter Dashboard →
        </button>
      </div>

      {/* Main Mobile App Card */}
      <div className="w-full max-w-xl bg-white rounded-2xl border border-[#ECEAE4] shadow-lg overflow-hidden flex flex-col">
        {/* Brand Header */}
        <div className="px-6 py-4 border-b border-[#ECEAE4] bg-[#FAF9F6]/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold font-heading text-sm shadow-2xs"
              style={{ backgroundColor: activeTenant.primaryColor }}
            >
              {activeTenant.logoText.slice(0, 2)}
            </div>
            <div>
              <h2 className="text-sm font-bold font-heading text-[#14161A] leading-tight">
                {activeTenant.name}
              </h2>
              <p className="text-[10px] text-[#5B616B] font-mono">
                DOT #{activeTenant.dotNumber} · Driver Qualification Form
              </p>
            </div>
          </div>

          <div className="text-right text-[11px] text-[#5B616B]">
            <span className="font-mono text-[#0E7C7B] flex items-center gap-1 justify-end font-medium">
              <span className={`w-1.5 h-1.5 rounded-full ${isSaving ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
              {isSaving ? 'Saving...' : lastSavedTime}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        {!isSubmitted && (
          <div className="px-6 pt-4 pb-2 bg-white">
            <div className="flex items-center justify-between text-xs text-[#5B616B] mb-2 font-medium">
              <span>Step {step} of {totalSteps}: {stepTitles[step - 1]}</span>
              <span className="font-mono text-[#0E7C7B] font-bold">
                {Math.round((step / totalSteps) * 100)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#ECEAE4] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0E7C7B] to-[#2563EB] transition-all duration-300 rounded-full"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 flex-1">
          {isSubmitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-[#14161A]">
                  Application Successfully Submitted!
                </h3>
                <p className="text-xs text-[#5B616B] max-w-sm mx-auto mt-1 leading-relaxed">
                  Thank you, {formData.firstName}. Your DOT employment application and signed disclosures have been securely transmitted to {activeTenant.name}'s safety team.
                </p>
              </div>

              <div className="p-4 bg-[#FAF9F6] border border-[#ECEAE4] rounded-xl text-xs text-left max-w-sm mx-auto space-y-2">
                <div className="font-semibold text-[#14161A]">Next Qualification Steps:</div>
                <div className="text-[11px] text-[#5B616B] space-y-1">
                  <div>1. Recruiter reviews verified driving credentials</div>
                  <div>2. Automated VOE inquiries sent to previous carriers</div>
                  <div>3. Drug screen authorization barcode sent via SMS</div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setStep(1);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-[#5B616B] hover:text-[#14161A] rounded-xl border border-[#ECEAE4]"
                >
                  Restart Application Demo
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              {/* Step 1: Personal Info */}
              {step === 1 && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#14161A] font-semibold mb-1">First Name *</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[#14161A] font-semibold mb-1">Last Name *</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#14161A] font-semibold mb-1">Phone Number *</label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[#14161A] font-semibold mb-1">Date of Birth *</label>
                      <input
                        type="date"
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#14161A] font-semibold mb-1">Residential Street Address *</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[#14161A] font-semibold mb-1">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[#14161A] font-semibold mb-1">State</label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[#14161A] font-semibold mb-1">ZIP Code</label>
                      <input
                        type="text"
                        value={formData.zip}
                        onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                        className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: CDL Credentials */}
              {step === 2 && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#14161A] font-semibold mb-1">CDL License Number *</label>
                      <input
                        type="text"
                        value={formData.cdlNumber}
                        onChange={(e) => setFormData({ ...formData, cdlNumber: e.target.value })}
                        className="w-full font-mono px-3 py-2 border border-[#ECEAE4] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[#14161A] font-semibold mb-1">Issuing State *</label>
                      <input
                        type="text"
                        value={formData.cdlState}
                        onChange={(e) => setFormData({ ...formData, cdlState: e.target.value })}
                        className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#14161A] font-semibold mb-1">License Class</label>
                      <select
                        value={formData.cdlClass}
                        onChange={(e) => setFormData({ ...formData, cdlClass: e.target.value as any })}
                        className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg bg-white"
                      >
                        <option value="Class A">Class A CDL (Combination Tractor)</option>
                        <option value="Class B">Class B CDL (Straight Truck)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#14161A] font-semibold mb-1">CDL Expiration Date</label>
                      <input
                        type="date"
                        value={formData.cdlExpiration}
                        onChange={(e) => setFormData({ ...formData, cdlExpiration: e.target.value })}
                        className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF9F6] border border-[#ECEAE4] rounded-xl text-[11px] text-[#5B616B] space-y-1">
                    <div className="font-semibold text-[#14161A]">License Integrity Check:</div>
                    <p>
                      Your CDL number will be verified with the state Department of Public Safety via AAMVA and CDLIS.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Employment History */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="p-3 bg-[#FAF9F6] border border-[#ECEAE4] rounded-xl text-xs space-y-2">
                    <span className="font-bold text-[#14161A] block">Prior Commercial Carrier 1</span>
                    <input
                      type="text"
                      placeholder="Carrier Name"
                      value={formData.priorEmployer1}
                      onChange={(e) => setFormData({ ...formData, priorEmployer1: e.target.value })}
                      className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Years of Service (e.g. 2023 - 2026)"
                      value={formData.priorDates1}
                      onChange={(e) => setFormData({ ...formData, priorDates1: e.target.value })}
                      className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg bg-white"
                    />
                  </div>

                  <div className="p-3 bg-[#FAF9F6] border border-[#ECEAE4] rounded-xl text-xs space-y-2">
                    <span className="font-bold text-[#14161A] block">Prior Commercial Carrier 2</span>
                    <input
                      type="text"
                      placeholder="Carrier Name"
                      value={formData.priorEmployer2}
                      onChange={(e) => setFormData({ ...formData, priorEmployer2: e.target.value })}
                      className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Years of Service"
                      value={formData.priorDates2}
                      onChange={(e) => setFormData({ ...formData, priorDates2: e.target.value })}
                      className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Equipment & Experience */}
              {step === 4 && (
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[#14161A] font-semibold mb-1">
                      Total Commercial Driving Experience (Years)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="40"
                      value={formData.experienceYears}
                      onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[#14161A] font-semibold mb-1">
                      Primary Equipment Operated
                    </label>
                    <input
                      type="text"
                      value={formData.equipmentType}
                      onChange={(e) => setFormData({ ...formData, equipmentType: e.target.value })}
                      className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Accidents & Violations */}
              {step === 5 && (
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[#14161A] font-semibold mb-1">
                      DOT Recordable Accidents in Past 3 Years
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={formData.accidents}
                      onChange={(e) => setFormData({ ...formData, accidents: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[#14161A] font-semibold mb-1">
                      Moving Violations in Past 36 Months
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={formData.violations}
                      onChange={(e) => setFormData({ ...formData, violations: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Step 6: Consents */}
              {step === 6 && (
                <div className="space-y-3">
                  <div className="p-3 bg-[#FAF9F6] border border-[#ECEAE4] rounded-xl flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={formData.clearinghouseConsent}
                      onChange={(e) => setFormData({ ...formData, clearinghouseConsent: e.target.checked })}
                      className="mt-0.5 accent-[#0E7C7B]"
                    />
                    <div className="text-[11px] text-[#5B616B] leading-relaxed">
                      <strong className="text-[#14161A] block">FMCSA Drug & Alcohol Clearinghouse Consent</strong>
                      I authorize {activeTenant.name} to conduct pre-employment and annual full queries in the FMCSA Clearinghouse.
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF9F6] border border-[#ECEAE4] rounded-xl flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={formData.mvrConsent}
                      onChange={(e) => setFormData({ ...formData, mvrConsent: e.target.checked })}
                      className="mt-0.5 accent-[#0E7C7B]"
                    />
                    <div className="text-[11px] text-[#5B616B] leading-relaxed">
                      <strong className="text-[#14161A] block">Motor Vehicle Report (MVR & PSP) Authorization</strong>
                      I authorize procurement of continuous Motor Vehicle Records from state licensing authorities.
                    </div>
                  </div>
                </div>
              )}

              {/* Step 7: Signature */}
              {step === 7 && (
                <div className="space-y-4">
                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-relaxed">
                    Under 49 CFR Part 391.21, I certify that this application was completed by me, and that all entries on it and information in it are true and complete to the best of my knowledge.
                  </div>

                  <div>
                    <label className="block text-[#14161A] font-semibold mb-1">
                      Applicant Full Legal Signature *
                    </label>
                    <input
                      type="text"
                      value={formData.signatureName}
                      onChange={(e) => setFormData({ ...formData, signatureName: e.target.value })}
                      placeholder="Type your legal name"
                      className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg font-serif italic text-base"
                    />
                  </div>

                  <div className="text-[10px] text-[#9AA0A8] flex items-center justify-between font-mono">
                    <span>IP Logged: TLS Encrypted</span>
                    <span>Date: {new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons Footer */}
        {!isSubmitted && (
          <div className="px-6 py-4 border-t border-[#ECEAE4] bg-[#FAF9F6] flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2 text-xs font-semibold text-[#5B616B] hover:text-[#14161A] bg-white border border-[#ECEAE4] rounded-xl transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2 text-xs font-semibold text-white rounded-xl shadow-xs transition-all active:scale-[0.98] flex items-center gap-1.5"
              style={{
                background: 'linear-gradient(135deg, #0E7C7B 0%, #2563EB 100%)',
              }}
            >
              <span>{step === totalSteps ? 'Affirm & Submit Application' : 'Next Step'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
