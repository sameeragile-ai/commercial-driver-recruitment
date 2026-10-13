import React, { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { ReadinessRing } from '../../components/common/ReadinessRing';
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  PhoneCall,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Download,
} from 'lucide-react';

interface DriverTableViewProps {
  onOpenNewDriverModal: () => void;
  onOpenCallModal: (driverId: string) => void;
}

export const DriverTableView: React.FC<DriverTableViewProps> = ({
  onOpenNewDriverModal,
  onOpenCallModal,
}) => {
  const { drivers, currentTenantId, setView, users } = useStore();

  const [query, setQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'stage' | 'readiness' | 'experience' | 'created'>('created');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const tenantDrivers = useMemo(() => {
    return drivers.filter((d) => d.tenantId === currentTenantId);
  }, [drivers, currentTenantId]);

  const filteredDrivers = useMemo(() => {
    return tenantDrivers.filter((d) => {
      if (stageFilter !== 'all' && d.stage !== stageFilter) return false;
      if (classFilter !== 'all' && d.cdlClass !== classFilter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const matches =
          d.firstName.toLowerCase().includes(q) ||
          d.lastName.toLowerCase().includes(q) ||
          d.cdlNumber.toLowerCase().includes(q) ||
          d.cdlState.toLowerCase().includes(q) ||
          d.email.toLowerCase().includes(q) ||
          d.phone.includes(q) ||
          d.dateOfBirth.includes(q) ||
          d.targetPosition.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [tenantDrivers, stageFilter, classFilter, query]);

  const sortedDrivers = useMemo(() => {
    return [...filteredDrivers].sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`);
      } else if (sortBy === 'readiness') {
        comparison = a.dqReadinessPercentage - b.dqReadinessPercentage;
      } else if (sortBy === 'experience') {
        comparison = a.totalExperienceYears - b.totalExperienceYears;
      } else if (sortBy === 'stage') {
        comparison = a.stage.localeCompare(b.stage);
      } else {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return sortAsc ? comparison : -comparison;
    });
  }, [filteredDrivers, sortBy, sortAsc]);

  const totalPages = Math.ceil(sortedDrivers.length / pageSize) || 1;
  const paginatedDrivers = sortedDrivers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4">
      {/* Table Header & Search Tools */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold font-heading text-[#14161A]">Commercial Driver Directory</h1>
          <p className="text-xs text-[#5B616B] mt-0.5">
            Showing {filteredDrivers.length} verified candidate profiles with full DOT Part 391 compliance records
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#9AA0A8] absolute left-3 top-2.5" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Filter by CDL #, name, state, phone, DOB..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs pl-8 pr-3 py-1.5 bg-white border border-[#ECEAE4] rounded-xl outline-none focus:border-[#0E7C7B] w-64 shadow-2xs"
            />
          </div>

          <select
            value={stageFilter}
            onChange={(e) => {
              setStageFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs px-2.5 py-1.5 bg-white border border-[#ECEAE4] rounded-xl text-[#14161A] outline-none shadow-2xs"
          >
            <option value="all">All Stages</option>
            <option value="new_lead">New Leads</option>
            <option value="contacted">Contacted</option>
            <option value="pre_qualified">Pre-Qualified</option>
            <option value="application_submitted">App Complete</option>
            <option value="documents_review">Docs Review</option>
            <option value="voe_in_progress">VOE In Progress</option>
            <option value="conditional_offer">Offer Extended</option>
            <option value="dq_ready">DQ Ready</option>
          </select>

          <select
            value={classFilter}
            onChange={(e) => {
              setClassFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs px-2.5 py-1.5 bg-white border border-[#ECEAE4] rounded-xl text-[#14161A] outline-none shadow-2xs"
          >
            <option value="all">All CDL Classes</option>
            <option value="Class A">Class A</option>
            <option value="Class B">Class B</option>
          </select>

          <button
            onClick={onOpenNewDriverModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-xl shadow-xs transition-all active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #0E7C7B 0%, #2563EB 100%)',
            }}
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Add Candidate</span>
          </button>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-2xl border border-[#ECEAE4] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF9F6] border-b border-[#ECEAE4] text-[#5B616B] font-medium">
                <th
                  onClick={() => toggleSort('name')}
                  className="py-3 px-4 cursor-pointer hover:text-[#14161A]"
                >
                  <div className="flex items-center gap-1">
                    <span>Driver Name</span>
                    <ArrowUpDown className="w-3 h-3 text-[#9AA0A8]" />
                  </div>
                </th>
                <th className="py-3 px-4">CDL Credentials</th>
                <th className="py-3 px-4">Division & Route</th>
                <th
                  onClick={() => toggleSort('experience')}
                  className="py-3 px-4 cursor-pointer hover:text-[#14161A]"
                >
                  <div className="flex items-center gap-1">
                    <span>Exp</span>
                    <ArrowUpDown className="w-3 h-3 text-[#9AA0A8]" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('stage')}
                  className="py-3 px-4 cursor-pointer hover:text-[#14161A]"
                >
                  <div className="flex items-center gap-1">
                    <span>Pipeline Stage</span>
                    <ArrowUpDown className="w-3 h-3 text-[#9AA0A8]" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('readiness')}
                  className="py-3 px-4 cursor-pointer hover:text-[#14161A]"
                >
                  <div className="flex items-center gap-1">
                    <span>DQ Score</span>
                    <ArrowUpDown className="w-3 h-3 text-[#9AA0A8]" />
                  </div>
                </th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECEAE4]">
              {paginatedDrivers.map((driver) => {
                const recruiter = users.find((u) => u.id === driver.assignedRecruiterId);

                return (
                  <tr
                    key={driver.id}
                    onClick={() => setView('driver_profile', driver.id)}
                    className="hover:bg-[#FAF9F6]/60 cursor-pointer transition-colors group"
                  >
                    {/* Name & Avatar */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#ECEAE4]/60 flex items-center justify-center text-xs font-semibold text-[#14161A] shrink-0">
                          {driver.firstName[0]}
                          {driver.lastName[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-[#14161A] group-hover:text-[#0E7C7B] transition-colors">
                            {driver.firstName} {driver.lastName}
                          </div>
                          <div className="text-[11px] text-[#9AA0A8]">
                            DOB: {driver.dateOfBirth}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* CDL info */}
                    <td className="py-3 px-4">
                      <div className="font-mono text-xs font-medium text-[#14161A]">
                        {driver.cdlNumber}
                      </div>
                      <div className="text-[11px] text-[#5B616B] flex items-center gap-1.5">
                        <span>{driver.cdlState} · {driver.cdlClass}</span>
                        {driver.endorsements.length > 0 && (
                          <span className="text-[10px] text-[#0E7C7B]">
                            ({driver.endorsements.length} Endorsed)
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Target Position */}
                    <td className="py-3 px-4">
                      <div className="text-xs text-[#14161A]">{driver.targetPosition}</div>
                      <div className="text-[11px] text-[#9AA0A8]">{driver.source}</div>
                    </td>

                    {/* Experience */}
                    <td className="py-3 px-4 font-mono text-xs text-[#14161A]">
                      {driver.totalExperienceYears} yrs
                    </td>

                    {/* Stage */}
                    <td className="py-3 px-4">
                      <span className="text-[11px] font-medium capitalize text-[#14161A]">
                        {driver.stage.replace(/_/g, ' ')}
                      </span>
                      {driver.safetyApprovalStatus === 'Approved' && (
                        <div className="text-[10px] text-[#0E7C7B] font-medium flex items-center gap-1 mt-0.5">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Safety Cleared</span>
                        </div>
                      )}
                    </td>

                    {/* DQ Score Ring */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <ReadinessRing percentage={driver.dqReadinessPercentage} size={30} strokeWidth={3} />
                        <span className="text-xs font-mono font-medium text-[#5B616B]">
                          {driver.dqReadinessPercentage}%
                        </span>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3 px-4 text-[11px] text-[#5B616B]">
                      <div>{driver.phone}</div>
                      <div className="text-[10px] text-[#9AA0A8] truncate max-w-[130px]">{driver.email}</div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenCallModal(driver.id)}
                          className="p-1.5 rounded-lg text-[#9AA0A8] hover:text-[#0E7C7B] hover:bg-[#FAF9F6] transition-colors"
                          title="Log Call"
                        >
                          <PhoneCall className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </button>
                        <button
                          onClick={() => setView('driver_profile', driver.id)}
                          className="p-1.5 rounded-lg text-[#9AA0A8] hover:text-[#14161A] hover:bg-[#FAF9F6] transition-colors"
                          title="View Profile"
                        >
                          <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#FAF9F6] border-t border-[#ECEAE4] text-xs text-[#5B616B]">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, sortedDrivers.length)} of {sortedDrivers.length} candidates
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-lg border border-[#ECEAE4] bg-white disabled:opacity-40 hover:bg-[#FAF9F6] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
            </button>
            <span className="font-mono text-xs">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-lg border border-[#ECEAE4] bg-white disabled:opacity-40 hover:bg-[#FAF9F6] transition-colors"
            >
              <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
