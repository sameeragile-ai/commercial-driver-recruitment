import React, { useState, useEffect } from 'react';
import { useStore } from './store/useStore';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { CommandPalette } from './components/common/CommandPalette';
import { ToastContainer } from './components/common/ToastContainer';
import { NewDriverModal } from './features/recruiting/NewDriverModal';
import { CallNoteModal } from './features/recruiting/CallNoteModal';

// Views
import { DashboardView } from './features/dashboard/DashboardView';
import { KanbanPipeline } from './features/recruiting/KanbanPipeline';
import { DriverTableView } from './features/recruiting/DriverTableView';
import { DriverProfileView } from './features/recruiting/DriverProfileView';
import { SourcesView } from './features/sources/SourcesView';
import { QuestionnaireBuilderView } from './features/questionnaire/QuestionnaireBuilderView';
import { PayStructureView } from './features/compensation/PayStructureView';
import { OfferLettersView } from './features/offers/OfferLettersView';
import { DocumentOcrScanner } from './features/ocr/DocumentOcrScanner';
import { EmploymentVerificationView } from './features/voe/EmploymentVerificationView';
import { DqReadinessView } from './features/dq/DqReadinessView';
import { SettingsView } from './features/settings/SettingsView';
import { MobileApplicationPortal } from './features/portal/MobileApplicationPortal';

export default function App() {
  const { currentView, selectedDriverId, setView, drivers, currentTenantId } = useStore();

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [newDriverModalOpen, setNewDriverModalOpen] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [callModalDriverId, setCallModalDriverId] = useState<string>('');

  // Global Cmd+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openCallModal = (driverId: string) => {
    setCallModalDriverId(driverId);
    setCallModalOpen(true);
  };

  // If driver_portal view is active, render full-screen applicant portal
  if (currentView === 'driver_portal') {
    return (
      <div className="min-h-screen bg-[#FAF9F6] selection:bg-[#0E7C7B]/15 selection:text-[#0E7C7B]">
        <MobileApplicationPortal onBackToApp={() => setView('dashboard')} />
        <ToastContainer />
      </div>
    );
  }

  // Get active driver ID for profile or fallback to first driver of current tenant
  const tenantDrivers = drivers.filter((d) => d.tenantId === currentTenantId);
  const effectiveDriverId = selectedDriverId || (tenantDrivers[0]?.id || '');

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#14161A] flex flex-col selection:bg-[#0E7C7B]/15 selection:text-[#0E7C7B]">
      {/* Shell with Left Sidebar & Top Header */}
      <div className="flex-1 flex min-h-screen">
        <Sidebar onOpenNewDriverModal={() => setNewDriverModalOpen(true)} />

        <div className="flex-1 flex flex-col min-w-0">
          <Header
            onOpenCommandPalette={() => setCommandPaletteOpen(true)}
            onOpenNewDriverModal={() => setNewDriverModalOpen(true)}
          />

          {/* Main Workspace Routed Body */}
          <main className="flex-1 min-w-0 overflow-y-auto">
            {currentView === 'dashboard' && <DashboardView />}
            {currentView === 'pipeline' && (
              <KanbanPipeline
                onOpenNewDriverModal={() => setNewDriverModalOpen(true)}
                onOpenCallModal={openCallModal}
              />
            )}
            {currentView === 'drivers' && (
              <DriverTableView
                onOpenNewDriverModal={() => setNewDriverModalOpen(true)}
                onOpenCallModal={openCallModal}
              />
            )}
            {currentView === 'driver_profile' && (
              <DriverProfileView
                driverId={effectiveDriverId}
                onOpenCallModal={openCallModal}
              />
            )}
            {currentView === 'sources' && <SourcesView />}
            {currentView === 'questionnaire' && <QuestionnaireBuilderView />}
            {currentView === 'pay_structures' && <PayStructureView />}
            {currentView === 'offers' && <OfferLettersView />}
            {currentView === 'ocr_scan' && (
              <DocumentOcrScanner preselectedDriverId={effectiveDriverId} />
            )}
            {currentView === 'voe' && <EmploymentVerificationView />}
            {currentView === 'dq_readiness' && <DqReadinessView />}
            {currentView === 'settings' && <SettingsView />}
          </main>
        </div>
      </div>

      {/* Global Modals & Toasts */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      <NewDriverModal
        isOpen={newDriverModalOpen}
        onClose={() => setNewDriverModalOpen(false)}
      />

      {callModalDriverId && (
        <CallNoteModal
          isOpen={callModalOpen}
          onClose={() => {
            setCallModalOpen(false);
            setCallModalDriverId('');
          }}
          driverId={callModalDriverId}
        />
      )}

      <ToastContainer />
    </div>
  );
}
