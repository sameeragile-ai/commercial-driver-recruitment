import React from 'react';
import { useStore, AppView } from '../../store/useStore';
import {
  LayoutDashboard,
  Kanban,
  Users,
  PieChart,
  ListFilter,
  DollarSign,
  FileText,
  ScanLine,
  FileCheck2,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Truck,
  PlusCircle,
} from 'lucide-react';

interface SidebarProps {
  onOpenNewDriverModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenNewDriverModal }) => {
  const {
    currentView,
    setView,
    currentTenantId,
    tenants,
    sidebarCollapsed,
    setSidebarCollapsed,
  } = useStore();

  const activeTenant = tenants.find((t) => t.id === currentTenantId) || tenants[0];

  const navSections = [
    {
      title: 'Recruiting & CRM',
      items: [
        { id: 'dashboard' as AppView, label: 'Overview', icon: LayoutDashboard },
        { id: 'pipeline' as AppView, label: 'Pipeline Kanban', icon: Kanban },
        { id: 'drivers' as AppView, label: 'Driver Directory', icon: Users },
        { id: 'sources' as AppView, label: 'Sources & Analytics', icon: PieChart },
      ],
    },
    {
      title: 'Screening & Qualification',
      items: [
        { id: 'questionnaire' as AppView, label: 'Pre-Qual Builder', icon: ListFilter },
        { id: 'pay_structures' as AppView, label: 'Pay Structures', icon: DollarSign },
        { id: 'offers' as AppView, label: 'Offer Letters', icon: FileText },
        { id: 'ocr_scan' as AppView, label: 'AI OCR Scanner', icon: ScanLine },
        { id: 'voe' as AppView, label: 'Employment VOE', icon: FileCheck2 },
        { id: 'dq_readiness' as AppView, label: 'DQ Readiness', icon: ShieldCheck },
      ],
    },
    {
      title: 'Platform',
      items: [
        { id: 'settings' as AppView, label: 'Settings & API', icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={`relative z-20 flex flex-col justify-between bg-white border-r border-[#ECEAE4] transition-all duration-300 select-none ${
        sidebarCollapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Top: Logo & Tenant Title */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#ECEAE4]">
          <div
            onClick={() => setView('dashboard')}
            className="flex items-center gap-3 cursor-pointer overflow-hidden"
          >
            {/* RigReady Brand Logo Mark */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0E7C7B] via-[#2563EB] to-[#F5A524] p-[1.5px] shrink-0 shadow-sm">
              <div className="w-full h-full bg-[#14161A] rounded-[10px] flex items-center justify-center text-white">
                <Truck className="w-4 h-4 text-[#FAF9F6]" strokeWidth={1.5} />
              </div>
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-bold text-base tracking-tight text-[#14161A]">
                    RigReady
                  </span>
                  <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-[#FAF9F6] border border-[#ECEAE4] text-[#5B616B]">
                    M01
                  </span>
                </div>
                <div className="text-[11px] text-[#5B616B] truncate font-sans">
                  {activeTenant.name}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 rounded-lg text-[#9AA0A8] hover:text-[#14161A] hover:bg-[#FAF9F6] transition-colors"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
            ) : (
              <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
            )}
          </button>
        </div>

        {/* Quick Action Button: New Driver */}
        <div className="p-3">
          <button
            onClick={onOpenNewDriverModal}
            className={`w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-white rounded-xl shadow-sm transition-all duration-200 active:scale-[0.98] ${
              sidebarCollapsed ? 'px-0' : ''
            }`}
            style={{
              background: 'linear-gradient(135deg, #0E7C7B 0%, #2563EB 100%)',
            }}
            title="Create Driver Record"
          >
            <PlusCircle className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            {!sidebarCollapsed && <span>New Driver Lead</span>}
          </button>
        </div>

        {/* Nav Sections */}
        <div className="px-2.5 py-1 space-y-5 overflow-y-auto max-h-[calc(100vh-220px)]">
          {navSections.map((section) => (
            <div key={section.title}>
              {!sidebarCollapsed && (
                <div className="px-2.5 pb-1 text-[10px] font-bold text-[#9AA0A8] uppercase tracking-wider">
                  {section.title}
                </div>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = currentView === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setView(item.id)}
                      className={`relative w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                        isActive
                          ? 'text-[#0E7C7B] bg-[#0E7C7B]/8 font-semibold'
                          : 'text-[#5B616B] hover:text-[#14161A] hover:bg-[#FAF9F6]'
                      } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#0E7C7B]" />
                      )}
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-[#0E7C7B]' : 'text-[#9AA0A8]'
                        }`}
                        strokeWidth={1.5}
                      />
                      {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Tenant Info Card */}
      {!sidebarCollapsed ? (
        <div className="p-3 m-3 bg-[#FAF9F6] border border-[#ECEAE4] rounded-xl text-left">
          <div className="flex items-center justify-between text-xs font-semibold text-[#14161A] mb-1">
            <span className="font-heading truncate">{activeTenant.name}</span>
            <span className="text-[10px] font-mono text-[#0E7C7B]">ACTIVE</span>
          </div>
          <div className="text-[11px] text-[#5B616B] space-y-0.5 font-mono">
            <div>DOT #{activeTenant.dotNumber}</div>
            <div>MC #{activeTenant.mcNumber}</div>
            <div className="font-sans text-[11px] text-[#9AA0A8] mt-1">
              {activeTenant.fleetSize} Active Power Units
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 flex justify-center">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: activeTenant.primaryColor }}
            title={activeTenant.name}
          />
        </div>
      )}
    </aside>
  );
};
