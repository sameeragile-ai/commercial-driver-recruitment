import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useStore, AppView } from '../../store/useStore';
import {
  Search,
  User as UserIcon,
  LayoutDashboard,
  Kanban,
  FileText,
  DollarSign,
  ShieldCheck,
  Building,
  CheckCircle,
  FileSearch,
  ExternalLink,
  X,
  CreditCard,
  ArrowRight,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const { drivers, currentTenantId, setView } = useStore();

  const tenantDrivers = useMemo(() => {
    return drivers.filter((d) => d.tenantId === currentTenantId);
  }, [drivers, currentTenantId]);

  // Actions and modules navigation
  const navigationItems = [
    { label: 'Executive Dashboard', view: 'dashboard' as AppView, icon: LayoutDashboard, category: 'Navigation' },
    { label: 'Recruiting Kanban Pipeline', view: 'pipeline' as AppView, icon: Kanban, category: 'Navigation' },
    { label: 'Driver Database (Table View)', view: 'drivers' as AppView, icon: UserIcon, category: 'Navigation' },
    { label: 'Sources & Referral Analytics', view: 'sources' as AppView, icon: Building, category: 'Navigation' },
    { label: 'Pre-Qualification Builder', view: 'questionnaire' as AppView, icon: CheckCircle, category: 'Navigation' },
    { label: 'Pay Structure Models', view: 'pay_structures' as AppView, icon: DollarSign, category: 'Navigation' },
    { label: 'Conditional Offer Letters', view: 'offers' as AppView, icon: FileText, category: 'Navigation' },
    { label: 'AI CDL License Scanner', view: 'ocr_scan' as AppView, icon: CreditCard, category: 'Navigation' },
    { label: 'Employment Verifications (VOE)', view: 'voe' as AppView, icon: FileSearch, category: 'Navigation' },
    { label: 'DQ Readiness & Compliance', view: 'dq_readiness' as AppView, icon: ShieldCheck, category: 'Navigation' },
  ];

  const matchedDrivers = useMemo(() => {
    if (!query.trim()) return tenantDrivers.slice(0, 6);
    const q = query.toLowerCase().trim();
    return tenantDrivers
      .filter(
        (d) =>
          d.firstName.toLowerCase().includes(q) ||
          d.lastName.toLowerCase().includes(q) ||
          d.cdlNumber.toLowerCase().includes(q) ||
          d.cdlState.toLowerCase().includes(q) ||
          d.email.toLowerCase().includes(q) ||
          d.phone.includes(q) ||
          d.dateOfBirth.includes(q) ||
          d.targetPosition.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [tenantDrivers, query]);

  const filteredNav = useMemo(() => {
    if (!query.trim()) return navigationItems;
    const q = query.toLowerCase().trim();
    return navigationItems.filter((item) => item.label.toLowerCase().includes(q));
  }, [query]);

  const allResults = useMemo(() => {
    const res: Array<{ type: 'driver' | 'nav'; item: any }> = [];
    matchedDrivers.forEach((d) => res.push({ type: 'driver', item: d }));
    filteredNav.forEach((n) => res.push({ type: 'nav', item: n }));
    return res;
  }, [matchedDrivers, filteredNav]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < allResults.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = allResults[selectedIndex];
        if (selected) {
          if (selected.type === 'driver') {
            setView('driver_profile', selected.item.id);
          } else {
            setView(selected.item.view);
          }
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, allResults, onClose, setView]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/35 backdrop-blur-[2px] transition-all">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-[#ECEAE4] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#ECEAE4] gap-3">
          <Search className="w-5 h-5 text-[#9AA0A8] shrink-0" strokeWidth={1.5} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search drivers by name, CDL #, state, phone, DOB, or jump to view..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full text-sm text-[#14161A] placeholder-[#9AA0A8] bg-transparent outline-none font-sans"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-[#5B616B] bg-[#F5F4F0] border border-[#ECEAE4] rounded">
            ESC
          </kbd>
          <button onClick={onClose} className="p-1 text-[#9AA0A8] hover:text-[#14161A] rounded">
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {/* Driver Candidates */}
          {matchedDrivers.length > 0 && (
            <div className="mb-3">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-[#9AA0A8] uppercase tracking-wider">
                Driver Records ({matchedDrivers.length})
              </div>
              <div className="space-y-0.5">
                {matchedDrivers.map((driver, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <button
                      key={driver.id}
                      onClick={() => {
                        setView('driver_profile', driver.id);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors ${
                        isSelected ? 'bg-[#FAF9F6] border border-[#0E7C7B]/20' : 'hover:bg-[#FAF9F6] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#ECEAE4]/60 flex items-center justify-center text-xs font-semibold text-[#14161A] shrink-0">
                          {driver.firstName[0]}
                          {driver.lastName[0]}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#14161A] truncate">
                              {driver.firstName} {driver.lastName}
                            </span>
                            <span className="text-xs text-[#5B616B] font-mono">{driver.cdlNumber}</span>
                            <span className="text-[11px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-medium">
                              {driver.cdlState}
                            </span>
                          </div>
                          <div className="text-xs text-[#5B616B] truncate mt-0.5 flex items-center gap-2">
                            <span>{driver.targetPosition}</span>
                            <span>·</span>
                            <span>{driver.phone}</span>
                            <span>·</span>
                            <span className="capitalize">{driver.stage.replace(/_/g, ' ')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-mono font-medium text-[#0E7C7B]">
                          {driver.dqReadinessPercentage}% DQ
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#9AA0A8]" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Views */}
          {filteredNav.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[11px] font-semibold text-[#9AA0A8] uppercase tracking-wider">
                Modules & Tools
              </div>
              <div className="space-y-0.5">
                {filteredNav.map((nav, idx) => {
                  const globalIdx = matchedDrivers.length + idx;
                  const isSelected = selectedIndex === globalIdx;
                  const Icon = nav.icon;
                  return (
                    <button
                      key={nav.label}
                      onClick={() => {
                        setView(nav.view);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
                        isSelected ? 'bg-[#FAF9F6] border border-[#0E7C7B]/20' : 'hover:bg-[#FAF9F6] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[#FAF9F6] border border-[#ECEAE4] flex items-center justify-center text-[#5B616B]">
                          <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </div>
                        <span className="text-xs font-medium text-[#14161A]">{nav.label}</span>
                      </div>
                      <span className="text-[11px] text-[#9AA0A8]">Jump to module</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {allResults.length === 0 && (
            <div className="py-12 text-center">
              <Search className="w-8 h-8 text-[#9AA0A8] mx-auto mb-2 opacity-50" strokeWidth={1.5} />
              <p className="text-sm font-medium text-[#14161A]">No records found for "{query}"</p>
              <p className="text-xs text-[#5B616B] mt-1">Try searching by CDL number, state, driver name or phone number.</p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#FAF9F6] border-t border-[#ECEAE4] text-[11px] text-[#5B616B]">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-white border border-[#ECEAE4] rounded">↑</kbd>{' '}
              <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-white border border-[#ECEAE4] rounded">↓</kbd> Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-white border border-[#ECEAE4] rounded">↵</kbd> Select
            </span>
          </div>
          <span className="font-mono text-[#9AA0A8]">RigReady Instant Search</span>
        </div>
      </div>
    </div>
  );
};
