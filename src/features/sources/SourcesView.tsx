import React, { useMemo, useState } from 'react';
import { useStore } from '../../store/useStore';
import { SourceCampaign } from '../../types';
import {
  DollarSign,
  TrendingUp,
  Award,
  Users,
  Plus,
  ArrowUpRight,
  Target,
  ExternalLink,
  CheckCircle2,
  PieChart as PieChartIcon,
  Percent,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const SourcesView: React.FC = () => {
  const {
    campaigns,
    drivers,
    currentTenantId,
    tenants,
    users,
    addToast,
    setView,
  } = useStore();

  const [showAddCampaignModal, setShowAddCampaignModal] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newChannel, setNewChannel] = useState<SourceCampaign['channel']>('Indeed');
  const [newBudget, setNewBudget] = useState(2500);

  const activeTenant = tenants.find((t) => t.id === currentTenantId) || tenants[0];

  const tenantCampaigns = useMemo(() => {
    return campaigns.filter((c) => c.tenantId === currentTenantId);
  }, [campaigns, currentTenantId]);

  const tenantDrivers = useMemo(() => {
    return drivers.filter((d) => d.tenantId === currentTenantId);
  }, [drivers, currentTenantId]);

  // Sourcing & Referral drivers
  const referralDrivers = useMemo(() => {
    return tenantDrivers.filter((d) => d.source === 'Driver Referral');
  }, [tenantDrivers]);

  // Aggregate stats
  const totalSpend = tenantCampaigns.reduce((sum, c) => sum + c.costPerMonth, 0);
  const totalLeads = tenantDrivers.length;
  const totalHires = tenantDrivers.filter((d) => ['dq_ready', 'orientation_scheduled'].includes(d.stage)).length;
  const costPerHire = totalHires > 0 ? Math.round(totalSpend / totalHires) : 0;
  const leadToHireConvRate = totalLeads > 0 ? Math.round((totalHires / totalLeads) * 100) : 0;

  // Chart data: Cost per Hire by campaign
  const campaignPerformanceData = useMemo(() => {
    return tenantCampaigns.map((camp) => {
      const cpHire = camp.hiresCount > 0 ? Math.round(camp.costPerMonth / camp.hiresCount) : camp.costPerMonth;
      return {
        name: camp.name.slice(0, 18) + '...',
        costPerHire: cpHire,
        hires: camp.hiresCount,
        leads: camp.leadsGenerated,
      };
    });
  }, [tenantCampaigns]);

  const handleAddCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaignName.trim()) return;

    const newCamp: SourceCampaign = {
      id: `cmp_${Date.now()}`,
      tenantId: currentTenantId,
      name: newCampaignName,
      channel: newChannel,
      costPerMonth: Number(newBudget),
      leadsGenerated: 0,
      qualifiedCount: 0,
      hiresCount: 0,
      status: 'Active',
      startDate: new Date().toISOString().split('T')[0],
    };

    useStore.setState((state) => ({
      campaigns: [newCamp, ...state.campaigns],
    }));

    addToast('Campaign Created', `Ad budget assigned to ${newCampaignName}`, 'success');
    setShowAddCampaignModal(false);
    setNewCampaignName('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold font-heading text-[#14161A]">
            Recruiting Sources, Referrals & Cost Analytics
          </h1>
          <p className="text-xs text-[#5B616B] mt-0.5">
            Optimize acquisition channels, track referral payout liabilities, and evaluate Cost Per Hire (CPH)
          </p>
        </div>

        <button
          onClick={() => setShowAddCampaignModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-xl shadow-xs transition-all active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #0E7C7B 0%, #2563EB 100%)',
          }}
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>Launch Campaign</span>
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#ECEAE4] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#5B616B] mb-2">
            <span className="font-medium">Total Monthly Ad Spend</span>
            <DollarSign className="w-4 h-4 text-[#0E7C7B]" strokeWidth={1.5} />
          </div>
          <div className="text-2xl font-bold font-mono text-[#14161A]">
            ${totalSpend.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#9AA0A8] mt-2">
            Across {tenantCampaigns.length} active channels
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#ECEAE4] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#5B616B] mb-2">
            <span className="font-medium">Blended Cost Per Hire (CPH)</span>
            <Target className="w-4 h-4 text-[#2563EB]" strokeWidth={1.5} />
          </div>
          <div className="text-2xl font-bold font-mono text-[#0E7C7B]">
            ${costPerHire.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#9AA0A8] mt-2">
            Industry benchmark: $4,200/driver
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#ECEAE4] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#5B616B] mb-2">
            <span className="font-medium">Lead-to-Hire Conversion</span>
            <TrendingUp className="w-4 h-4 text-[#F5A524]" strokeWidth={1.5} />
          </div>
          <div className="text-2xl font-bold font-mono text-[#14161A]">
            {leadToHireConvRate}%
          </div>
          <div className="text-[11px] text-[#9AA0A8] mt-2">
            {totalHires} total qualified drivers hired
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#ECEAE4] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#5B616B] mb-2">
            <span className="font-medium">Driver Referral Network</span>
            <Award className="w-4 h-4 text-[#0E7C7B]" strokeWidth={1.5} />
          </div>
          <div className="text-2xl font-bold font-mono text-[#14161A]">
            {referralDrivers.length} Leads
          </div>
          <div className="text-[11px] text-[#0E7C7B] mt-2 font-medium">
            Highest retention & lowest CPH
          </div>
        </div>
      </div>

      {/* Chart: Cost Per Hire by Campaign */}
      <div className="bg-white rounded-2xl border border-[#ECEAE4] p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold font-heading text-[#14161A]">
              Cost Per Hire (CPH) by Sourcing Channel
            </h3>
            <p className="text-xs text-[#5B616B] mt-0.5">
              Lower cost per hire indicates more cost-efficient applicant flow
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#5B616B]">Budget Allocation View</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={campaignPerformanceData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0EFEA" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#5B616B' }} />
              <YAxis tick={{ fontSize: 11, fill: '#5B616B' }} tickFormatter={(val) => `$${val}`} />
              <Tooltip
                formatter={(val: any) => [`$${val}`, 'Cost Per Hire']}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  borderColor: '#ECEAE4',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="costPerHire" fill="#2563EB" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Campaigns & Ads Roster */}
      <div className="bg-white rounded-2xl border border-[#ECEAE4] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#ECEAE4] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold font-heading text-[#14161A]">
              Active Sourcing Campaigns & Budgets
            </h3>
            <p className="text-xs text-[#5B616B] mt-0.5">
              Performance metrics and qualification conversion by sponsor channel
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF9F6] border-b border-[#ECEAE4] text-[#5B616B] font-medium">
                <th className="py-3 px-4">Campaign Name</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Monthly Cost</th>
                <th className="py-3 px-4">Leads</th>
                <th className="py-3 px-4">Pre-Qualified</th>
                <th className="py-3 px-4">Hires</th>
                <th className="py-3 px-4">CPH</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECEAE4]">
              {tenantCampaigns.map((camp) => {
                const cpHire = camp.hiresCount > 0 ? Math.round(camp.costPerMonth / camp.hiresCount) : camp.costPerMonth;
                return (
                  <tr key={camp.id} className="hover:bg-[#FAF9F6]/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#14161A]">{camp.name}</td>
                    <td className="py-3 px-4 text-[#5B616B]">{camp.channel}</td>
                    <td className="py-3 px-4 font-mono font-medium text-[#14161A]">
                      ${camp.costPerMonth.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono">{camp.leadsGenerated}</td>
                    <td className="py-3 px-4 font-mono text-[#0E7C7B]">{camp.qualifiedCount}</td>
                    <td className="py-3 px-4 font-mono font-bold text-[#14161A]">{camp.hiresCount}</td>
                    <td className="py-3 px-4 font-mono text-[#2563EB] font-medium">
                      ${cpHire.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">
                        {camp.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Driver Referral Network Tracker */}
      <div className="bg-white rounded-2xl border border-[#ECEAE4] p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold font-heading text-[#14161A]">
              Driver Ambassador Referral Roster
            </h3>
            <p className="text-xs text-[#5B616B] mt-0.5">
              Tracks peer referrals, referring fleet drivers, and bonus entitlement milestone status ($2,500 at 90 days)
            </p>
          </div>
          <span className="text-xs font-mono text-[#0E7C7B] font-semibold">
            {referralDrivers.length} Active Referrals
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {referralDrivers.map((driver) => (
            <div
              key={driver.id}
              onClick={() => setView('driver_profile', driver.id)}
              className="p-3.5 rounded-xl border border-[#ECEAE4] bg-[#FAF9F6] hover:bg-[#F5F4F0] cursor-pointer transition-colors flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-xs text-[#14161A]">
                  {driver.firstName} {driver.lastName}
                </div>
                <div className="text-[11px] text-[#5B616B] mt-0.5">
                  Referred by: <strong className="text-[#0E7C7B]">{driver.referredBy || 'Driver Network'}</strong>
                </div>
                <div className="text-[10px] text-[#9AA0A8] font-mono mt-1">
                  Stage: {driver.stage.replace(/_/g, ' ')} · Position: {driver.targetPosition}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-mono font-bold text-[#0E7C7B] block">
                  $2,500 Payout
                </span>
                <span className="text-[10px] text-[#5B616B]">Day 90 Eligible</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Campaign Modal */}
      {showAddCampaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-[#ECEAE4] shadow-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold font-heading text-[#14161A]">
              Launch Sourcing Campaign
            </h3>
            <form onSubmit={handleAddCampaign} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#14161A] font-medium mb-1">Campaign Name *</label>
                <input
                  type="text"
                  required
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  placeholder="e.g. Indeed Regional Midwest Sponsor"
                  className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg outline-none focus:border-[#0E7C7B]"
                />
              </div>

              <div>
                <label className="block text-[#14161A] font-medium mb-1">Ad Network / Channel</label>
                <select
                  value={newChannel}
                  onChange={(e) => setNewChannel(e.target.value as any)}
                  className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg outline-none focus:border-[#0E7C7B] bg-white"
                >
                  <option value="Indeed">Indeed</option>
                  <option value="TruckersReport">TruckersReport</option>
                  <option value="Facebook Lead Ads">Facebook Lead Ads</option>
                  <option value="ZipRecruiter">ZipRecruiter</option>
                  <option value="Driver Referral">Driver Referral</option>
                </select>
              </div>

              <div>
                <label className="block text-[#14161A] font-medium mb-1">Monthly Budget ($)</label>
                <input
                  type="number"
                  min="100"
                  step="50"
                  value={newBudget}
                  onChange={(e) => setNewBudget(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#ECEAE4] rounded-lg outline-none focus:border-[#0E7C7B]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#ECEAE4]">
                <button
                  type="button"
                  onClick={() => setShowAddCampaignModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-[#ECEAE4] text-[#5B616B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-[#0E7C7B] text-white font-semibold"
                >
                  Create Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
