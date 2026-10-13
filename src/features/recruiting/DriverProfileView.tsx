import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { ReadinessRing } from '../../components/common/ReadinessRing';
import { DriverPipelineStage } from '../../types';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Shield,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Send,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  PhoneCall,
  StickyNote,
  UserCheck,
  Download,
  AlertCircle,
  Award,
} from 'lucide-react';

interface DriverProfileViewProps {
  driverId: string;
  onOpenCallModal: (driverId: string) => void;
}

export const DriverProfileView: React.FC<DriverProfileViewProps> = ({
  driverId,
  onOpenCallModal,
}) => {
  const {
    drivers,
    currentTenantId,
    users,
    currentUserId,
    setView,
    moveDriverStage,
    updateDriverDocument,
    safetyApproveDriver,
    sendVoeRequest,
    addToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'timeline' | 'application' | 'documents' | 'communications' | 'verifications' | 'audit'
  >('overview');

  const [copiedLink, setCopiedLink] = useState(false);

  const driver = drivers.find((d) => d.id === driverId);
  const currentUser = users.find((u) => u.id === currentUserId);
  const isSafetyManager = currentUser?.role === 'Safety Manager' || currentUser?.role === 'Admin';

  if (!driver) {
    return (
      <div className="p-12 text-center">
        <p className="text-sm text-[#5B616B]">Driver record not found or belongs to another tenant.</p>
        <button
          onClick={() => setView('drivers')}
          className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#0E7C7B] rounded-xl"
        >
          Return to Directory
        </button>
      </div>
    );
  }

  const handleCopyPortalLink = () => {
    const portalUrl = `${window.location.origin}/apply/${driver.applicationToken}`;
    navigator.clipboard.writeText(portalUrl);
    setCopiedLink(true);
    addToast('Link Copied', 'Secure applicant portal link copied to clipboard', 'info');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSafetyApproval = (approved: boolean) => {
    safetyApproveDriver(
      driver.id,
      approved,
      approved ? 'Approved by Safety Manager after complete Part 391 review.' : 'Disqualified due to policy violation.'
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Back button & Candidate Header */}
      <div>
        <button
          onClick={() => setView('drivers')}
          className="inline-flex items-center gap-1.5 text-xs text-[#5B616B] hover:text-[#14161A] transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Directory</span>
        </button>

        <div className="bg-white rounded-2xl border border-[#ECEAE4] p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Driver Identity */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0E7C7B]/10 text-[#0E7C7B] flex items-center justify-center text-xl font-bold font-heading shrink-0 border border-[#0E7C7B]/20">
                {driver.firstName[0]}
                {driver.lastName[0]}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-xl font-bold font-heading text-[#14161A]">
                    {driver.firstName} {driver.lastName}
                  </h1>
                  <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-[#FAF9F6] border border-[#ECEAE4] text-[#14161A]">
                    {driver.cdlNumber} ({driver.cdlState})
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium capitalize">
                    {driver.stage.replace(/_/g, ' ')}
                  </span>
                  {driver.safetyApprovalStatus === 'Approved' && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Safety Cleared</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#5B616B] mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#9AA0A8]" />
                    {driver.city}, {driver.state}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#9AA0A8]" />
                    {driver.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#9AA0A8]" />
                    {driver.email}
                  </span>
                  <span className="font-mono text-xs text-[#14161A]">
                    {driver.totalExperienceYears} Yrs CDL-A
                  </span>
                </div>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => onOpenCallModal(driver.id)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#14161A] bg-white hover:bg-[#FAF9F6] border border-[#ECEAE4] rounded-xl transition-all shadow-2xs"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#0E7C7B]" strokeWidth={1.5} />
                <span>Log Call / Note</span>
              </button>

              <button
                onClick={handleCopyPortalLink}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#14161A] bg-[#FAF9F6] hover:bg-[#F5F4F0] border border-[#ECEAE4] rounded-xl transition-all"
                title="Copy secure link for driver self-service wizard"
              >
                {copiedLink ? (
                  <Check className="w-3.5 h-3.5 text-[#0E7C7B]" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-[#5B616B]" />
                )}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Portal Link'}</span>
              </button>

              <button
                onClick={() => setView('ocr_scan', driver.id)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white rounded-xl shadow-xs transition-all active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #0E7C7B 0%, #2563EB 100%)',
                }}
              >
                <Shield className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>Scan License (OCR)</span>
              </button>
            </div>
          </div>

          {/* Quick Stage Progression Pipeline Bar */}
          <div className="mt-5 pt-4 border-t border-[#ECEAE4]">
            <div className="flex items-center justify-between text-xs text-[#5B616B] mb-2">
              <span className="font-semibold text-[#14161A]">DOT Part 391 Qualification Stage</span>
              <span className="font-mono text-[#0E7C7B] font-semibold">
                Preliminary Readiness: {driver.dqReadinessPercentage}%
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-1.5">
              {[
                { key: 'new_lead', label: 'Lead' },
                { key: 'contacted', label: 'Contacted' },
                { key: 'pre_qualified', label: 'Pre-Qual' },
                { key: 'application_submitted', label: 'App Done' },
                { key: 'documents_review', label: 'Docs' },
                { key: 'voe_in_progress', label: 'VOE' },
                { key: 'conditional_offer', label: 'Offer' },
                { key: 'dq_ready', label: 'DQ Ready' },
              ].map((step, idx) => {
                const isCurrent = driver.stage === step.key;
                return (
                  <button
                    key={step.key}
                    onClick={() => moveDriverStage(driver.id, step.key as DriverPipelineStage)}
                    className={`py-1.5 px-2 rounded-lg text-center text-[11px] font-medium transition-all ${
                      isCurrent
                        ? 'bg-[#0E7C7B] text-white shadow-2xs'
                        : 'bg-[#FAF9F6] text-[#5B616B] hover:bg-[#ECEAE4]'
                    }`}
                  >
                    {step.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-1 border-b border-[#ECEAE4] overflow-x-auto pb-0.5">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'timeline', label: 'Timeline' },
          { id: 'application', label: 'DOT Application' },
          { id: 'documents', label: 'Documents & OCR' },
          { id: 'communications', label: `Comms (${driver.communications.length})` },
          { id: 'verifications', label: `VOEs (${driver.employmentHistory.length})` },
          { id: 'audit', label: 'Audit Log' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2 -mb-px ${
                isActive
                  ? 'border-[#0E7C7B] text-[#0E7C7B]'
                  : 'border-transparent text-[#5B616B] hover:text-[#14161A]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Commercial CDL & Qualifications */}
            <div className="bg-white rounded-2xl border border-[#ECEAE4] p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold font-heading text-[#14161A]">
                Commercial License & Medical Certificate
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[#9AA0A8] block">CDL Number & State</span>
                  <span className="font-mono font-bold text-[#14161A] text-sm mt-0.5 block">
                    {driver.cdlNumber} ({driver.cdlState})
                  </span>
                </div>
                <div>
                  <span className="text-[#9AA0A8] block">License Class</span>
                  <span className="font-bold text-[#14161A] text-sm mt-0.5 block">
                    {driver.cdlClass}
                  </span>
                </div>
                <div>
                  <span className="text-[#9AA0A8] block">CDL Expiration</span>
                  <span className="font-mono text-[#14161A] mt-0.5 block">
                    {driver.cdlExpiration}
                  </span>
                </div>
                <div>
                  <span className="text-[#9AA0A8] block">DOT Medical Card Expiration</span>
                  <span className="font-mono font-medium text-[#14161A] mt-0.5 block">
                    {driver.medCardExpiration}
                  </span>
                </div>
                <div>
                  <span className="text-[#9AA0A8] block">Moving Violations (36 Mo)</span>
                  <span className="font-mono font-medium text-[#14161A] mt-0.5 block">
                    {driver.movingViolationsCount} violations
                  </span>
                </div>
                <div>
                  <span className="text-[#9AA0A8] block">DOT Recordable Accidents</span>
                  <span className="font-mono font-medium text-[#14161A] mt-0.5 block">
                    {driver.accidentsCount} accidents
                  </span>
                </div>
              </div>

              {/* Endorsements & Restrictions */}
              <div className="pt-3 border-t border-[#ECEAE4] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#9AA0A8] block mb-1">Active Endorsements</span>
                  <div className="flex flex-wrap gap-1.5">
                    {driver.endorsements.length > 0 ? (
                      driver.endorsements.map((end) => (
                        <span key={end} className="px-2 py-0.5 bg-[#FAF9F6] border border-[#ECEAE4] rounded font-medium text-[#14161A]">
                          {end}
                        </span>
                      ))
                    ) : (
                      <span className="text-[#9AA0A8]">None declared</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[#9AA0A8] block mb-1">License Restrictions</span>
                  <div className="flex flex-wrap gap-1.5">
                    {driver.restrictions.length > 0 ? (
                      driver.restrictions.map((res) => (
                        <span key={res} className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-900 rounded font-medium">
                          {res}
                        </span>
                      ))
                    ) : (
                      <span className="text-[#9AA0A8]">None (Unrestricted)</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Recruiter Notes */}
            <div className="bg-white rounded-2xl border border-[#ECEAE4] p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold font-heading text-[#14161A]">Recruiting Notes</h3>
                <button
                  onClick={() => onOpenCallModal(driver.id)}
                  className="text-xs text-[#0E7C7B] hover:underline font-medium"
                >
                  Add Note
                </button>
              </div>
              <p className="text-xs text-[#5B616B] leading-relaxed bg-[#FAF9F6] p-3.5 rounded-xl border border-[#ECEAE4]">
                {driver.notes || 'No notes logged yet.'}
              </p>
            </div>
          </div>

          {/* Right Column: Safety Approval & Readiness */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#ECEAE4] p-5 shadow-sm text-center space-y-4">
              <h3 className="text-xs font-semibold text-[#9AA0A8] uppercase tracking-wider">
                Preliminary DQ Readiness
              </h3>

              <div className="flex justify-center py-2">
                <ReadinessRing percentage={driver.dqReadinessPercentage} size={90} strokeWidth={7} />
              </div>

              <div className="text-xs text-[#5B616B] leading-snug">
                Preliminary readiness score based on verified documents, clean MVR, and received VOEs.
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-left">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Compliance Mandate</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Preliminary readiness. Final qualification requires approval workflow by Safety Manager.
                </p>
              </div>

              {/* Safety Approval Action */}
              <div className="pt-2">
                {driver.safetyApprovalStatus === 'Approved' ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs text-left">
                    <div className="font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Safety Manager Approved</span>
                    </div>
                    <div className="text-[11px] text-emerald-700 mt-1">
                      Approved by {driver.safetyApprovedBy} on {new Date(driver.safetyApprovedAt || '').toLocaleDateString()}
                    </div>
                  </div>
                ) : isSafetyManager ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleSafetyApproval(true)}
                      className="w-full py-2 px-3 text-xs font-semibold text-white bg-[#0E7C7B] hover:bg-[#0c6b6a] rounded-xl transition-colors"
                    >
                      Authorize Final Safety Approval
                    </button>
                    <button
                      onClick={() => handleSafetyApproval(false)}
                      className="w-full py-1.5 px-3 text-xs font-medium text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                    >
                      Disqualify Candidate
                    </button>
                  </div>
                ) : (
                  <div className="text-[11px] text-[#9AA0A8] italic">
                    Safety authorization restricted to Safety Manager role. Switch user in top header to approve.
                  </div>
                )}
              </div>
            </div>

            {/* Quick Sourcing Metadata */}
            <div className="bg-white rounded-2xl border border-[#ECEAE4] p-5 shadow-sm text-xs space-y-2.5">
              <div className="text-xs font-semibold font-heading text-[#14161A] mb-1">
                Recruiting Attribution
              </div>
              <div className="flex justify-between py-1 border-b border-[#ECEAE4]">
                <span className="text-[#9AA0A8]">Lead Source</span>
                <span className="font-medium text-[#14161A]">{driver.source}</span>
              </div>
              {driver.referredBy && (
                <div className="flex justify-between py-1 border-b border-[#ECEAE4]">
                  <span className="text-[#9AA0A8]">Referred By</span>
                  <span className="font-medium text-[#0E7C7B]">{driver.referredBy}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-[#ECEAE4]">
                <span className="text-[#9AA0A8]">Lead Score</span>
                <span className="font-mono font-medium text-[#14161A]">{driver.leadScore} / 100</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#9AA0A8]">Profile Created</span>
                <span className="font-mono text-[#5B616B]">{new Date(driver.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Timeline */}
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-2xl border border-[#ECEAE4] p-6 shadow-sm space-y-6">
          <h3 className="text-sm font-semibold font-heading text-[#14161A]">
            Candidate Activity & Compliance Journey
          </h3>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#ECEAE4]">
            {driver.communications.map((comm) => (
              <div key={comm.id} className="relative">
                <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#0E7C7B]" />
                <div className="bg-[#FAF9F6] border border-[#ECEAE4] rounded-xl p-3 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#14161A]">
                      {comm.summary}
                    </span>
                    <span className="text-[10px] font-mono text-[#9AA0A8]">
                      {new Date(comm.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[#5B616B] leading-relaxed">{comm.details}</p>
                  <div className="mt-2 text-[10px] text-[#9AA0A8] flex items-center gap-2">
                    <span>Logged by: {comm.author} ({comm.authorRole})</span>
                    {comm.outcome && <span>· Outcome: {comm.outcome}</span>}
                  </div>
                </div>
              </div>
            ))}

            {driver.auditLogs.map((audit) => (
              <div key={audit.id} className="relative">
                <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#2563EB]" />
                <div className="bg-white border border-[#ECEAE4] rounded-xl p-3 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-[#14161A]">
                      {audit.action}
                    </span>
                    <span className="text-[10px] font-mono text-[#9AA0A8]">
                      {new Date(audit.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[#5B616B]">{audit.details}</p>
                  <div className="mt-1 text-[10px] text-[#9AA0A8]">
                    Actor: {audit.actor} ({audit.actorRole})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Applications */}
      {activeTab === 'application' && (
        <div className="bg-white rounded-2xl border border-[#ECEAE4] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#ECEAE4]">
            <div>
              <h3 className="text-sm font-semibold font-heading text-[#14161A]">
                Mobile DOT Application (FMCSA Part 391)
              </h3>
              <p className="text-xs text-[#5B616B] mt-0.5">
                Full 3-10 year employment history, accident record, and electronic authorization
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#0E7C7B] font-medium">
                {driver.applicationCompleted ? 'SUBMITTED & SIGNED' : 'INCOMPLETE'}
              </span>
              <button
                onClick={() => setView('driver_portal')}
                className="text-xs text-[#0E7C7B] hover:underline font-medium"
              >
                Open Wizard Preview
              </button>
            </div>
          </div>

          <div className="space-y-6 text-xs">
            {/* Employment History in App */}
            <div>
              <h4 className="font-semibold text-[#14161A] mb-3">
                Verifiable Commercial Driving Employment History (Past 3-10 Years)
              </h4>
              <div className="space-y-3">
                {driver.employmentHistory.map((emp) => (
                  <div key={emp.id} className="p-4 rounded-xl border border-[#ECEAE4] bg-[#FAF9F6]">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-semibold text-[#14161A]">{emp.companyName}</div>
                        <div className="text-xs text-[#5B616B] mt-0.5">
                          {emp.startDate} to {emp.endDate} · {emp.equipmentOperated}
                        </div>
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-[#ECEAE4] text-[#14161A]">
                        VOE: {emp.voeStatus}
                      </span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#ECEAE4] grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px]">
                      <div>
                        <span className="text-[#9AA0A8] block">Contact Person</span>
                        <span className="text-[#14161A]">{emp.contactPerson} ({emp.phone})</span>
                      </div>
                      <div>
                        <span className="text-[#9AA0A8] block">Reason for Leaving</span>
                        <span className="text-[#14161A]">{emp.reasonForLeaving}</span>
                      </div>
                      <div>
                        <span className="text-[#9AA0A8] block">FMCSR Safety Sensitive</span>
                        <span className="text-[#14161A]">{emp.dotSafetySensitive ? 'Yes (DOT Subject)' : 'No'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Applicant Electronic Signature */}
            <div className="p-4 rounded-xl border border-[#ECEAE4] bg-white space-y-2">
              <h4 className="font-semibold text-[#14161A]">Driver Electronic Affirmation & Disclosure</h4>
              <p className="text-[#5B616B] text-[11px] leading-relaxed">
                Applicant certified that this application was completed by them, and that all entries and information are true and complete to the best of their knowledge under 49 CFR Part 391.21.
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-[#5B616B] border-t border-[#ECEAE4]">
                <span>E-Signature: <strong className="text-[#14161A] font-serif italic text-sm">{driver.firstName} {driver.lastName}</strong></span>
                <span className="font-mono text-[#9AA0A8]">Timestamp: {driver.applicationCompletedAt || '2026-10-04 11:20:00 UTC'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Documents & OCR */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-2xl border border-[#ECEAE4] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#ECEAE4]">
            <div>
              <h3 className="text-sm font-semibold font-heading text-[#14161A]">
                DOT Qualification Documents (Part 391 File)
              </h3>
              <p className="text-xs text-[#5B616B] mt-0.5">
                Verify CDL images with AI OCR extraction, expiration tracking, and discrepancy detection
              </p>
            </div>
            <button
              onClick={() => setView('ocr_scan', driver.id)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0E7C7B] rounded-xl flex items-center gap-1.5 shadow-2xs"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Launch AI OCR Scanner</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {driver.documents.map((doc) => (
              <div key={doc.id} className="p-4 rounded-xl border border-[#ECEAE4] bg-[#FAF9F6] space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#14161A] block">{doc.type}</span>
                    <span className="text-[11px] text-[#5B616B] font-mono">{doc.fileName} ({doc.fileSize})</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                      doc.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : doc.status === 'Expired'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>

                {doc.expiresAt && (
                  <div className="text-[11px] text-[#5B616B]">
                    Expiration Date: <strong className="font-mono text-[#14161A]">{doc.expiresAt}</strong>
                  </div>
                )}

                {/* OCR preview data */}
                {doc.ocrExtracted && (
                  <div className="p-2.5 bg-white border border-[#ECEAE4] rounded-lg space-y-1 text-[11px]">
                    <div className="text-[10px] font-semibold text-[#0E7C7B] uppercase tracking-wider">
                      Gemini OCR Extracted Data
                    </div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 font-mono text-[10px]">
                      {Object.entries(doc.ocrExtracted).map(([key, data]) => (
                        <div key={key} className="truncate">
                          <span className="text-[#9AA0A8]">{key}: </span>
                          <span className="text-[#14161A]">{data.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-[#ECEAE4] flex items-center justify-between text-xs">
                  <span className="text-[10px] text-[#9AA0A8]">
                    {doc.verifiedBy ? `Verified by ${doc.verifiedBy}` : 'Pending verification'}
                  </span>
                  <div className="flex items-center gap-2">
                    {doc.status !== 'Approved' && (
                      <button
                        onClick={() => updateDriverDocument(driver.id, doc.id, { status: 'Approved' })}
                        className="px-2 py-1 text-[11px] font-semibold text-[#0E7C7B] hover:bg-[#0E7C7B]/10 rounded transition-colors"
                      >
                        Approve Document
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Communications */}
      {activeTab === 'communications' && (
        <div className="bg-white rounded-2xl border border-[#ECEAE4] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#ECEAE4]">
            <h3 className="text-sm font-semibold font-heading text-[#14161A]">
              Recruiter Communications & Call Logs
            </h3>
            <button
              onClick={() => onOpenCallModal(driver.id)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0E7C7B] rounded-xl shadow-2xs"
            >
              + Log Call or Note
            </button>
          </div>

          <div className="space-y-3">
            {driver.communications.map((comm) => (
              <div key={comm.id} className="p-3.5 bg-[#FAF9F6] border border-[#ECEAE4] rounded-xl text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#14161A]">{comm.summary}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-white border border-[#ECEAE4] text-[#5B616B] uppercase font-mono">
                      {comm.type.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#9AA0A8]">
                    {new Date(comm.timestamp).toLocaleString()}
                  </span>
                </div>
                {comm.details && (
                  <p className="text-[#5B616B] leading-relaxed">{comm.details}</p>
                )}
                <div className="flex items-center justify-between text-[10px] text-[#9AA0A8] pt-1">
                  <span>Logged by: {comm.author} ({comm.authorRole})</span>
                  {comm.outcome && <span>Outcome: <strong className="text-[#14161A]">{comm.outcome}</strong></span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Verifications (VOE) */}
      {activeTab === 'verifications' && (
        <div className="bg-white rounded-2xl border border-[#ECEAE4] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#ECEAE4]">
            <div>
              <h3 className="text-sm font-semibold font-heading text-[#14161A]">
                Verification of Employment (DOT § 391.23)
              </h3>
              <p className="text-xs text-[#5B616B] mt-0.5">
                Previous carrier inquiry timeline and drug/alcohol test history requests
              </p>
            </div>
            <button
              onClick={() => setView('voe')}
              className="text-xs text-[#0E7C7B] hover:underline font-medium"
            >
              Open Full VOE Manager
            </button>
          </div>

          <div className="space-y-4">
            {driver.employmentHistory.map((emp) => (
              <div key={emp.id} className="p-4 rounded-xl border border-[#ECEAE4] bg-[#FAF9F6] space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-[#14161A]">{emp.companyName}</h4>
                    <p className="text-xs text-[#5B616B] mt-0.5">
                      Contact: {emp.contactPerson} · Phone: {emp.phone} · Email: {emp.email}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
                      emp.voeStatus === 'Received'
                        ? 'bg-emerald-100 text-emerald-800'
                        : emp.voeStatus === 'Overdue'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {emp.voeStatus}
                  </span>
                </div>

                {emp.voeNotes && (
                  <p className="text-xs text-[#5B616B] bg-white p-2.5 rounded-lg border border-[#ECEAE4]">
                    {emp.voeNotes}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-[#ECEAE4] text-xs">
                  <div className="text-[11px] text-[#9AA0A8]">
                    {emp.voeSentDate && `Sent: ${emp.voeSentDate}`}
                    {emp.voeReceivedDate && ` · Received: ${emp.voeReceivedDate}`}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => sendVoeRequest(driver.id, emp.id, 'email')}
                      className="px-2.5 py-1 text-xs font-semibold text-[#14161A] bg-white hover:bg-[#FAF9F6] border border-[#ECEAE4] rounded-lg transition-colors"
                    >
                      Resend via Email
                    </button>
                    <button
                      onClick={() => sendVoeRequest(driver.id, emp.id, 'fax')}
                      className="px-2.5 py-1 text-xs font-semibold text-[#14161A] bg-white hover:bg-[#FAF9F6] border border-[#ECEAE4] rounded-lg transition-colors"
                    >
                      Resend via Fax
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: Audit Log */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-[#ECEAE4] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#ECEAE4]">
            <div>
              <h3 className="text-sm font-semibold font-heading text-[#14161A]">
                Immutable Compliance Audit Trail
              </h3>
              <p className="text-xs text-[#5B616B] mt-0.5">
                Every modification is permanently recorded with before/after values, user, and UTC timestamp
              </p>
            </div>
            <span className="text-[11px] font-mono text-[#0E7C7B]">FMCSR Read-Only Record</span>
          </div>

          <div className="divide-y divide-[#ECEAE4]">
            {driver.auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                <div>
                  <div className="font-semibold text-[#14161A] flex items-center gap-2">
                    <span>{log.action}</span>
                    {log.field && (
                      <span className="text-[11px] font-mono text-[#5B616B]">
                        [{log.field}: {log.oldValue || 'none'} → {log.newValue}]
                      </span>
                    )}
                  </div>
                  <p className="text-[#5B616B] mt-0.5">{log.details}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[11px] font-mono text-[#9AA0A8]">
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-[#5B616B]">
                    {log.actor} ({log.actorRole})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
