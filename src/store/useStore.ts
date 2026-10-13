import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Tenant,
  TenantId,
  User,
  Driver,
  DriverPipelineStage,
  CommunicationLog,
  AuditEvent,
  DriverDocument,
  EmploymentHistoryEntry,
  SourceCampaign,
  QuestionnaireQuestion,
  PayStructureTemplate,
  ConditionalOfferLetter,
  NotificationAlert,
} from '../types';
import {
  SEED_TENANTS,
  SEED_USERS,
  SEED_DRIVERS,
  SEED_CAMPAIGNS,
  SEED_QUESTIONS,
  SEED_PAY_TEMPLATES,
  SEED_OFFERS,
  SEED_NOTIFICATIONS,
} from '../data/seedData';

export type AppView =
  | 'dashboard'
  | 'pipeline'
  | 'drivers'
  | 'driver_profile'
  | 'sources'
  | 'questionnaire'
  | 'pay_structures'
  | 'offers'
  | 'voe'
  | 'dq_readiness'
  | 'ocr_scan'
  | 'settings'
  | 'driver_portal';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: number;
}

interface RigReadyState {
  // Tenancy & Session
  currentTenantId: TenantId;
  currentUserId: string;
  tenants: Tenant[];
  users: User[];

  // Navigation
  currentView: AppView;
  selectedDriverId: string | null;
  publicAppDriverId: string | null;
  sidebarCollapsed: boolean;

  // Search & Global filter
  searchQuery: string;
  selectedRecruiterFilter: string;
  selectedPositionFilter: string;
  selectedStageFilter: string;

  // Core Data
  drivers: Driver[];
  campaigns: SourceCampaign[];
  questions: QuestionnaireQuestion[];
  payTemplates: PayStructureTemplate[];
  offers: ConditionalOfferLetter[];
  notifications: NotificationAlert[];
  toasts: ToastMessage[];

  // Actions
  setTenant: (tenantId: TenantId) => void;
  setUser: (userId: string) => void;
  setView: (view: AppView, driverId?: string) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSearchQuery: (query: string) => void;
  setRecruiterFilter: (recruiterId: string) => void;
  setPositionFilter: (position: string) => void;
  setStageFilter: (stage: string) => void;

  // Driver actions
  moveDriverStage: (driverId: string, newStage: DriverPipelineStage) => void;
  addDriver: (driver: Partial<Driver>) => Driver;
  updateDriver: (driverId: string, updates: Partial<Driver>) => void;
  mergeDrivers: (primaryId: string, duplicateId: string) => void;
  addCommunication: (driverId: string, log: Omit<CommunicationLog, 'id' | 'timestamp'>) => void;
  updateDriverDocument: (driverId: string, docId: string, updates: Partial<DriverDocument>) => void;
  safetyApproveDriver: (driverId: string, approved: boolean, notes?: string) => void;

  // VOE actions
  updateVoeEntry: (driverId: string, entryId: string, updates: Partial<EmploymentHistoryEntry>) => void;
  sendVoeRequest: (driverId: string, entryId: string, channel: 'email' | 'fax' | 'portal') => void;

  // Offer letter actions
  createOffer: (offerData: Omit<ConditionalOfferLetter, 'id' | 'version' | 'createdAt' | 'updatedAt'>) => string;
  approveOffer: (offerId: string) => void;
  signOffer: (offerId: string, signatureText: string, signatureDataUrl?: string) => void;

  // Configuration actions
  updateTenantBranding: (tenantId: TenantId, updates: Partial<Tenant>) => void;
  updateQuestions: (questions: QuestionnaireQuestion[]) => void;
  addPayTemplate: (template: Omit<PayStructureTemplate, 'id'>) => void;
  updatePayTemplate: (id: string, updates: Partial<PayStructureTemplate>) => void;

  // Notifications & Toasts
  markNotificationAsRead: (notifId: string) => void;
  markAllNotificationsAsRead: () => void;
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  // Reset
  resetDataToDefaults: () => void;
}

export const useStore = create<RigReadyState>()(
  persist(
    (set, get) => ({
      currentTenantId: 'tenant_apex',
      currentUserId: 'usr_marcus',
      tenants: SEED_TENANTS,
      users: SEED_USERS,

      currentView: 'dashboard',
      selectedDriverId: null,
      publicAppDriverId: null,
      sidebarCollapsed: false,

      searchQuery: '',
      selectedRecruiterFilter: 'all',
      selectedPositionFilter: 'all',
      selectedStageFilter: 'all',

      drivers: SEED_DRIVERS,
      campaigns: SEED_CAMPAIGNS,
      questions: SEED_QUESTIONS,
      payTemplates: SEED_PAY_TEMPLATES,
      offers: SEED_OFFERS,
      notifications: SEED_NOTIFICATIONS,
      toasts: [],

      setTenant: (tenantId) => {
        const usersInTenant = get().users.filter((u) => u.tenantId === tenantId);
        const nextUser = usersInTenant[0] ? usersInTenant[0].id : get().currentUserId;
        set({ currentTenantId: tenantId, currentUserId: nextUser });
        get().addToast('Tenant Switched', `Active workspace updated to ${get().tenants.find((t) => t.id === tenantId)?.name}`, 'info');
      },

      setUser: (userId) => {
        const user = get().users.find((u) => u.id === userId);
        if (user) {
          set({ currentUserId: userId, currentTenantId: user.tenantId });
          get().addToast('User Switched', `Signed in as ${user.name} (${user.role})`, 'info');
        }
      },

      setView: (view, driverId) => {
        set({
          currentView: view,
          selectedDriverId: driverId !== undefined ? driverId : get().selectedDriverId,
        });
      },

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setRecruiterFilter: (selectedRecruiterFilter) => set({ selectedRecruiterFilter }),
      setPositionFilter: (selectedPositionFilter) => set({ selectedPositionFilter }),
      setStageFilter: (selectedStageFilter) => set({ selectedStageFilter }),

      moveDriverStage: (driverId, newStage) => {
        const { drivers, users, currentUserId } = get();
        const currentUser = users.find((u) => u.id === currentUserId);
        const driver = drivers.find((d) => d.id === driverId);
        if (!driver) return;

        const oldStage = driver.stage;
        let dqPercentage = driver.dqReadinessPercentage;
        if (newStage === 'pre_qualified') dqPercentage = Math.max(dqPercentage, 45);
        if (newStage === 'application_submitted') dqPercentage = Math.max(dqPercentage, 60);
        if (newStage === 'documents_review') dqPercentage = Math.max(dqPercentage, 75);
        if (newStage === 'voe_in_progress') dqPercentage = Math.max(dqPercentage, 85);
        if (newStage === 'conditional_offer') dqPercentage = Math.max(dqPercentage, 90);
        if (newStage === 'orientation_scheduled') dqPercentage = Math.max(dqPercentage, 95);
        if (newStage === 'dq_ready') dqPercentage = 100;

        const auditEvent: AuditEvent = {
          id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          timestamp: new Date().toISOString(),
          actor: currentUser ? currentUser.name : 'Staff Recruiter',
          actorRole: currentUser ? currentUser.role : 'Recruiter',
          action: 'Pipeline Stage Updated',
          field: 'stage',
          oldValue: oldStage,
          newValue: newStage,
          details: `Moved candidate ${driver.firstName} ${driver.lastName} from ${oldStage.replace('_', ' ')} to ${newStage.replace('_', ' ')}`,
        };

        const updatedDrivers = drivers.map((d) =>
          d.id === driverId
            ? {
                ...d,
                stage: newStage,
                dqReadinessPercentage: dqPercentage,
                updatedAt: new Date().toISOString(),
                auditLogs: [auditEvent, ...d.auditLogs],
              }
            : d
        );

        set({ drivers: updatedDrivers });
        get().addToast(
          'Pipeline Updated',
          `${driver.firstName} ${driver.lastName} moved to ${newStage.replace(/_/g, ' ')}`,
          'success'
        );
      },

      addDriver: (driverData) => {
        const { currentTenantId, currentUserId, users, drivers } = get();
        const currentUser = users.find((u) => u.id === currentUserId);
        const newId = `drv_${Date.now().toString().slice(-5)}`;
        const token = `tok_${Math.random().toString(36).substring(2, 10)}`;

        const audit: AuditEvent = {
          id: `aud_${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: currentUser?.name || 'Recruiter',
          actorRole: currentUser?.role || 'Staff',
          action: 'Driver Profile Created',
          details: `Created new applicant profile with source ${driverData.source || 'Direct Entry'}`,
        };

        const newDriver: Driver = {
          id: newId,
          tenantId: currentTenantId,
          assignedRecruiterId: driverData.assignedRecruiterId || currentUserId,
          firstName: driverData.firstName || 'New',
          lastName: driverData.lastName || 'Applicant',
          email: driverData.email || '',
          phone: driverData.phone || '',
          dateOfBirth: driverData.dateOfBirth || '1990-01-01',
          city: driverData.city || 'Dallas',
          state: driverData.state || 'TX',
          zip: driverData.zip || '75001',
          cdlNumber: driverData.cdlNumber || '',
          cdlState: driverData.cdlState || driverData.state || 'TX',
          cdlClass: driverData.cdlClass || 'Class A',
          cdlExpiration: driverData.cdlExpiration || '2028-12-31',
          endorsements: driverData.endorsements || ['Tanker (N)'],
          restrictions: driverData.restrictions || [],
          medCardExpiration: driverData.medCardExpiration || '2027-06-30',
          totalExperienceYears: driverData.totalExperienceYears ?? 3,
          stage: driverData.stage || 'new_lead',
          targetPosition: driverData.targetPosition || 'OTR Solo',
          source: driverData.source || 'Direct Inbound',
          sourceCampaign: driverData.sourceCampaign,
          referredBy: driverData.referredBy,
          leadScore: driverData.leadScore ?? 82,
          qualificationStatus: driverData.qualificationStatus || 'Qualified',
          dqReadinessPercentage: 25,
          safetyApprovalStatus: 'Pending Review',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          accidentsCount: driverData.accidentsCount ?? 0,
          movingViolationsCount: driverData.movingViolationsCount ?? 0,
          applicationToken: token,
          applicationCompleted: false,
          notes: driverData.notes || '',
          documents: [
            {
              id: `doc_${newId}_cdl_f`,
              type: 'CDL Front',
              fileName: `${driverData.lastName || 'Driver'}_CDL_Front.jpg`,
              fileSize: '1.8 MB',
              uploadedAt: new Date().toISOString(),
              status: 'Received',
            },
            {
              id: `doc_${newId}_med`,
              type: 'Medical Card',
              fileName: `${driverData.lastName || 'Driver'}_MedCard.pdf`,
              fileSize: '950 KB',
              uploadedAt: new Date().toISOString(),
              expiresAt: driverData.medCardExpiration || '2027-06-30',
              status: 'Approved',
            },
          ],
          employmentHistory: [
            {
              id: `emp_${newId}_1`,
              companyName: 'Previous Logistics Carrier',
              contactPerson: 'Safety Dept',
              phone: '(800) 555-0100',
              email: 'safety@carrier.mock',
              startDate: '2023-01-01',
              endDate: '2026-08-01',
              reasonForLeaving: 'Opportunity to advance',
              equipmentOperated: 'Class A Tractor Trailer',
              hadAccidents: false,
              fmcsrSubject: true,
              dotSafetySensitive: true,
              voeStatus: 'Sent',
              voeSentDate: new Date().toISOString().split('T')[0],
            },
          ],
          communications: [
            {
              id: `com_${newId}_1`,
              timestamp: new Date().toISOString(),
              type: 'internal_note',
              author: currentUser?.name || 'Recruiter',
              authorRole: currentUser?.role || 'Staff',
              summary: 'Driver profile created in CRM',
              outcome: 'Connected',
            },
          ],
          auditLogs: [audit],
        };

        set({ drivers: [newDriver, ...drivers] });
        get().addToast('Driver Created', `${newDriver.firstName} ${newDriver.lastName} has been added to recruiting CRM`, 'success');
        return newDriver;
      },

      updateDriver: (driverId, updates) => {
        const { drivers, users, currentUserId } = get();
        const currentUser = users.find((u) => u.id === currentUserId);

        const audit: AuditEvent = {
          id: `aud_${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: currentUser?.name || 'Recruiter',
          actorRole: currentUser?.role || 'Staff',
          action: 'Driver Information Updated',
          details: `Modified fields: ${Object.keys(updates).join(', ')}`,
        };

        const updatedDrivers = drivers.map((d) => {
          if (d.id !== driverId) return d;
          return {
            ...d,
            ...updates,
            updatedAt: new Date().toISOString(),
            auditLogs: [audit, ...d.auditLogs],
          };
        });

        set({ drivers: updatedDrivers });
        get().addToast('Record Updated', 'Driver record saved successfully', 'info');
      },

      mergeDrivers: (primaryId, duplicateId) => {
        const { drivers, users, currentUserId } = get();
        const currentUser = users.find((u) => u.id === currentUserId);
        const primary = drivers.find((d) => d.id === primaryId);
        const duplicate = drivers.find((d) => d.id === duplicateId);
        if (!primary || !duplicate) return;

        const mergeAudit: AuditEvent = {
          id: `aud_${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: currentUser?.name || 'Recruiter',
          actorRole: currentUser?.role || 'Staff',
          action: 'Duplicate Merged',
          details: `Merged record for ${duplicate.firstName} ${duplicate.lastName} (${duplicate.id}) into ${primary.id}`,
        };

        const combinedDocs = [...primary.documents];
        duplicate.documents.forEach((doc) => {
          if (!combinedDocs.some((d) => d.type === doc.type)) {
            combinedDocs.push(doc);
          }
        });

        const combinedEmps = [...primary.employmentHistory];
        duplicate.employmentHistory.forEach((emp) => {
          if (!combinedEmps.some((e) => e.companyName.toLowerCase() === emp.companyName.toLowerCase())) {
            combinedEmps.push(emp);
          }
        });

        const combinedComms = [...duplicate.communications, ...primary.communications];

        const updatedPrimary: Driver = {
          ...primary,
          documents: combinedDocs,
          employmentHistory: combinedEmps,
          communications: combinedComms,
          auditLogs: [mergeAudit, ...primary.auditLogs],
          notes: `${primary.notes}\n[Merged Note]: ${duplicate.notes}`,
          updatedAt: new Date().toISOString(),
        };

        const remainingDrivers = drivers.filter((d) => d.id !== duplicateId).map((d) => (d.id === primaryId ? updatedPrimary : d));

        set({ drivers: remainingDrivers });
        get().addToast('Records Merged', `Successfully consolidated driver ${primary.firstName} ${primary.lastName}`, 'success');
      },

      addCommunication: (driverId, log) => {
        const { drivers, users, currentUserId } = get();
        const currentUser = users.find((u) => u.id === currentUserId);
        const newLog: CommunicationLog = {
          ...log,
          id: `com_${Date.now()}`,
          timestamp: new Date().toISOString(),
          author: log.author || currentUser?.name || 'Recruiter',
          authorRole: log.authorRole || currentUser?.role || 'Staff',
        };

        const audit: AuditEvent = {
          id: `aud_${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: currentUser?.name || 'Recruiter',
          actorRole: currentUser?.role || 'Staff',
          action: `Communication Logged (${log.type.replace('_', ' ')})`,
          details: log.summary,
        };

        const updatedDrivers = drivers.map((d) =>
          d.id === driverId
            ? {
                ...d,
                communications: [newLog, ...d.communications],
                auditLogs: [audit, ...d.auditLogs],
                updatedAt: new Date().toISOString(),
              }
            : d
        );

        set({ drivers: updatedDrivers });
        get().addToast('Communication Logged', `${log.type.toUpperCase()}: ${log.summary}`, 'success');
      },

      updateDriverDocument: (driverId, docId, updates) => {
        const { drivers, users, currentUserId } = get();
        const currentUser = users.find((u) => u.id === currentUserId);

        const updatedDrivers = drivers.map((driver) => {
          if (driver.id !== driverId) return driver;
          const updatedDocs = driver.documents.map((doc) => {
            if (doc.id !== docId) return doc;
            return {
              ...doc,
              ...updates,
              verifiedBy: updates.status === 'Approved' ? currentUser?.name : doc.verifiedBy,
              verifiedAt: updates.status === 'Approved' ? new Date().toISOString() : doc.verifiedAt,
            };
          });

          // Calculate new DQ readiness percentage
          const approvedCount = updatedDocs.filter((d) => d.status === 'Approved').length;
          const totalDocs = Math.max(1, updatedDocs.length);
          const newDq = Math.min(100, Math.round((approvedCount / totalDocs) * 100));

          const audit: AuditEvent = {
            id: `aud_${Date.now()}`,
            timestamp: new Date().toISOString(),
            actor: currentUser?.name || 'Staff',
            actorRole: currentUser?.role || 'Compliance',
            action: 'Document Status Changed',
            field: 'status',
            newValue: updates.status,
            details: `Updated document verification status`,
          };

          return {
            ...driver,
            documents: updatedDocs,
            dqReadinessPercentage: newDq,
            auditLogs: [audit, ...driver.auditLogs],
            updatedAt: new Date().toISOString(),
          };
        });

        set({ drivers: updatedDrivers });
        get().addToast('Document Updated', 'Compliance document verification recorded', 'info');
      },

      safetyApproveDriver: (driverId, approved, notes) => {
        const { drivers, users, currentUserId } = get();
        const currentUser = users.find((u) => u.id === currentUserId);
        const status = approved ? ('Approved' as const) : ('Rejected' as const);

        const audit: AuditEvent = {
          id: `aud_${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: currentUser?.name || 'Safety Manager',
          actorRole: currentUser?.role || 'Safety Manager',
          action: `Final DQ Safety Qualification: ${status}`,
          details: notes || (approved ? 'All DOT Part 391 qualification requirements met.' : 'Disqualified due to safety policy threshold.'),
        };

        const updatedDrivers = drivers.map((d) => {
          if (d.id !== driverId) return d;
          return {
            ...d,
            safetyApprovalStatus: status,
            safetyApprovedBy: currentUser?.name || 'Safety Manager',
            safetyApprovedAt: new Date().toISOString(),
            stage: (approved ? 'dq_ready' : 'rejected') as DriverPipelineStage,
            auditLogs: [audit, ...d.auditLogs],
            updatedAt: new Date().toISOString(),
          };
        });

        set({ drivers: updatedDrivers });
        get().addToast(
          approved ? 'Driver DQ Approved' : 'Driver Disqualified',
          `Safety Director final sign-off recorded for driver`,
          approved ? 'success' : 'warning'
        );
      },

      updateVoeEntry: (driverId, entryId, updates) => {
        const { drivers } = get();
        const updatedDrivers = drivers.map((driver) => {
          if (driver.id !== driverId) return driver;
          const updatedHistory = driver.employmentHistory.map((item) => {
            if (item.id !== entryId) return item;
            return { ...item, ...updates };
          });
          return { ...driver, employmentHistory: updatedHistory, updatedAt: new Date().toISOString() };
        });
        set({ drivers: updatedDrivers });
        get().addToast('VOE Record Updated', 'Employment verification details updated', 'info');
      },

      sendVoeRequest: (driverId, entryId, channel) => {
        const { drivers, users, currentUserId } = get();
        const currentUser = users.find((u) => u.id === currentUserId);
        const today = new Date().toISOString().split('T')[0];

        const updatedDrivers = drivers.map((driver) => {
          if (driver.id !== driverId) return driver;
          const updatedHistory = driver.employmentHistory.map((item) => {
            if (item.id !== entryId) return item;
            return {
              ...item,
              voeStatus: 'Sent' as const,
              voeSentDate: today,
              voeNotes: `Official VOE form dispatched via ${channel.toUpperCase()} to ${item.contactPerson || item.email}`,
            };
          });

          const audit: AuditEvent = {
            id: `aud_${Date.now()}`,
            timestamp: new Date().toISOString(),
            actor: currentUser?.name || 'Recruiter',
            actorRole: currentUser?.role || 'Staff',
            action: 'VOE Request Dispatched',
            details: `Sent 3-year DOT VOE inquiry via ${channel}`,
          };

          return {
            ...driver,
            employmentHistory: updatedHistory,
            auditLogs: [audit, ...driver.auditLogs],
            updatedAt: new Date().toISOString(),
          };
        });

        set({ drivers: updatedDrivers });
        get().addToast('VOE Dispatched', `Verification request sent via ${channel.toUpperCase()}`, 'success');
      },

      createOffer: (offerData) => {
        const newId = `ofr_${Date.now().toString().slice(-4)}`;
        const newOffer: ConditionalOfferLetter = {
          ...offerData,
          id: newId,
          version: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const { offers, drivers } = get();
        const updatedDrivers = drivers.map((d) =>
          d.id === offerData.driverId ? { ...d, conditionalOfferId: newId, stage: 'conditional_offer' as const } : d
        );

        set({ offers: [newOffer, ...offers], drivers: updatedDrivers });
        get().addToast('Offer Letter Generated', `Branded conditional offer drafted for ${offerData.driverName}`, 'success');
        return newId;
      },

      approveOffer: (offerId) => {
        const { offers, users, currentUserId } = get();
        const currentUser = users.find((u) => u.id === currentUserId);
        const updatedOffers = offers.map((o) =>
          o.id === offerId
            ? {
                ...o,
                approvalStatus: 'Approved by Manager' as const,
                approvedByManager: currentUser?.name || 'Recruiting Manager',
                managerApprovedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            : o
        );
        set({ offers: updatedOffers });
        get().addToast('Offer Approved', 'Manager authorization signed; offer is ready for delivery to candidate', 'success');
      },

      signOffer: (offerId, signatureText, signatureDataUrl) => {
        const { offers } = get();
        const updatedOffers = offers.map((o) =>
          o.id === offerId
            ? {
                ...o,
                approvalStatus: 'Signed by Driver' as const,
                driverSignature: {
                  signatureText,
                  signatureDataUrl,
                  signedAt: new Date().toISOString(),
                  ipAddress: '198.51.100.42 (TLS Verified)',
                },
                updatedAt: new Date().toISOString(),
              }
            : o
        );
        set({ offers: updatedOffers });
        get().addToast('Offer Signed', 'Driver digital e-signature and IP timestamp securely captured', 'success');
      },

      updateTenantBranding: (tenantId, updates) => {
        const { tenants } = get();
        const updatedTenants = tenants.map((t) => (t.id === tenantId ? { ...t, ...updates } : t));
        set({ tenants: updatedTenants });
        get().addToast('Branding Saved', 'Tenant colors and company profile updated across platform', 'success');
      },

      updateQuestions: (questions) => {
        set({ questions });
        get().addToast('Questionnaire Saved', 'Pre-qualification logic and knockout rules updated', 'success');
      },

      addPayTemplate: (template) => {
        const { payTemplates } = get();
        const newTemplate: PayStructureTemplate = {
          ...template,
          id: `pay_${Date.now().toString().slice(-4)}`,
        };
        set({ payTemplates: [newTemplate, ...payTemplates] });
        get().addToast('Pay Model Saved', `Added pay structure: ${template.title}`, 'success');
      },

      updatePayTemplate: (id, updates) => {
        const { payTemplates } = get();
        const updated = payTemplates.map((p) => (p.id === id ? { ...p, ...updates } : p));
        set({ payTemplates: updated });
        get().addToast('Pay Model Updated', 'Compensation parameters modified', 'info');
      },

      markNotificationAsRead: (notifId) => {
        const { notifications } = get();
        set({
          notifications: notifications.map((n) => (n.id === notifId ? { ...n, isRead: true } : n)),
        });
      },

      markAllNotificationsAsRead: () => {
        const { notifications } = get();
        set({
          notifications: notifications.map((n) => ({ ...n, isRead: true })),
        });
      },

      addToast: (title, message, type = 'info') => {
        const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
        set((state) => ({
          toasts: [...state.toasts, { id, title, message, type, timestamp: Date.now() }],
        }));
        setTimeout(() => {
          get().removeToast(id);
        }, 4200);
      },

      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      },

      resetDataToDefaults: () => {
        set({
          tenants: SEED_TENANTS,
          users: SEED_USERS,
          drivers: SEED_DRIVERS,
          campaigns: SEED_CAMPAIGNS,
          questions: SEED_QUESTIONS,
          payTemplates: SEED_PAY_TEMPLATES,
          offers: SEED_OFFERS,
          notifications: SEED_NOTIFICATIONS,
        });
        get().addToast('Demo Data Reset', 'Restored 60+ synthetic drivers and tenant records', 'info');
      },
    }),
    {
      name: 'rigready_saas_storage_v1',
    }
  )
);
