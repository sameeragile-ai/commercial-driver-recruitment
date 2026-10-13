import React, { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { PayStructureTemplate, PositionType } from '../../types';
import {
  DollarSign,
  Plus,
  CheckCircle2,
  Clock,
  Shield,
  FileText,
  Sparkles,
  ArrowRight,
  Check,
} from 'lucide-react';

export const PayStructureView: React.FC = () => {
  const {
    payTemplates,
    currentTenantId,
    users,
    currentUserId,
    addPayTemplate,
    updatePayTemplate,
    setView,
    addToast,
  } = useStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [position, setPosition] = useState<PositionType>('OTR Solo');
  const [payType, setPayType] = useState<PayStructureTemplate['payType']>('CPM');
  const [baseRateDisplay, setBaseRateDisplay] = useState('$0.68 / practical mile');
  const [baseRateValue, setBaseRateValue] = useState(0.68);
  const [detentionPay, setDetentionPay] = useState('$26/hr after 2 hours');
  const [layoverPay, setLayoverPay] = useState('$130/day');
  const [breakdownPay, setBreakdownPay] = useState('$110/day + hotel covered');
  const [bonusInput, setBonusInput] = useState('$0.04/mi Monthly Safety Bonus\n$2,500 Driver Referral Bonus');
  const [benefitInput, setBenefitInput] = useState('BCBS Medical, Dental, Vision\n401(k) with 4% match vesting day 90\nPaid Vacation');

  const currentUser = users.find((u) => u.id === currentUserId);
  const isManager = currentUser?.role === 'Admin' || currentUser?.role === 'Recruiting Manager';

  const tenantTemplates = useMemo(() => {
    return payTemplates.filter((p) => p.tenantId === currentTenantId);
  }, [payTemplates, currentTenantId]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addPayTemplate({
      tenantId: currentTenantId,
      title,
      position,
      payType,
      baseRateDisplay,
      baseRateValue: Number(baseRateValue),
      detentionPay,
      layoverPay,
      breakdownPay,
      bonuses: bonusInput.split('\n').filter(Boolean),
      benefits: benefitInput.split('\n').filter(Boolean),
      effectiveDate: new Date().toISOString().split('T')[0],
      status: isManager ? 'Approved' : 'Draft',
      approvedBy: isManager ? (currentUser?.name || 'Recruiting Manager') : 'Pending Manager Review',
    });

    setShowAddModal(false);
    setTitle('');
  };

  const handleApprove = (templateId: string) => {
    updatePayTemplate(templateId, {
      status: 'Approved',
      approvedBy: currentUser?.name || 'Recruiting Manager',
    });
    addToast('Compensation Approved', 'Pay structure approved for offer letters', 'success');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold font-heading text-[#14161A]">
            Compensation Models & Pay Structures
          </h1>
          <p className="text-xs text-[#5B616B] mt-0.5">
            Configure mileage rates, hourly guarantees, percentage shares, accessorial pay, and approved packages
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-xl shadow-xs transition-all active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #0E7C7B 0%, #2563EB 100%)',
          }}
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>New Pay Structure</span>
        </button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tenantTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-2xl border border-[#ECEAE4] p-5 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold font-heading text-[#14161A]">
                    {template.title}
                  </h3>
                  <span className="text-xs text-[#5B616B]">{template.position}</span>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                    template.status === 'Approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {template.status}
                </span>
              </div>

              {/* Big Rate Badge */}
              <div className="mt-4 p-3 bg-[#FAF9F6] border border-[#ECEAE4] rounded-xl">
                <span className="text-[10px] font-mono uppercase text-[#9AA0A8] block">
                  Primary Base Compensation
                </span>
                <span className="text-lg font-bold font-heading text-[#0E7C7B] mt-0.5 block">
                  {template.baseRateDisplay}
                </span>
                <span className="text-[11px] text-[#5B616B]">Type: {template.payType} Model</span>
              </div>

              {/* Accessorials */}
              <div className="mt-3 space-y-1.5 text-xs text-[#5B616B]">
                <div className="flex justify-between py-1 border-b border-[#ECEAE4]">
                  <span className="text-[#9AA0A8]">Detention Pay</span>
                  <span className="font-mono text-[#14161A] font-medium">{template.detentionPay}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#ECEAE4]">
                  <span className="text-[#9AA0A8]">Layover Pay</span>
                  <span className="font-mono text-[#14161A] font-medium">{template.layoverPay}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#9AA0A8]">Breakdown Pay</span>
                  <span className="font-mono text-[#14161A] font-medium">{template.breakdownPay}</span>
                </div>
              </div>

              {/* Bonuses list */}
              <div className="mt-3 pt-3 border-t border-[#ECEAE4]">
                <span className="text-[10px] font-semibold text-[#9AA0A8] uppercase tracking-wider block mb-1.5">
                  Incentives & Bonuses ({template.bonuses.length})
                </span>
                <ul className="space-y-1 text-xs text-[#5B616B]">
                  {template.bonuses.map((bonus, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#0E7C7B] font-bold">✓</span>
                      <span>{bonus}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-[#ECEAE4] flex items-center justify-between text-xs">
              <span className="text-[10px] text-[#9AA0A8]">
                Approved by {template.approvedBy}
              </span>
              <div className="flex items-center gap-2">
                {template.status !== 'Approved' && isManager && (
                  <button
                    onClick={() => handleApprove(template.id)}
                    className="px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    Approve
                  </button>
                )}
                <button
                  onClick={() => setView('offers')}
                  className="px-2.5 py-1 text-xs font-medium text-[#0E7C7B] hover:underline"
                >
                  Use in Offer →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-white rounded-2xl border border-[#ECEAE4] shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <h3 className="text-sm font-semibold font-heading text-[#14161A]">
              Create Compensation Package
            </h3>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#14161A] font-medium mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. OTR Solo Dry Van - Top Tier"
                  className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg outline-none focus:border-[#0E7C7B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#14161A] font-medium mb-1">Target Position</label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value as any)}
                    className="w-full px-2.5 py-2 border border-[#ECEAE4] rounded-lg bg-white outline-none"
                  >
                    <option value="OTR Solo">OTR Solo</option>
                    <option value="OTR Team">OTR Team</option>
                    <option value="Regional Dry Van">Regional Dry Van</option>
                    <option value="Reefer Division">Reefer Division</option>
                    <option value="Flatbed Specialized">Flatbed Specialized</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#14161A] font-medium mb-1">Pay Type</label>
                  <select
                    value={payType}
                    onChange={(e) => setPayType(e.target.value as any)}
                    className="w-full px-2.5 py-2 border border-[#ECEAE4] rounded-lg bg-white outline-none"
                  >
                    <option value="CPM">CPM (Cents Per Mile)</option>
                    <option value="Hourly">Hourly</option>
                    <option value="Salary">Salary</option>
                    <option value="Percentage">Percentage of Gross</option>
                    <option value="Per-Load">Per-Load Rate</option>
                    <option value="Daily">Daily Guarantee</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#14161A] font-medium mb-1">Base Rate Display Text</label>
                  <input
                    type="text"
                    value={baseRateDisplay}
                    onChange={(e) => setBaseRateDisplay(e.target.value)}
                    placeholder="$0.68 / practical mile"
                    className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#14161A] font-medium mb-1">Detention Rate</label>
                  <input
                    type="text"
                    value={detentionPay}
                    onChange={(e) => setDetentionPay(e.target.value)}
                    className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#14161A] font-medium mb-1">
                  Bonuses & Incentives (One per line)
                </label>
                <textarea
                  rows={2}
                  value={bonusInput}
                  onChange={(e) => setBonusInput(e.target.value)}
                  className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block text-[#14161A] font-medium mb-1">
                  Benefits Package (One per line)
                </label>
                <textarea
                  rows={2}
                  value={benefitInput}
                  onChange={(e) => setBenefitInput(e.target.value)}
                  className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#ECEAE4]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-[#ECEAE4] text-[#5B616B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#0E7C7B] text-white font-semibold shadow-xs"
                >
                  Save Pay Structure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
