export type TenantId = 'tenant_apex' | 'tenant_blueridge';

export type UserRole = 'Admin' | 'Recruiting Manager' | 'Recruiter' | 'Safety Manager' | 'Viewer';

export interface User {
  id: string;
  tenantId: TenantId;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  title: string;
  phone: string;
}

export interface Tenant {
  id: TenantId;
  name: string;
  dotNumber: string;
  mcNumber: string;
  fleetSize: number;
  primaryColor: string; // Hex
  secondaryColor: string;
  logoText: string;
  hqLocation: string;
  contactEmail: string;
  contactPhone: string;
  operatingTypes: string[];
}

export type DriverPipelineStage =
  | 'new_lead'
  | 'contacted'
  | 'pre_qualified'
  | 'application_submitted'
  | 'documents_review'
  | 'voe_in_progress'
  | 'conditional_offer'
  | 'orientation_scheduled'
  | 'dq_ready'
  | 'rejected';

export type CdlClass = 'Class A' | 'Class B' | 'Class C' | 'Non-CDL';

export type PositionType = 'OTR Solo' | 'OTR Team' | 'Regional Dry Van' | 'Reefer Division' | 'Dedicated Fleet' | 'Flatbed Specialized';

export interface DriverDocument {
  id: string;
  type: 'CDL Front' | 'CDL Back' | 'Medical Card' | 'MVR Report' | 'PSP Record' | 'Drug Screen Result' | 'Clearinghouse Consent' | 'Road Test Certificate' | 'W-4' | 'Direct Deposit';
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  expiresAt?: string;
  status: 'Missing' | 'Requested' | 'Pending' | 'Received' | 'Under Review' | 'Approved' | 'Rejected' | 'Expired';
  ocrExtracted?: Record<string, { value: string; confidence: number; discrepancy?: boolean }>;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
  downloadUrl?: string;
}

export interface EmploymentHistoryEntry {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  startDate: string;
  endDate: string;
  reasonForLeaving: string;
  equipmentOperated: string;
  hadAccidents: boolean;
  fmcsrSubject: boolean;
  dotSafetySensitive: boolean;
  voeStatus: 'Not Sent' | 'Sent' | 'Viewed' | 'Pending' | 'Received' | 'Overdue' | 'Escalated';
  voeSentDate?: string;
  voeReceivedDate?: string;
  voeNotes?: string;
}

export interface CommunicationLog {
  id: string;
  timestamp: string;
  type: 'inbound_call' | 'outbound_call' | 'sms' | 'email' | 'internal_note' | 'system_event';
  author: string;
  authorRole: string;
  summary: string;
  details?: string;
  outcome?: 'Connected' | 'Left Voicemail' | 'No Answer' | 'Scheduled Follow-up' | 'Sent Application';
  followUpDate?: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
  details: string;
}

export interface Driver {
  id: string;
  tenantId: TenantId;
  assignedRecruiterId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  city: string;
  state: string;
  zip: string;
  cdlNumber: string;
  cdlState: string;
  cdlClass: CdlClass;
  cdlExpiration: string;
  endorsements: string[]; // e.g. ['Tanker (N)', 'Hazmat (H)', 'Doubles/Triples (T)']
  restrictions: string[]; // e.g. ['Corrective Lenses (B)', 'No Manual Trans (E)']
  medCardExpiration: string;
  totalExperienceYears: number;
  stage: DriverPipelineStage;
  targetPosition: PositionType;
  source: string;
  sourceCampaign?: string;
  referredBy?: string; // Driver or staff name
  leadScore: number; // 1-100
  qualificationStatus: 'Qualified' | 'Review Required' | 'Not Qualified';
  dqReadinessPercentage: number;
  safetyApprovalStatus: 'Pending Review' | 'Approved' | 'Conditional' | 'Rejected';
  safetyApprovedBy?: string;
  safetyApprovedAt?: string;
  conditionalOfferId?: string;
  createdAt: string;
  updatedAt: string;
  documents: DriverDocument[];
  employmentHistory: EmploymentHistoryEntry[];
  communications: CommunicationLog[];
  auditLogs: AuditEvent[];
  applicationToken: string;
  applicationCompleted: boolean;
  applicationCompletedAt?: string;
  accidentsCount: number;
  movingViolationsCount: number;
  notes: string;
}

export interface SourceCampaign {
  id: string;
  tenantId: TenantId;
  name: string;
  channel: 'Indeed' | 'TruckersReport' | 'Facebook Lead Ads' | 'ZipRecruiter' | 'Driver Referral' | 'Organic Search' | 'Direct Inbound';
  costPerMonth: number;
  leadsGenerated: number;
  qualifiedCount: number;
  hiresCount: number;
  status: 'Active' | 'Paused' | 'Archived';
  startDate: string;
}

export interface QuestionRule {
  field: string;
  operator: 'equals' | 'greater_than' | 'less_than' | 'in';
  value: string | number | boolean;
  action: 'knockout' | 'flag_review' | 'show_question';
  knockoutReason?: string;
}

export interface QuestionnaireQuestion {
  id: string;
  label: string;
  description?: string;
  type: 'yes_no' | 'number' | 'select' | 'multi_select' | 'date';
  options?: string[];
  required: boolean;
  rules: QuestionRule[];
  positionApplicability: ('CDL-A' | 'CDL-B' | 'CDL-C' | 'Non-CDL')[];
}

export interface PayStructureTemplate {
  id: string;
  tenantId: TenantId;
  title: string;
  position: PositionType;
  payType: 'CPM' | 'Hourly' | 'Salary' | 'Percentage' | 'Per-Load' | 'Daily';
  baseRateDisplay: string;
  baseRateValue: number;
  detentionPay: string;
  layoverPay: string;
  breakdownPay: string;
  bonuses: string[];
  benefits: string[];
  effectiveDate: string;
  status: 'Approved' | 'Draft' | 'Archived';
  approvedBy: string;
}

export interface ConditionalOfferLetter {
  id: string;
  tenantId: TenantId;
  driverId: string;
  driverName: string;
  position: PositionType;
  payTemplateId: string;
  paySummary: string;
  bonusesSummary: string;
  benefitsSummary: string;
  proposedStartDate: string;
  orientationLocation: string;
  approvalStatus: 'Draft' | 'Pending Manager Approval' | 'Approved by Manager' | 'Sent to Driver' | 'Signed by Driver' | 'Declined';
  approvedByManager?: string;
  managerApprovedAt?: string;
  driverSignature?: {
    signatureText: string;
    signatureDataUrl?: string;
    signedAt: string;
    ipAddress: string;
  };
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationAlert {
  id: string;
  tenantId: TenantId;
  type: 'dq_expiration' | 'voe_overdue' | 'new_application' | 'offer_action' | 'duplicate_warning';
  title: string;
  message: string;
  driverId?: string;
  timestamp: string;
  isRead: boolean;
  severity: 'low' | 'medium' | 'high';
}
