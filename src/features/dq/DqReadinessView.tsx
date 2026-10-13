import React, { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { ReadinessRing } from '../../components/common/ReadinessRing';
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  Search,
  Filter,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';

export const DqReadinessView: React.FC = () => {
  const {
    drivers,
    currentTenantId,
    users,
    currentUserId,
    safetyApproveDriver,
    setView,
    addToast,
  } = useStore();

  const [filterStatus, setFilterStatus] = useState('all');
  const [query, setQuery] = useState('');

  const currentUser = users.find((u) => u.id === currentUserId);
  const isSafetyManager = currentUser?.role === 'Safety Manager' || currentUser?.role === 'Admin';

  const tenantDrivers = useMemo(() => {
    return drivers.filter((d) => d.tenantId === currentTenantId);
  }, [drivers, currentTenantId]);

  const filteredDrivers = useMemo(() => {
    return tenantDrivers.filter((d) => {
      if (filterStatus === 'ready' && d.stage !== 'dq_ready') return false;
      if (filterStatus === 'pending' && d.safetyApprovalStatus !== 'Pending Review') return false;
      if (filterStatus === 'approved' && d.safetyApprovalStatus !== 'Approved') return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const matches =
          d.firstName.toLowerCase().includes(q) ||
          d.lastName.toLowerCase().includes(q) ||
          d.cdlNumber.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [tenantDrivers, filterStatus, query]);

  // Overall compliance metrics
  const totalDrivers = tenantDrivers.length;
  const approvedDrivers = tenantDrivers.filter((d) => d.safetyApprovalStatus === 'Approved').length;
  const pendingReviewDrivers = tenantDrivers.filter((d) => d.safetyApprovalStatus === 'Pending Review' && d.dqReadinessPercentage >= 75).length;
  const expiredDocsCount = tenantDrivers.filter((d) =>
    d.documents.some((doc) => doc.status === 'Expired')
  ).length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold font-heading text-[#14161A]">
              Driver Qualification (DQ) File Readiness & Compliance
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#0E7C7B]/10 text-[#0E7C7B] font-mono font-medium">
              FMCSA 49 CFR Part 391
            </span>
          </div>
          <p className="text-xs text-[#5B616B] mt-0.5">
            Audit-ready Driver Qualification files, expiration forecasting, and Safety Director sign-off workflow
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#9AA0A8] absolute left-3 top-2.5" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search driver or CDL..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="text-xs pl-8 pr-3 py-1.5 bg-white border border-[#ECEAE4] rounded-xl outline-none focus:border-[#0E7C7B] w-52 shadow-2xs"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-white border border-[#ECEAE4] rounded-xl text-[#14161A] outline-none shadow-2xs"
          >
            <option value="all">All Qualifications</option>
            <option value="approved">Safety Cleared (Approved)</option>
            <option value="pending">Awaiting Safety Review</option>
            <option value="ready">100% DQ Ready</option>
          </select>
        </div>
      </div>

      {/* Compliance Callout Banner */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" strokeWidth={1.5} />
          <div>
            <h4 className="text-xs font-bold text-amber-950 font-heading">
              Preliminary Readiness Notice (FMCSR § 391.51)
            </h4>
            <p className="text-xs text-amber-900 mt-0.5 leading-relaxed">
              Preliminary readiness scores reflect document uploads and automated checks. Official qualification
              requires documented final sign-off by a designated <strong>Safety Manager</strong> before dispatching
              any commercial motor vehicle.
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg">
            Safety Role: {currentUser?.role}
          </span>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#ECEAE4] shadow-sm">
          <span className="text-[11px] text-[#5B616B] font-medium block">Total Roster Candidates</span>
          <span className="text-xl font-bold font-mono text-[#14161A] mt-1 block">
            {totalDrivers} Active
          </span>
          <span className="text-[10px] text-[#9AA0A8]">Subject to Part 391</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#ECEAE4] shadow-sm">
          <span className="text-[11px] text-[#0E7C7B] font-medium block">Safety Manager Cleared</span>
          <span className="text-xl font-bold font-mono text-[#0E7C7B] mt-1 block">
            {approvedDrivers} Drivers
          </span>
          <span className="text-[10px] text-[#9AA0A8]">Full DQ File Complete</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#ECEAE4] shadow-sm">
          <span className="text-[11px] text-[#2563EB] font-medium block">Ready for Safety Review</span>
          <span className="text-xl font-bold font-mono text-[#2563EB] mt-1 block">
            {pendingReviewDrivers} Drivers
          </span>
          <span className="text-[10px] text-[#9AA0A8]">&gt;75% Preliminary Score</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#ECEAE4] shadow-sm">
          <span className="text-[11px] text-rose-600 font-medium block">Expired Document Warnings</span>
          <span className="text-xl font-bold font-mono text-rose-600 mt-1 block">
            {expiredDocsCount} Drivers
          </span>
          <span className="text-[10px] text-rose-700">Requires renewal certificate</span>
        </div>
      </div>

      {/* Drivers DQ Roster */}
      <div className="bg-white rounded-2xl border border-[#ECEAE4] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF9F6] border-b border-[#ECEAE4] text-[#5B616B] font-medium">
                <th className="py-3 px-4">Driver Name & CDL</th>
                <th className="py-3 px-4">Preliminary Readiness</th>
                <th className="py-3 px-4">Mandatory DQ Items</th>
                <th className="py-3 px-4">Medical Expiration</th>
                <th className="py-3 px-4">Safety Status</th>
                <th className="py-3 px-4 text-right">Safety Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECEAE4]">
              {filteredDrivers.map((driver) => {
                const cdlDoc = driver.documents.find((d) => d.type === 'CDL Front');
                const medDoc = driver.documents.find((d) => d.type === 'Medical Card');
                const mvrDoc = driver.documents.find((d) => d.type === 'MVR Report');
                const drugDoc = driver.documents.find((d) => d.type === 'Drug Screen Result');

                return (
                  <tr key={driver.id} className="hover:bg-[#FAF9F6]/60 transition-colors">
                    {/* Name & CDL */}
                    <td className="py-3.5 px-4">
                      <div
                        onClick={() => setView('driver_profile', driver.id)}
                        className="font-semibold text-[#14161A] hover:text-[#0E7C7B] cursor-pointer"
                      >
                        {driver.firstName} {driver.lastName}
                      </div>
                      <div className="text-[11px] text-[#5B616B] font-mono">
                        {driver.cdlNumber} ({driver.cdlState}) · {driver.targetPosition}
                      </div>
                    </td>

                    {/* Readiness Ring & Score */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <ReadinessRing percentage={driver.dqReadinessPercentage} size={32} strokeWidth={3} />
                        <div>
                          <div className="font-mono font-bold text-[#14161A]">
                            {driver.dqReadinessPercentage}%
                          </div>
                          <span className="text-[10px] text-[#9AA0A8]">Preliminary</span>
                        </div>
                      </div>
                    </td>

                    {/* Checkmarks Checklist */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 text-[10px] font-mono">
                        <span
                          className={`px-1.5 py-0.5 rounded ${
                            cdlDoc?.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                          }`}
                          title="CDL License"
                        >
                          CDL
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded ${
                            medDoc?.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : medDoc?.status === 'Expired'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                          title="DOT Medical Card"
                        >
                          MED
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded ${
                            mvrDoc?.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                          }`}
                          title="3-Year MVR"
                        >
                          MVR
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded ${
                            drugDoc?.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                          }`}
                          title="DOT Pre-Emp Drug Screen"
                        >
                          UDS
                        </span>
                      </div>
                    </td>

                    {/* Expiration date */}
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <span
                        className={
                          driver.documents.some((d) => d.status === 'Expired')
                            ? 'text-rose-600 font-bold'
                            : 'text-[#14161A]'
                        }
                      >
                        {driver.medCardExpiration}
                      </span>
                    </td>

                    {/* Safety Status */}
                    <td className="py-3.5 px-4">
                      {driver.safetyApprovalStatus === 'Approved' ? (
                        <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Safety Cleared</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Pending Review</span>
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      {driver.safetyApprovalStatus === 'Approved' ? (
                        <span className="text-[11px] text-[#9AA0A8] font-mono">
                          Cleared ({driver.safetyApprovedBy})
                        </span>
                      ) : isSafetyManager ? (
                        <button
                          onClick={() => safetyApproveDriver(driver.id, true)}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0E7C7B] hover:bg-[#0c6b6a] rounded-xl transition-colors shadow-2xs"
                        >
                          Approve Driver
                        </button>
                      ) : (
                        <button
                          onClick={() => setView('driver_profile', driver.id)}
                          className="text-xs text-[#0E7C7B] hover:underline font-medium"
                        >
                          Review File →
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
