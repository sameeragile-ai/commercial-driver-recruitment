import React, { useMemo, useState } from 'react';
import { useStore } from '../../store/useStore';
import { Driver, DriverPipelineStage } from '../../types';
import { ReadinessRing } from '../../components/common/ReadinessRing';
import {
  Search,
  Filter,
  Plus,
  ArrowRight,
  PhoneCall,
  FileText,
  User,
  MoreVertical,
  CheckCircle2,
  Table as TableIcon,
  Kanban as KanbanIcon,
} from 'lucide-react';

interface KanbanPipelineProps {
  onOpenNewDriverModal: () => void;
  onOpenCallModal: (driverId: string) => void;
}

export const KanbanPipeline: React.FC<KanbanPipelineProps> = ({
  onOpenNewDriverModal,
  onOpenCallModal,
}) => {
  const {
    drivers,
    currentTenantId,
    users,
    setView,
    moveDriverStage,
  } = useStore();

  const [search, setSearch] = useState('');
  const [filterPosition, setFilterPosition] = useState('all');
  const [draggedDriverId, setDraggedDriverId] = useState<string | null>(null);

  const tenantDrivers = useMemo(() => {
    return drivers.filter((d) => {
      if (d.tenantId !== currentTenantId) return false;
      if (filterPosition !== 'all' && d.targetPosition !== filterPosition) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matches =
          d.firstName.toLowerCase().includes(q) ||
          d.lastName.toLowerCase().includes(q) ||
          d.cdlNumber.toLowerCase().includes(q) ||
          d.phone.includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [drivers, currentTenantId, filterPosition, search]);

  const STAGE_CONFIGS: Array<{ id: DriverPipelineStage; title: string; color: string }> = [
    { id: 'new_lead', title: 'New Leads', color: '#64748B' },
    { id: 'contacted', title: 'Contacted', color: '#0284C7' },
    { id: 'pre_qualified', title: 'Pre-Qualified', color: '#0E7C7B' },
    { id: 'application_submitted', title: 'App Complete', color: '#2563EB' },
    { id: 'documents_review', title: 'Docs & OCR Review', color: '#7C3AED' },
    { id: 'voe_in_progress', title: 'VOE In Progress', color: '#D97706' },
    { id: 'conditional_offer', title: 'Conditional Offer', color: '#EA580C' },
    { id: 'orientation_scheduled', title: 'Orientation', color: '#16A34A' },
    { id: 'dq_ready', title: 'DQ Ready', color: '#0E7C7B' },
  ];

  const handleDragStart = (e: React.DragEvent, driverId: string) => {
    e.dataTransfer.setData('text/plain', driverId);
    setDraggedDriverId(driverId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: DriverPipelineStage) => {
    e.preventDefault();
    const driverId = e.dataTransfer.getData('text/plain') || draggedDriverId;
    if (driverId) {
      moveDriverStage(driverId, targetStage);
    }
    setDraggedDriverId(null);
  };

  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col space-y-4">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-lg font-bold font-heading text-[#14161A]">Recruiting Kanban Pipeline</h1>
            <p className="text-xs text-[#5B616B]">
              Drag and drop candidate cards across DOT qualification milestones
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#9AA0A8] absolute left-3 top-2.5" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search stage..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-xs pl-8 pr-3 py-1.5 bg-white border border-[#ECEAE4] rounded-xl outline-none focus:border-[#0E7C7B] w-48 shadow-2xs"
            />
          </div>

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
            onClick={() => setView('drivers')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#5B616B] hover:text-[#14161A] bg-white border border-[#ECEAE4] rounded-xl transition-all shadow-2xs"
          >
            <TableIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Table View</span>
          </button>

          <button
            onClick={onOpenNewDriverModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-xl shadow-xs transition-all active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #0E7C7B 0%, #2563EB 100%)',
            }}
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Add Driver</span>
          </button>
        </div>
      </div>

      {/* Kanban Columns Horizontal Scrolling Board */}
      <div className="flex-1 flex gap-4 overflow-x-auto pb-4 pt-1">
        {STAGE_CONFIGS.map((stage) => {
          const stageDrivers = tenantDrivers.filter((d) => d.stage === stage.id);

          return (
            <div
              key={stage.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
              className="w-80 shrink-0 flex flex-col bg-[#FAF9F6]/80 rounded-2xl border border-[#ECEAE4] p-3 overflow-hidden"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 px-1 border-b border-[#ECEAE4] mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  />
                  <span className="text-xs font-semibold text-[#14161A] font-heading">
                    {stage.title}
                  </span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white border border-[#ECEAE4] text-[#5B616B] font-semibold">
                  {stageDrivers.length}
                </span>
              </div>

              {/* Cards List in Column */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {stageDrivers.map((driver) => {
                  return (
                    <div
                      key={driver.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, driver.id)}
                      className="bg-white rounded-xl p-3.5 border border-[#ECEAE4] shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-grab active:cursor-grabbing group relative"
                    >
                      {/* Driver Card Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div
                          onClick={() => setView('driver_profile', driver.id)}
                          className="cursor-pointer"
                        >
                          <div className="text-xs font-semibold text-[#14161A] font-heading group-hover:text-[#0E7C7B] transition-colors">
                            {driver.firstName} {driver.lastName}
                          </div>
                          <div className="text-[11px] text-[#5B616B] flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono">{driver.cdlNumber}</span>
                            <span>·</span>
                            <span className="font-semibold text-slate-700">{driver.cdlState}</span>
                          </div>
                        </div>

                        <ReadinessRing percentage={driver.dqReadinessPercentage} size={32} strokeWidth={3} />
                      </div>

                      {/* Position & Source */}
                      <div className="mt-2.5 pt-2 border-t border-[#ECEAE4]/80 flex items-center justify-between text-[11px] text-[#5B616B]">
                        <span className="truncate max-w-[130px]">{driver.targetPosition}</span>
                        <span className="text-[10px] text-[#9AA0A8] font-mono">{driver.source}</span>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="mt-2 flex items-center justify-between gap-2 pt-2">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenCallModal(driver.id);
                            }}
                            className="p-1 rounded text-[#9AA0A8] hover:text-[#0E7C7B] hover:bg-[#FAF9F6] transition-colors"
                            title="Log Call / Note"
                          >
                            <PhoneCall className="w-3.5 h-3.5" strokeWidth={1.5} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setView('driver_profile', driver.id);
                            }}
                            className="p-1 rounded text-[#9AA0A8] hover:text-[#2563EB] hover:bg-[#FAF9F6] transition-colors"
                            title="View Profile"
                          >
                            <FileText className="w-3.5 h-3.5" strokeWidth={1.5} />
                          </button>
                        </div>

                        {/* Quick Advance Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const currentIndex = STAGE_CONFIGS.findIndex((s) => s.id === stage.id);
                            if (currentIndex < STAGE_CONFIGS.length - 1) {
                              moveDriverStage(driver.id, STAGE_CONFIGS[currentIndex + 1].id);
                            }
                          }}
                          className="inline-flex items-center gap-1 text-[10px] font-medium text-[#5B616B] hover:text-[#0E7C7B] transition-colors"
                          title="Advance to next compliance milestone"
                        >
                          <span>Advance</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {stageDrivers.length === 0 && (
                  <div className="py-8 text-center text-xs text-[#9AA0A8] border border-dashed border-[#ECEAE4] rounded-xl">
                    No candidates
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
