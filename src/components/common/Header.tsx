import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import {
  Search,
  Bell,
  ChevronDown,
  Building2,
  UserCheck,
  Smartphone,
  RotateCcw,
  Shield,
  Check,
  AlertTriangle,
  FileCheck,
  Clock,
  LogOut,
} from 'lucide-react';

interface HeaderProps {
  onOpenCommandPalette: () => void;
  onOpenNewDriverModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCommandPalette, onOpenNewDriverModal }) => {
  const {
    currentTenantId,
    currentUserId,
    tenants,
    users,
    notifications,
    setTenant,
    setUser,
    setView,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    resetDataToDefaults,
  } = useStore();

  const [tenantDropdownOpen, setTenantDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const tenantMenuRef = useRef<HTMLDivElement>(null);
  const roleMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  const activeTenant = tenants.find((t) => t.id === currentTenantId) || tenants[0];
  const activeUser = users.find((u) => u.id === currentUserId) || users[0];
  const tenantNotifications = notifications.filter((n) => n.tenantId === currentTenantId);
  const unreadCount = tenantNotifications.filter((n) => !n.isRead).length;

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tenantMenuRef.current && !tenantMenuRef.current.contains(e.target as Node)) {
        setTenantDropdownOpen(false);
      }
      if (roleMenuRef.current && !roleMenuRef.current.contains(e.target as Node)) {
        setRoleDropdownOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-[#ECEAE4] px-4 lg:px-6 flex items-center justify-between gap-4">
      {/* Left: Search Trigger (Cmd+K) */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3.5 py-2 bg-[#FAF9F6] hover:bg-[#F5F4F0] border border-[#ECEAE4] rounded-xl text-left text-xs text-[#5B616B] transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-[#9AA0A8] group-hover:text-[#14161A] transition-colors" strokeWidth={1.5} />
            <span className="truncate">Search driver records, CDL #, phone...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 font-mono text-[10px] text-[#9AA0A8] bg-white border border-[#ECEAE4] rounded shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Quick Driver Portal Switcher */}
        <button
          onClick={() => setView('driver_portal')}
          className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#14161A] bg-[#FAF9F6] hover:bg-[#F5F4F0] border border-[#ECEAE4] rounded-xl transition-colors"
          title="Open Driver Self-Service Mobile Wizard"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#0E7C7B]" strokeWidth={1.5} />
          <span>Driver Portal Preview</span>
        </button>

        {/* Tenant Switcher Dropdown */}
        <div className="relative" ref={tenantMenuRef}>
          <button
            onClick={() => setTenantDropdownOpen(!tenantDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-[#14161A] bg-white hover:bg-[#FAF9F6] border border-[#ECEAE4] rounded-xl transition-all shadow-2xs"
          >
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: activeTenant.primaryColor }}
            />
            <span className="font-heading max-w-[130px] truncate">{activeTenant.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#9AA0A8]" strokeWidth={1.5} />
          </button>

          {tenantDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-[#ECEAE4] shadow-xl p-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2.5 py-1.5 text-[11px] font-semibold text-[#9AA0A8] uppercase tracking-wider">
                Select Tenant Workspace
              </div>
              {tenants.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTenant(t.id);
                    setTenantDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                    t.id === currentTenantId ? 'bg-[#FAF9F6] font-semibold text-[#14161A]' : 'text-[#5B616B] hover:bg-[#FAF9F6]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: t.primaryColor }} />
                    <div>
                      <div className="font-heading">{t.name}</div>
                      <div className="text-[10px] text-[#9AA0A8] font-mono">
                        DOT #{t.dotNumber} · {t.fleetSize} Tractors
                      </div>
                    </div>
                  </div>
                  {t.id === currentTenantId && <Check className="w-3.5 h-3.5 text-[#0E7C7B]" strokeWidth={2} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Role & Staff Switcher Dropdown (Demo Purpose) */}
        <div className="relative" ref={roleMenuRef}>
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#14161A] bg-white hover:bg-[#FAF9F6] border border-[#ECEAE4] rounded-xl transition-all shadow-2xs"
            title="Switch staff role for demo evaluation"
          >
            <img
              src={activeUser.avatarUrl}
              alt={activeUser.name}
              className="w-5 h-5 rounded-full object-cover border border-[#ECEAE4]"
            />
            <div className="text-left hidden sm:block">
              <div className="font-semibold text-xs leading-none text-[#14161A]">{activeUser.name}</div>
              <div className="text-[10px] text-[#0E7C7B] font-medium leading-tight mt-0.5">{activeUser.role}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#9AA0A8]" strokeWidth={1.5} />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl border border-[#ECEAE4] shadow-xl p-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2.5 py-1.5 text-[11px] font-semibold text-[#9AA0A8] uppercase tracking-wider flex items-center justify-between">
                <span>Switch Staff Role</span>
                <span className="text-[10px] font-normal text-[#5B616B]">Interactive Demo</span>
              </div>
              <div className="space-y-0.5">
                {users.map((u) => {
                  const isCurrent = u.id === currentUserId;
                  const isCurrentTenant = u.tenantId === currentTenantId;
                  return (
                    <button
                      key={u.id}
                      onClick={() => {
                        setUser(u.id);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                        isCurrent ? 'bg-[#FAF9F6] font-semibold text-[#14161A]' : 'text-[#5B616B] hover:bg-[#FAF9F6]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={u.avatarUrl} alt={u.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                        <div>
                          <div className="text-xs font-semibold text-[#14161A] flex items-center gap-1.5">
                            {u.name}
                            {!isCurrentTenant && (
                              <span className="text-[9px] px-1 py-0.2 rounded bg-slate-100 text-slate-500 font-mono">
                                Other Tenant
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#0E7C7B] font-medium">{u.role} · {u.title}</div>
                        </div>
                      </div>
                      {isCurrent && <Check className="w-3.5 h-3.5 text-[#0E7C7B]" strokeWidth={2} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifMenuRef}>
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative p-2 text-[#5B616B] hover:text-[#14161A] hover:bg-[#FAF9F6] border border-[#ECEAE4] rounded-xl transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" strokeWidth={1.5} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F5A524] text-white font-mono text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-84 bg-white rounded-xl border border-[#ECEAE4] shadow-xl p-2 z-40 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between px-2 py-1.5 border-b border-[#ECEAE4] mb-1.5">
                <div className="text-xs font-semibold text-[#14161A] font-heading">
                  Alerts & Compliance Feed
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] text-[#0E7C7B] hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto space-y-1">
                {tenantNotifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-[#9AA0A8]">No active alerts</div>
                ) : (
                  tenantNotifications.map((notif) => {
                    let Icon = AlertTriangle;
                    let iconColor = 'text-[#F5A524]';
                    if (notif.type === 'new_application') {
                      Icon = FileCheck;
                      iconColor = 'text-[#0E7C7B]';
                    } else if (notif.type === 'voe_overdue') {
                      Icon = Clock;
                      iconColor = 'text-[#DC2626]';
                    }

                    return (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationAsRead(notif.id);
                          if (notif.driverId) {
                            setView('driver_profile', notif.driverId);
                            setNotifDropdownOpen(false);
                          }
                        }}
                        className={`p-2.5 rounded-lg cursor-pointer transition-colors ${
                          notif.isRead ? 'bg-white hover:bg-[#FAF9F6]' : 'bg-[#FAF9F6] hover:bg-[#F5F4F0]'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${iconColor}`} strokeWidth={1.5} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-[#14161A] truncate">
                                {notif.title}
                              </span>
                              {!notif.isRead && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#0E7C7B] shrink-0" />
                              )}
                            </div>
                            <p className="text-[11px] text-[#5B616B] mt-0.5 leading-snug">
                              {notif.message}
                            </p>
                            <span className="text-[10px] text-[#9AA0A8] font-mono mt-1 block">
                              Just now
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Demo reset data */}
        <button
          onClick={resetDataToDefaults}
          title="Reset demo data to default synthetic set"
          className="p-2 text-[#9AA0A8] hover:text-[#14161A] hover:bg-[#FAF9F6] border border-[#ECEAE4] rounded-xl transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
};
