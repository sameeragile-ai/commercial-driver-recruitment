import React, { useMemo, useState } from 'react';
import { useStore, AppView } from '../../store/useStore';
import { ReadinessRing } from '../../components/common/ReadinessRing';
import {
  Users,
  CheckCircle,
  FileText,
  AlertTriangle,
  TrendingUp,
  Download,
  Filter,
  ArrowUpRight,
  Clock,
  ShieldAlert,
  Send,
  UserCheck,
  Building,
  DollarSign,
  Award,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

export const DashboardView: React.FC = () => {
  const {
    drivers,
    currentTenantId,
    tenants,
    users,
    campaigns,
    setView,
    addToast,
  } = useStore();

  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [filterRecruiter, setFilterRecruiter] = useState('all');
  const [filterPosition, setFilterPosition] = useState('all');

  const activeTenant = tenants.find((t) => t.id === currentTenantId) || tenants[0];

  // Tenant-scoped drivers
  const tenantDrivers = useMemo(() => {
    return drivers.filter((d) => {
      if (d.tenantId !== currentTenantId) return false;
      if (filterRecruiter !== 'all' && d.assignedRecruiterId !== filterRecruiter) return false;
      if (filterPosition !== 'all' && d.targetPosition !== filterPosition) return false;
      return true;
    });
  }, [drivers, currentTenantId, filterRecruiter, filterPosition]);

  // Recruiter leaderboard
  const tenantRecruiters = useMemo(() => {
    return users.filter((u) => u.tenantId === currentTenantId && (u.role === 'Recruiter' || u.role === 'Recruiting Manager'));
  }, [users, currentTenantId]);

  // Metrics
  const totalLeads = tenantDrivers.length;
  const preQualifiedCount = tenantDrivers.filter((d) =>
    ['pre_qualified', 'application_submitted', 'documents_review', 'voe_in_progress', 'conditional_offer', 'orientation_scheduled', 'dq_ready'].includes(d.stage)
  ).length;
  const activeOffersCount = tenantDrivers.filter((d) => ['conditional_offer', 'orientation_scheduled'].includes(d.stage)).length;
  const dqReadyCount = tenantDrivers.filter((d) => d.stage === 'dq_ready').length;

  const qualificationRate = totalLeads > 0 ? Math.round((preQualifiedCount / totalLeads) * 100) : 0;
  const avgDqScore = totalLeads > 0
    ? Math.round(tenantDrivers.reduce((acc, curr) => acc + curr.dqReadinessPercentage, 0) / totalLeads)
    : 0;

  // Outstanding VOEs
  const outstandingVoesCount = tenantDrivers.reduce((acc, d) => {
    return acc + d.employmentHistory.filter((e) => ['Sent', 'Overdue', 'Escalated'].includes(e.voeStatus)).length;
  }, 0);

  // Expiring medical cards (within 30 days or expired)
  const expiringMedCount = tenantDrivers.filter((d) => {
    const expiry = new Date(d.medCardExpiration).getTime();
    const now = new Date(2026, 9, 13).getTime();
    return expiry - now < 30 * 24 * 60 * 60 * 1000;
  }).length;

  // Pipeline Funnel data for Recharts
  const pipelineFunnelData = useMemo(() => {
    const stages = [
      { key: 'new_lead', name: 'New Leads' },
      { key: 'contacted', name: 'Contacted' },
      { key: 'pre_qualified', name: 'Pre-Qualified' },
      { key: 'application_submitted', name: 'App Complete' },
      { key: 'documents_review', name: 'Docs Review' },
      { key: 'voe_in_progress', name: 'VOE Verif' },
      { key: 'conditional_offer', name: 'Offer Extended' },
      { key: 'dq_ready', name: 'DQ Ready' },
    ];

    return stages.map((s) => ({
      name: s.name,
      count: tenantDrivers.filter((d) => d.stage === s.key).length,
    }));
  }, [tenantDrivers]);

  // Lead Sources Breakdown
  const sourceBreakdownData = useMemo(() => {
    const counts: Record<string, number> = {};
    tenantDrivers.forEach((d) => {
      counts[d.source] = (counts[d.source] || 0) + 1;
    });

    const colors = ['#0E7C7B', '#2563EB', '#F5A524', '#64748B', '#0284C7', '#84CC16'];
    return Object.entries(counts).map(([name, value], i) => ({
      name,
      value,
      color: colors[i % colors.length],
    }));
  }, [tenantDrivers]);

  // Recruiter Performance
  const recruiterStats = useMemo(() => {
    return tenantRecruiters.map((recruiter) => {
      const assigned = tenantDrivers.filter((d) => d.assignedRecruiterId === recruiter.id);
      const hired = assigned.filter((d) => ['dq_ready', 'orientation_scheduled'].includes(d.stage)).length;
      const rate = assigned.length > 0 ? Math.round((hired / assigned.length) * 100) : 0;
      return {
        recruiter,
        leads: assigned.length,
        hires: hired,
        conversionRate: rate,
      };
    });
  }, [tenantRecruiters, tenantDrivers]);

  // Export CSV Handler
  const handleExportCsv = () => {
    const headers = ['ID,First Name,Last Name,Phone,Email,CDL #,State,Class,Stage,Position,Source,DQ Readiness'];
    const rows = tenantDrivers.map((d) =>
      `"${d.id}","${d.firstName}","${d.lastName}","${d.phone}","${d.email}","${d.cdlNumber}","${d.cdlState}","${d.cdlClass}","${d.stage}","${d.targetPosition}","${d.source}",${d.dqReadinessPercentage}%`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RigReady_${activeTenant.logoText}_Driver_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Report Exported', 'CSV roster downloaded successfully', 'success');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-heading text-[#14161A] tracking-tight">
              Recruiting & Compliance Overview
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#0E7C7B]/10 text-[#0E7C7B] font-mono font-medium">
              DOT Part 391
            </span>
          </div>
          <p className="text-xs text-[#5B616B] mt-0.5">
            {activeTenant.name} · Real-time commercial driver acquisition & qualification intelligence
          </p>
        </div>

        {/* Global Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={filterRecruiter}
            onChange={(e) => setFilterRecruiter(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-white border border-[#ECEAE4] rounded-xl text-[#14161A] outline-none shadow-2xs"
          >
            <option value="all">All Recruiters</option>
            {tenantRecruiters.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>

          <select
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-white border border-[#ECEAE4] rounded-xl text-[#14161A] outline-none shadow-2xs"
          >
            <option value="all">All Divisions</option>
            <option value="OTR Solo">OTR Solo</option>
            <option value="Regional Dry Van">Regional Dry Van</option>
            <option value="Reefer Division">Reefer Division</option>
            <option value="Flatbed Specialized">Flatbed Specialized</option>
          </select>

          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#14161A] bg-white hover:bg-[#FAF9F6] border border-[#ECEAE4] rounded-xl transition-all shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-[#5B616B]" strokeWidth={1.5} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row with subtle 1px gradient top border */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Active Candidates */}
        <div
          onClick={() => setView('pipeline')}
          className="relative bg-white rounded-2xl p-5 border border-[#ECEAE4] shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#0E7C7B] to-[#2563EB] rounded-t-2xl" />
          <div className="flex items-center justify-between text-xs text-[#5B616B] mb-2">
            <span className="font-medium">Active Pipeline Candidates</span>
            <Users className="w-4 h-4 text-[#0E7C7B]" strokeWidth={1.5} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#14161A]">{totalLeads}</span>
            <span className="text-xs text-[#0E7C7B] font-medium flex items-center">
              +14% vs last mo
            </span>
          </div>
          <div className="text-[11px] text-[#9AA0A8] mt-2 flex items-center justify-between">
            <span>{preQualifiedCount} pre-qualified</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#9AA0A8] group-hover:text-[#14161A]" />
          </div>
        </div>

        {/* Qualification Rate */}
        <div
          onClick={() => setView('questionnaire')}
          className="relative bg-white rounded-2xl p-5 border border-[#ECEAE4] shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#2563EB] to-[#F5A524] rounded-t-2xl" />
          <div className="flex items-center justify-between text-xs text-[#5B616B] mb-2">
            <span className="font-medium">Pre-Qual Pass Rate</span>
            <CheckCircle className="w-4 h-4 text-[#2563EB]" strokeWidth={1.5} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#14161A]">{qualificationRate}%</span>
            <span className="text-xs text-[#5B616B]">DOT criteria met</span>
          </div>
          <div className="text-[11px] text-[#9AA0A8] mt-2 flex items-center justify-between">
            <span>Knockout engine active</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#9AA0A8] group-hover:text-[#14161A]" />
          </div>
        </div>

        {/* Outstanding Verification of Employment */}
        <div
          onClick={() => setView('voe')}
          className="relative bg-white rounded-2xl p-5 border border-[#ECEAE4] shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#F5A524] to-[#0E7C7B] rounded-t-2xl" />
          <div className="flex items-center justify-between text-xs text-[#5B616B] mb-2">
            <span className="font-medium">Outstanding 3-Yr VOEs</span>
            <Clock className="w-4 h-4 text-[#F5A524]" strokeWidth={1.5} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#14161A]">{outstandingVoesCount}</span>
            <span className="text-xs text-amber-600 font-medium">Pending carriers</span>
          </div>
          <div className="text-[11px] text-[#9AA0A8] mt-2 flex items-center justify-between">
            <span>FMCSR § 391.23</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#9AA0A8] group-hover:text-[#14161A]" />
          </div>
        </div>

        {/* DQ Onboarding Ready */}
        <div
          onClick={() => setView('dq_readiness')}
          className="relative bg-white rounded-2xl p-5 border border-[#ECEAE4] shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#0E7C7B] via-[#2563EB] to-[#F5A524] rounded-t-2xl" />
          <div className="flex items-center justify-between text-xs text-[#5B616B] mb-2">
            <span className="font-medium">DOT DQ Ready / Orientation</span>
            <ReadinessRing percentage={avgDqScore} size={28} strokeWidth={3} showLabel={false} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#14161A]">{dqReadyCount}</span>
            <span className="text-xs text-[#0E7C7B] font-medium">{avgDqScore}% avg readiness</span>
          </div>
          <div className="text-[11px] text-[#9AA0A8] mt-2 flex items-center justify-between">
            <span>Ready for dispatch</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#9AA0A8] group-hover:text-[#14161A]" />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Pipeline Funnel Chart & Sources / Recruiter stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Funnel Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-[#ECEAE4] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold font-heading text-[#14161A]">
                Candidate Pipeline Progression
              </h3>
              <p className="text-xs text-[#5B616B] mt-0.5">
                Active candidates across FMCSA compliance milestones
              </p>
            </div>
            <button
              onClick={() => setView('pipeline')}
              className="text-xs text-[#0E7C7B] hover:underline font-medium inline-flex items-center gap-1"
            >
              <span>Open Kanban</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineFunnelData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0EFEA" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#5B616B' }}
                  angle={-15}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fontSize: 11, fill: '#5B616B' }} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(14, 124, 123, 0.04)' }}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    borderColor: '#ECEAE4',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  }}
                />
                <Bar dataKey="count" fill="#0E7C7B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Source Quality Breakdown */}
        <div className="bg-white rounded-2xl p-5 border border-[#ECEAE4] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold font-heading text-[#14161A]">
                Acquisition Channels
              </h3>
              <p className="text-xs text-[#5B616B] mt-0.5">
                Volume by sourcing campaign
              </p>
            </div>
            <button
              onClick={() => setView('sources')}
              className="text-xs text-[#0E7C7B] hover:underline font-medium"
            >
              Campaigns
            </button>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {sourceBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    borderColor: '#ECEAE4',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-1 border-t border-[#ECEAE4]">
            {sourceBreakdownData.slice(0, 4).map((source) => (
              <div key={source.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: source.color }} />
                  <span className="text-[#5B616B]">{source.name}</span>
                </div>
                <span className="font-mono font-medium text-[#14161A]">{source.value} leads</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recruiter Leaderboard & Urgent Attention Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recruiter Leaderboard */}
        <div className="bg-white rounded-2xl p-5 border border-[#ECEAE4] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#F5A524]" strokeWidth={1.5} />
              <h3 className="text-sm font-semibold font-heading text-[#14161A]">
                Recruiter Productivity & Hires
              </h3>
            </div>
            <span className="text-[11px] text-[#9AA0A8] font-mono">This Month</span>
          </div>

          <div className="space-y-3">
            {recruiterStats.map(({ recruiter, leads, hires, conversionRate }) => (
              <div
                key={recruiter.id}
                className="flex items-center justify-between p-3 rounded-xl border border-[#ECEAE4] bg-[#FAF9F6]/50 hover:bg-[#FAF9F6] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={recruiter.avatarUrl}
                    alt={recruiter.name}
                    className="w-9 h-9 rounded-full object-cover border border-[#ECEAE4]"
                  />
                  <div>
                    <div className="text-xs font-semibold text-[#14161A] font-heading">{recruiter.name}</div>
                    <div className="text-[11px] text-[#5B616B]">{recruiter.title}</div>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-right">
                  <div>
                    <div className="text-xs font-mono font-bold text-[#14161A]">{leads}</div>
                    <div className="text-[10px] text-[#9AA0A8]">Candidates</div>
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-[#0E7C7B]">{hires}</div>
                    <div className="text-[10px] text-[#9AA0A8]">DQ Ready</div>
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-[#2563EB]">{conversionRate}%</div>
                    <div className="text-[10px] text-[#9AA0A8]">Conv Rate</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Urgent Action Feed */}
        <div className="bg-white rounded-2xl p-5 border border-[#ECEAE4] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#DC2626]" strokeWidth={1.5} />
              <h3 className="text-sm font-semibold font-heading text-[#14161A]">
                Compliance & Verification Action Queue
              </h3>
            </div>
            <button
              onClick={() => setView('dq_readiness')}
              className="text-xs text-[#0E7C7B] hover:underline font-medium"
            >
              View All
            </button>
          </div>

          <div className="space-y-2.5">
            {/* Action Item 1: Overdue VOE */}
            <div
              onClick={() => setView('voe')}
              className="p-3 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-50 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" strokeWidth={1.5} />
                  <span className="text-xs font-semibold text-amber-900">
                    VOE Pending Response ({outstandingVoesCount} carriers)
                  </span>
                </div>
                <span className="text-[10px] font-mono font-medium text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                  OVERDUE
                </span>
              </div>
              <p className="text-[11px] text-amber-800 mt-1 leading-snug">
                Prior employer verification inquiry for Anthony Davis and 2 others exceeded 5 business days. Send automated follow-up.
              </p>
            </div>

            {/* Action Item 2: Expiring Med Cards */}
            <div
              onClick={() => setView('dq_readiness')}
              className="p-3 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-50 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" strokeWidth={1.5} />
                  <span className="text-xs font-semibold text-rose-900">
                    DOT Medical Card Expiration Alert
                  </span>
                </div>
                <span className="text-[10px] font-mono font-medium text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                  CRITICAL
                </span>
              </div>
              <p className="text-[11px] text-rose-800 mt-1 leading-snug">
                Michael Miller (#drv_1000) medical examiner certificate is expired or expiring within 14 days. Cannot dispatch.
              </p>
            </div>

            {/* Action Item 3: Offer Letter */}
            <div
              onClick={() => setView('offers')}
              className="p-3 rounded-xl border border-teal-200 bg-teal-50/60 hover:bg-teal-50 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-700 shrink-0" strokeWidth={1.5} />
                  <span className="text-xs font-semibold text-teal-900">
                    Conditional Offer Pending Sign-Off
                  </span>
                </div>
                <span className="text-[10px] font-mono font-medium text-teal-800 bg-teal-100 px-1.5 py-0.5 rounded">
                  APPROVAL
                </span>
              </div>
              <p className="text-[11px] text-teal-800 mt-1 leading-snug">
                Brandon Hernandez (#drv_1016) conditional offer drafted for Reefer Division. Awaiting Recruiting Manager signature.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
