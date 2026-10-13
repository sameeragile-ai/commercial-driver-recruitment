import React, { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { Driver, PositionType, CdlClass } from '../../types';
import { X, AlertTriangle, GitMerge, UserCheck, Shield, CheckCircle2 } from 'lucide-react';

interface NewDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewDriverModal: React.FC<NewDriverModalProps> = ({ isOpen, onClose }) => {
  const { drivers, currentTenantId, currentUserId, users, addDriver, mergeDrivers, setView } = useStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cdlNumber, setCdlNumber] = useState('');
  const [cdlState, setCdlState] = useState('TX');
  const [cdlClass, setCdlClass] = useState<CdlClass>('Class A');
  const [targetPosition, setTargetPosition] = useState<PositionType>('OTR Solo');
  const [source, setSource] = useState('Direct Inbound');
  const [experienceYears, setExperienceYears] = useState(3);
  const [notes, setNotes] = useState('');

  const tenantDrivers = useMemo(() => {
    return drivers.filter((d) => d.tenantId === currentTenantId);
  }, [drivers, currentTenantId]);

  // Duplicate detection algorithm
  const duplicateMatches = useMemo(() => {
    if (!firstName && !lastName && !cdlNumber && !phone && !email) return [];

    const matches: Array<{ driver: Driver; score: number; reasons: string[] }> = [];

    tenantDrivers.forEach((candidate) => {
      let score = 0;
      const reasons: string[] = [];

      // Match CDL number
      if (cdlNumber.trim() && candidate.cdlNumber.toLowerCase() === cdlNumber.toLowerCase().trim()) {
        score += 70;
        reasons.push(`Exact CDL # match (${candidate.cdlNumber})`);
      }

      // Match Phone
      const cleanInputPhone = phone.replace(/\D/g, '');
      const cleanCandidatePhone = candidate.phone.replace(/\D/g, '');
      if (cleanInputPhone.length >= 7 && cleanCandidatePhone.includes(cleanInputPhone)) {
        score += 40;
        reasons.push(`Matching phone number (${candidate.phone})`);
      }

      // Match Email
      if (email.trim() && candidate.email.toLowerCase() === email.toLowerCase().trim()) {
        score += 50;
        reasons.push(`Matching email address (${candidate.email})`);
      }

      // Match Name
      const nameMatchFirst = firstName.trim().toLowerCase() === candidate.firstName.toLowerCase();
      const nameMatchLast = lastName.trim().toLowerCase() === candidate.lastName.toLowerCase();
      if (nameMatchFirst && nameMatchLast) {
        score += 35;
        reasons.push(`Full name match (${candidate.firstName} ${candidate.lastName})`);
      } else if (nameMatchLast) {
        score += 15;
        reasons.push(`Last name match (${candidate.lastName})`);
      }

      if (score >= 30) {
        matches.push({ driver: candidate, score: Math.min(100, score), reasons });
      }
    });

    return matches.sort((a, b) => b.score - a.score);
  }, [firstName, lastName, cdlNumber, phone, email, tenantDrivers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName) return;

    const newDriver = addDriver({
      firstName,
      lastName,
      email: email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@emaildriver.net`,
      phone: phone || '(555) 000-0000',
      cdlNumber: cdlNumber || `TX${Math.floor(1000000 + Math.random() * 8999999)}`,
      cdlState,
      cdlClass,
      targetPosition,
      source,
      totalExperienceYears: Number(experienceYears),
      notes,
    });

    onClose();
    setView('driver_profile', newDriver.id);
  };

  const handleMerge = (existingDriverId: string) => {
    // Creates a temporary driver entry and triggers merge
    const tempDriver = addDriver({
      firstName,
      lastName,
      email,
      phone,
      cdlNumber,
      cdlState,
      cdlClass,
      targetPosition,
      source,
      notes: `[Duplicate submitted] ${notes}`,
    });
    mergeDrivers(existingDriverId, tempDriver.id);
    onClose();
    setView('driver_profile', existingDriverId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-[#ECEAE4] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ECEAE4]">
          <div>
            <h3 className="text-base font-semibold font-heading text-[#14161A]">Add Candidate Record</h3>
            <p className="text-xs text-[#5B616B] mt-0.5">
              Enter applicant information with automated DOT duplicate screening.
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-[#9AA0A8] hover:text-[#14161A] rounded-lg">
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 max-h-[75vh] overflow-y-auto space-y-4">
          {/* Duplicate Match Warning Panel */}
          {duplicateMatches.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" strokeWidth={1.5} />
                  <span>Possible Duplicate Records Detected ({duplicateMatches[0].score}% Match)</span>
                </div>
                <span className="text-[11px] font-mono text-amber-700">DOT Deduplication Alert</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Found {duplicateMatches.length} existing candidate(s) sharing credentials. You can merge into an existing profile or proceed with a separate entry.
              </p>

              <div className="space-y-1.5 mt-2">
                {duplicateMatches.slice(0, 2).map(({ driver, score, reasons }) => (
                  <div
                    key={driver.id}
                    className="flex items-center justify-between p-2.5 bg-white border border-amber-200 rounded-lg text-xs"
                  >
                    <div>
                      <div className="font-semibold text-[#14161A] flex items-center gap-2">
                        <span>{driver.firstName} {driver.lastName}</span>
                        <span className="text-[11px] font-mono text-[#5B616B]">CDL: {driver.cdlNumber} ({driver.cdlState})</span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded font-mono font-medium">
                          {score}% match
                        </span>
                      </div>
                      <div className="text-[11px] text-[#5B616B] mt-0.5">
                        {reasons.join(' · ')}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleMerge(driver.id)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors shrink-0"
                    >
                      <GitMerge className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span>Merge Into Existing</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#14161A] mb-1">First Name *</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Michael"
                className="w-full text-xs px-3 py-2 border border-[#ECEAE4] rounded-lg outline-none focus:border-[#0E7C7B]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#14161A] mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Miller"
                className="w-full text-xs px-3 py-2 border border-[#ECEAE4] rounded-lg outline-none focus:border-[#0E7C7B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#14161A] mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(214) 555-0199"
                className="w-full text-xs px-3 py-2 border border-[#ECEAE4] rounded-lg outline-none focus:border-[#0E7C7B]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#14161A] mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="driver@example.com"
                className="w-full text-xs px-3 py-2 border border-[#ECEAE4] rounded-lg outline-none focus:border-[#0E7C7B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#14161A] mb-1">CDL Number</label>
              <input
                type="text"
                value={cdlNumber}
                onChange={(e) => setCdlNumber(e.target.value)}
                placeholder="TX8392019"
                className="w-full text-xs font-mono px-3 py-2 border border-[#ECEAE4] rounded-lg outline-none focus:border-[#0E7C7B]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#14161A] mb-1">State</label>
              <select
                value={cdlState}
                onChange={(e) => setCdlState(e.target.value)}
                className="w-full text-xs px-2.5 py-2 border border-[#ECEAE4] rounded-lg outline-none focus:border-[#0E7C7B] bg-white"
              >
                {['TX', 'OH', 'PA', 'GA', 'FL', 'NC', 'IL', 'IN', 'TN', 'MI', 'MO', 'VA', 'SC', 'KY', 'AL'].map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#14161A] mb-1">CDL Class</label>
              <select
                value={cdlClass}
                onChange={(e) => setCdlClass(e.target.value as CdlClass)}
                className="w-full text-xs px-2.5 py-2 border border-[#ECEAE4] rounded-lg outline-none focus:border-[#0E7C7B] bg-white"
              >
                <option value="Class A">Class A</option>
                <option value="Class B">Class B</option>
                <option value="Class C">Class C</option>
                <option value="Non-CDL">Non-CDL</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#14161A] mb-1">Target Position</label>
              <select
                value={targetPosition}
                onChange={(e) => setTargetPosition(e.target.value as PositionType)}
                className="w-full text-xs px-2.5 py-2 border border-[#ECEAE4] rounded-lg outline-none focus:border-[#0E7C7B] bg-white"
              >
                <option value="OTR Solo">OTR Solo</option>
                <option value="OTR Team">OTR Team</option>
                <option value="Regional Dry Van">Regional Dry Van</option>
                <option value="Reefer Division">Reefer Division</option>
                <option value="Dedicated Fleet">Dedicated Fleet</option>
                <option value="Flatbed Specialized">Flatbed Specialized</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#14161A] mb-1">Lead Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full text-xs px-2.5 py-2 border border-[#ECEAE4] rounded-lg outline-none focus:border-[#0E7C7B] bg-white"
              >
                <option value="Indeed">Indeed</option>
                <option value="TruckersReport">TruckersReport</option>
                <option value="Facebook Lead Ads">Facebook Lead Ads</option>
                <option value="Driver Referral">Driver Referral</option>
                <option value="Direct Inbound">Direct Inbound</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#14161A] mb-1">Tractor Experience</label>
              <input
                type="number"
                min="0"
                max="40"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 border border-[#ECEAE4] rounded-lg outline-none focus:border-[#0E7C7B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#14161A] mb-1">Initial Recruiter Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Driver mentioned preference for Midwest regional routes with weekend home time..."
              className="w-full text-xs px-3 py-2 border border-[#ECEAE4] rounded-lg outline-none focus:border-[#0E7C7B]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#ECEAE4]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#5B616B] hover:text-[#14161A] rounded-xl border border-[#ECEAE4] hover:bg-[#FAF9F6] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-xs transition-all active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #0E7C7B 0%, #2563EB 100%)',
              }}
            >
              Create Driver Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
