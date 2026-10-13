import React, { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { EmploymentHistoryEntry } from '../../types';
import {
  FileCheck2,
  Mail,
  Printer,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Send,
  Calendar,
  ExternalLink,
  Search,
  Filter,
} from 'lucide-react';

export const EmploymentVerificationView: React.FC = () => {
  const {
    drivers,
    currentTenantId,
    sendVoeRequest,
    updateVoeEntry,
    addToast,
    setView,
  } = useStore();

  const [statusFilter, setStatusFilter] = useState('all');
  const [query, setQuery] = useState('');

  const tenantDrivers = useMemo(() => {
    return drivers.filter((d) => d.tenantId === currentTenantId);
  }, [drivers, currentTenantId]);

  // Flatten all VOE entries across candidates
  const allVoeEntries = useMemo(() => {
    const list: Array<{
      driverId: string;
      driverName: string;
      driverCdl: string;
      driverPosition: string;
      entry: EmploymentHistoryEntry;
    }> = [];

    tenantDrivers.forEach((driver) => {
      driver.employmentHistory.forEach((entry) => {
        list.push({
          driverId: driver.id,
          driverName: `${driver.firstName} ${driver.lastName}`,
          driverCdl: driver.cdlNumber,
          driverPosition: driver.targetPosition,
          entry,
        });
      });
    });

    return list;
  }, [tenantDrivers]);

  const filteredEntries = useMemo(() => {
    return allVoeEntries.filter((item) => {
      if (statusFilter !== 'all' && item.entry.voeStatus !== statusFilter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const matches =
          item.driverName.toLowerCase().includes(q) ||
          item.entry.companyName.toLowerCase().includes(q) ||
          item.driverCdl.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [allVoeEntries, statusFilter, query]);

  // Simulate receiving completed verification from prior carrier
  const handleMarkReceived = (driverId: string, entryId: string) => {
    updateVoeEntry(driverId, entryId, {
      voeStatus: 'Received',
      voeReceivedDate: new Date().toISOString().split('T')[0],
      voeNotes: 'Completed VOE received via Carrier Portal. Zero accidents, eligible for rehire. Clean drug/alcohol history verified.',
    });
    addToast('VOE Received', 'Carrier safety questionnaire verified and attached to DQ file', 'success');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold font-heading text-[#14161A]">
            Employment Verification Engine (FMCSR § 391.23)
          </h1>
          <p className="text-xs text-[#5B616B] mt-0.5">
            Mandatory 3-year prior commercial carrier safety investigation and drug & alcohol inquiries
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#9AA0A8] absolute left-3 top-2.5" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search carrier or candidate..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="text-xs pl-8 pr-3 py-1.5 bg-white border border-[#ECEAE4] rounded-xl outline-none focus:border-[#0E7C7B] w-56 shadow-2xs"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-white border border-[#ECEAE4] rounded-xl text-[#14161A] outline-none shadow-2xs"
          >
            <option value="all">All Verification Statuses</option>
            <option value="Sent">Sent (Awaiting Carrier)</option>
            <option value="Received">Received & Verified</option>
            <option value="Overdue">Overdue (&gt;5 Days)</option>
            <option value="Escalated">Escalated to Safety Director</option>
          </select>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#ECEAE4] shadow-sm">
          <span className="text-[11px] text-[#5B616B] font-medium block">Total Carrier Inquiries</span>
          <span className="text-xl font-bold font-mono text-[#14161A] mt-1 block">
            {allVoeEntries.length} Inquiries
          </span>
          <span className="text-[10px] text-[#9AA0A8]">Covering 3-year history</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#ECEAE4] shadow-sm">
          <span className="text-[11px] text-[#0E7C7B] font-medium block">Verified & Received</span>
          <span className="text-xl font-bold font-mono text-[#0E7C7B] mt-1 block">
            {allVoeEntries.filter((e) => e.entry.voeStatus === 'Received').length}
          </span>
          <span className="text-[10px] text-[#9AA0A8]">DQ file cleared</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#ECEAE4] shadow-sm">
          <span className="text-[11px] text-[#F5A524] font-medium block">Pending Carrier Replies</span>
          <span className="text-xl font-bold font-mono text-[#F5A524] mt-1 block">
            {allVoeEntries.filter((e) => ['Sent', 'Viewed', 'Pending'].includes(e.entry.voeStatus)).length}
          </span>
          <span className="text-[10px] text-[#9AA0A8]">Within 30-day statutory window</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#ECEAE4] shadow-sm">
          <span className="text-[11px] text-rose-600 font-medium block">Overdue Inquiries</span>
          <span className="text-xl font-bold font-mono text-rose-600 mt-1 block">
            {allVoeEntries.filter((e) => ['Overdue', 'Escalated'].includes(e.entry.voeStatus)).length}
          </span>
          <span className="text-[10px] text-rose-700">Follow-up mandated</span>
        </div>
      </div>

      {/* VOE Inquiries Roster Table */}
      <div className="bg-white rounded-2xl border border-[#ECEAE4] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF9F6] border-b border-[#ECEAE4] text-[#5B616B] font-medium">
                <th className="py-3 px-4">Applicant Candidate</th>
                <th className="py-3 px-4">Previous Carrier / Employer</th>
                <th className="py-3 px-4">Dates of Service</th>
                <th className="py-3 px-4">Dispatch Dates</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Dispatch Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECEAE4]">
              {filteredEntries.map(({ driverId, driverName, driverCdl, driverPosition, entry }) => (
                <tr key={`${driverId}_${entry.id}`} className="hover:bg-[#FAF9F6]/60 transition-colors">
                  <td className="py-3 px-4">
                    <div
                      onClick={() => setView('driver_profile', driverId)}
                      className="font-semibold text-[#14161A] hover:text-[#0E7C7B] cursor-pointer"
                    >
                      {driverName}
                    </div>
                    <div className="text-[11px] text-[#5B616B] font-mono">
                      CDL: {driverCdl} · {driverPosition}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-[#14161A]">{entry.companyName}</div>
                    <div className="text-[11px] text-[#5B616B]">
                      {entry.contactPerson || 'HR Desk'} · {entry.phone}
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono text-[11px] text-[#5B616B]">
                    {entry.startDate} to {entry.endDate}
                  </td>

                  <td className="py-3 px-4 text-[11px] text-[#5B616B]">
                    <div>Sent: {entry.voeSentDate || 'Not sent'}</div>
                    {entry.voeReceivedDate && (
                      <div className="text-[#0E7C7B] font-medium">
                        Recv: {entry.voeReceivedDate}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                        entry.voeStatus === 'Received'
                          ? 'bg-emerald-100 text-emerald-800'
                          : entry.voeStatus === 'Overdue'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {entry.voeStatus}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => sendVoeRequest(driverId, entry.id, 'email')}
                        className="p-1.5 rounded-lg border border-[#ECEAE4] bg-white hover:bg-[#FAF9F6] text-[#5B616B] hover:text-[#0E7C7B] transition-colors"
                        title="Send / Resend Email Form"
                      >
                        <Mail className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => sendVoeRequest(driverId, entry.id, 'fax')}
                        className="p-1.5 rounded-lg border border-[#ECEAE4] bg-white hover:bg-[#FAF9F6] text-[#5B616B] hover:text-[#2563EB] transition-colors"
                        title="Dispatch via e-Fax"
                      >
                        <Printer className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                      {entry.voeStatus !== 'Received' && (
                        <button
                          onClick={() => handleMarkReceived(driverId, entry.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                        >
                          Mark Received
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
