import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { CommunicationLog } from '../../types';
import { PhoneCall, Mail, MessageSquare, StickyNote, X, Calendar, CheckCircle2 } from 'lucide-react';

interface CallNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverId: string;
}

export const CallNoteModal: React.FC<CallNoteModalProps> = ({ isOpen, onClose, driverId }) => {
  const { drivers, addCommunication } = useStore();
  const driver = drivers.find((d) => d.id === driverId);

  const [type, setType] = useState<CommunicationLog['type']>('outbound_call');
  const [outcome, setOutcome] = useState<CommunicationLog['outcome']>('Connected');
  const [summary, setSummary] = useState('');
  const [details, setDetails] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');

  if (!isOpen || !driver) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) return;

    addCommunication(driverId, {
      type,
      author: '',
      authorRole: '',
      summary,
      details,
      outcome,
      followUpDate: followUpDate || undefined,
    });

    onClose();
    setSummary('');
    setDetails('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-[#ECEAE4] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ECEAE4]">
          <div>
            <h3 className="text-sm font-semibold font-heading text-[#14161A]">Log Communication / Note</h3>
            <p className="text-xs text-[#5B616B] mt-0.5">
              Candidate: {driver.firstName} {driver.lastName} · {driver.phone}
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-[#9AA0A8] hover:text-[#14161A] rounded-lg">
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#14161A] mb-1.5">Communication Type</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'outbound_call', label: 'Outbound Call', icon: PhoneCall },
                { id: 'inbound_call', label: 'Inbound Call', icon: PhoneCall },
                { id: 'internal_note', label: 'Internal Note', icon: StickyNote },
                { id: 'sms', label: 'SMS / Text', icon: MessageSquare },
              ].map((item) => {
                const isSelected = type === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setType(item.id as any)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'border-[#0E7C7B] bg-[#0E7C7B]/5 text-[#0E7C7B] font-semibold'
                        : 'border-[#ECEAE4] text-[#5B616B] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1" strokeWidth={1.5} />
                    <span className="text-[11px] leading-tight">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {(type === 'outbound_call' || type === 'inbound_call') && (
            <div>
              <label className="block text-xs font-medium text-[#14161A] mb-1">Call Outcome</label>
              <select
                value={outcome}
                onChange={(e) => setOutcome(e.target.value as any)}
                className="w-full text-xs px-3 py-2 border border-[#ECEAE4] rounded-lg outline-none focus:border-[#0E7C7B] bg-white"
              >
                <option value="Connected">Connected - Discussed Opportunity</option>
                <option value="Left Voicemail">Left Voicemail with Callback Info</option>
                <option value="No Answer">No Answer / Line Busy</option>
                <option value="Scheduled Follow-up">Scheduled Follow-up Call</option>
                <option value="Sent Application">Sent Mobile Application Link</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#14161A] mb-1">Summary *</label>
            <input
              type="text"
              required
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="e.g. Discussed dry van freight lane options and weekly mileage expectation"
              className="w-full text-xs px-3 py-2 border border-[#ECEAE4] rounded-lg outline-none focus:border-[#0E7C7B]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#14161A] mb-1">Details & Context</label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Driver prefers Midwest regional runs. Mentioned he has 4 years clean driving with CFI. Ready to start in 2 weeks."
              className="w-full text-xs px-3 py-2 border border-[#ECEAE4] rounded-lg outline-none focus:border-[#0E7C7B]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#14161A] mb-1">Follow-up Reminder Date (Optional)</label>
            <div className="relative">
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-[#ECEAE4] rounded-lg outline-none focus:border-[#0E7C7B]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#ECEAE4]">
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
              Save Communication Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
