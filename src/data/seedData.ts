import {
  Tenant,
  User,
  Driver,
  DriverPipelineStage,
  PositionType,
  SourceCampaign,
  QuestionnaireQuestion,
  PayStructureTemplate,
  ConditionalOfferLetter,
  NotificationAlert,
} from '../types';

export const SEED_TENANTS: Tenant[] = [
  {
    id: 'tenant_apex',
    name: 'Apex Freightlines Inc.',
    dotNumber: '2849102',
    mcNumber: 'MC-94812',
    fleetSize: 185,
    primaryColor: '#0E7C7B',
    secondaryColor: '#2563EB',
    logoText: 'APEX',
    hqLocation: 'Dallas, TX',
    contactEmail: 'recruiting@apexfreight.com',
    contactPhone: '(214) 555-0190',
    operatingTypes: ['Dry Van OTR', 'Reefer Division', 'Regional Midwest', 'Dedicated Fleet'],
  },
  {
    id: 'tenant_blueridge',
    name: 'Blue Ridge Logistics LLC',
    dotNumber: '3192044',
    mcNumber: 'MC-10294',
    fleetSize: 94,
    primaryColor: '#2563EB',
    secondaryColor: '#0E7C7B',
    logoText: 'BLUE RIDGE',
    hqLocation: 'Roanoke, VA',
    contactEmail: 'safety@blueridgelogistics.com',
    contactPhone: '(540) 555-8821',
    operatingTypes: ['Flatbed Heavy Haul', 'Specialized Step Deck', 'Appalachian Regional'],
  },
];

export const SEED_USERS: User[] = [
  {
    id: 'usr_marcus',
    tenantId: 'tenant_apex',
    name: 'Marcus Vance',
    email: 'm.vance@apexfreight.com',
    role: 'Admin',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'VP of Transportation & Operations',
    phone: '(214) 555-0191',
  },
  {
    id: 'usr_sarah',
    tenantId: 'tenant_apex',
    name: 'Sarah Lin',
    email: 's.lin@apexfreight.com',
    role: 'Recruiting Manager',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'Director of Driver Recruiting',
    phone: '(214) 555-0192',
  },
  {
    id: 'usr_jamal',
    tenantId: 'tenant_apex',
    name: 'Jamal Davis',
    email: 'j.davis@apexfreight.com',
    role: 'Recruiter',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Senior Driver Recruiter',
    phone: '(214) 555-0193',
  },
  {
    id: 'usr_elena',
    tenantId: 'tenant_apex',
    name: 'Elena Rodriguez',
    email: 'e.rodriguez@apexfreight.com',
    role: 'Safety Manager',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    title: 'Safety & Compliance Director',
    phone: '(214) 555-0194',
  },
  {
    id: 'usr_david',
    tenantId: 'tenant_blueridge',
    name: 'David Henderson',
    email: 'd.henderson@blueridge.com',
    role: 'Recruiter',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: 'Talent Acquisition Partner',
    phone: '(540) 555-8822',
  },
  {
    id: 'usr_rachel',
    tenantId: 'tenant_blueridge',
    name: 'Rachel Ross',
    email: 'r.ross@blueridge.com',
    role: 'Safety Manager',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    title: 'Safety Manager & DOT Admin',
    phone: '(540) 555-8823',
  },
];

export const SEED_CAMPAIGNS: SourceCampaign[] = [
  {
    id: 'cmp_indeed_otr',
    tenantId: 'tenant_apex',
    name: 'Indeed OTR Solo & Team Sponsor',
    channel: 'Indeed',
    costPerMonth: 4800,
    leadsGenerated: 142,
    qualifiedCount: 88,
    hiresCount: 14,
    status: 'Active',
    startDate: '2026-01-10',
  },
  {
    id: 'cmp_truckers_rep',
    tenantId: 'tenant_apex',
    name: 'TruckersReport Top Banner Reefer',
    channel: 'TruckersReport',
    costPerMonth: 2400,
    leadsGenerated: 68,
    qualifiedCount: 46,
    hiresCount: 9,
    status: 'Active',
    startDate: '2026-02-01',
  },
  {
    id: 'cmp_fb_texas',
    tenantId: 'tenant_apex',
    name: 'Facebook Regional TX/OK Fast Track',
    channel: 'Facebook Lead Ads',
    costPerMonth: 1950,
    leadsGenerated: 94,
    qualifiedCount: 39,
    hiresCount: 6,
    status: 'Active',
    startDate: '2026-01-15',
  },
  {
    id: 'cmp_referral_prog',
    tenantId: 'tenant_apex',
    name: 'Apex Ambassador $2,500 Referral Program',
    channel: 'Driver Referral',
    costPerMonth: 1250,
    leadsGenerated: 32,
    qualifiedCount: 28,
    hiresCount: 11,
    status: 'Active',
    startDate: '2025-11-01',
  },
  {
    id: 'cmp_zip_va',
    tenantId: 'tenant_blueridge',
    name: 'ZipRecruiter Mid-Atlantic Flatbed',
    channel: 'ZipRecruiter',
    costPerMonth: 2200,
    leadsGenerated: 54,
    qualifiedCount: 31,
    hiresCount: 7,
    status: 'Active',
    startDate: '2026-01-05',
  },
  {
    id: 'cmp_br_ref',
    tenantId: 'tenant_blueridge',
    name: 'Blue Ridge Heavy Haul Referral Club',
    channel: 'Driver Referral',
    costPerMonth: 800,
    leadsGenerated: 19,
    qualifiedCount: 16,
    hiresCount: 5,
    status: 'Active',
    startDate: '2025-12-01',
  },
];

export const SEED_QUESTIONS: QuestionnaireQuestion[] = [
  {
    id: 'q_cdl_class',
    label: 'Do you hold a valid, unexpired Commercial Driver License (CDL)?',
    description: 'Must hold a state-issued Class A or B CDL in good standing.',
    type: 'select',
    options: ['Class A CDL', 'Class B CDL', 'Class C CDL', 'Commercial Learner Permit (CLP)', 'No CDL'],
    required: true,
    positionApplicability: ['CDL-A', 'CDL-B'],
    rules: [
      {
        field: 'q_cdl_class',
        operator: 'in',
        value: 'Class A CDL',
        action: 'show_question',
      },
      {
        field: 'q_cdl_class',
        operator: 'in',
        value: 'No CDL',
        action: 'knockout',
        knockoutReason: 'Commercial driver positions require a valid CDL license.',
      },
    ],
  },
  {
    id: 'q_exp_years',
    label: 'How many years of verifiable tractor-trailer (Class A) driving experience do you have?',
    description: 'Verifiable under FMCSA Part 391 over the past 3-10 years.',
    type: 'number',
    required: true,
    positionApplicability: ['CDL-A'],
    rules: [
      {
        field: 'q_exp_years',
        operator: 'less_than',
        value: 1,
        action: 'knockout',
        knockoutReason: 'Apex Freightlines requires at least 12 months of verifiable Class A experience.',
      },
      {
        field: 'q_exp_years',
        operator: 'less_than',
        value: 2,
        action: 'flag_review',
        knockoutReason: '1 to 2 years experience requires Recruiting Manager secondary review.',
      },
    ],
  },
  {
    id: 'q_moving_violations',
    label: 'How many moving violations or citations have you received in the past 36 months?',
    type: 'number',
    required: true,
    positionApplicability: ['CDL-A', 'CDL-B', 'CDL-C', 'Non-CDL'],
    rules: [
      {
        field: 'q_moving_violations',
        operator: 'greater_than',
        value: 2,
        action: 'knockout',
        knockoutReason: 'DOT hiring guidelines restrict hiring drivers with more than 2 moving violations in 3 years.',
      },
    ],
  },
  {
    id: 'q_dot_accidents',
    label: 'Have you been involved in any DOT recordable accidents (tow-away, fatality, injury) in the last 3 years?',
    type: 'yes_no',
    required: true,
    positionApplicability: ['CDL-A', 'CDL-B'],
    rules: [
      {
        field: 'q_dot_accidents',
        operator: 'equals',
        value: true,
        action: 'flag_review',
        knockoutReason: 'Accident record requires Safety Director manual review of police report and MVR.',
      },
    ],
  },
  {
    id: 'q_clearinghouse',
    label: 'Are you registered in the FMCSA Drug & Alcohol Clearinghouse with a clean querying status?',
    type: 'yes_no',
    required: true,
    positionApplicability: ['CDL-A', 'CDL-B', 'CDL-C'],
    rules: [
      {
        field: 'q_clearinghouse',
        operator: 'equals',
        value: false,
        action: 'knockout',
        knockoutReason: 'All drivers must have a clear status or completed Return-to-Duty protocol.',
      },
    ],
  },
  {
    id: 'q_endorsements',
    label: 'Select all active endorsements currently on your commercial license:',
    type: 'multi_select',
    options: ['Tanker (N)', 'Hazmat (H)', 'Doubles & Triples (T)', 'Passenger (P)', 'School Bus (S)'],
    required: false,
    positionApplicability: ['CDL-A', 'CDL-B'],
    rules: [],
  },
];

export const SEED_PAY_TEMPLATES: PayStructureTemplate[] = [
  {
    id: 'pay_otr_van_cpm',
    tenantId: 'tenant_apex',
    title: 'OTR Solo Dry Van - Mileage Base',
    position: 'OTR Solo',
    payType: 'CPM',
    baseRateDisplay: '$0.64 / practical mile',
    baseRateValue: 0.64,
    detentionPay: '$25/hr after 2 hours waiting',
    layoverPay: '$120/day standby',
    breakdownPay: '$100/day + lodging covered',
    bonuses: [
      '$0.04/mi Monthly Safety & Performance Bonus (clean inspection & zero claims)',
      '$0.02/mi Fuel Efficiency Incentive (>= 7.2 MPG)',
      '$2,500 Driver Referral Bonus upon 90 days retention',
    ],
    benefits: [
      'Blue Cross Blue Shield Health, Dental & Vision after 30 days',
      '401(k) with 4% company match vesting day 90',
      'Paid time off: 1 week after 1 year, 2 weeks after 2 years',
      'Company-provided SiriusXM & Peoplenet cab amenities',
    ],
    effectiveDate: '2026-01-01',
    status: 'Approved',
    approvedBy: 'Sarah Lin',
  },
  {
    id: 'pay_reefer_cpm',
    tenantId: 'tenant_apex',
    title: 'Reefer Division Premium - Practical Miles',
    position: 'Reefer Division',
    payType: 'CPM',
    baseRateDisplay: '$0.69 / practical mile',
    baseRateValue: 0.69,
    detentionPay: '$28/hr after 2 hours waiting',
    layoverPay: '$140/day standby',
    breakdownPay: '$120/day + lodging covered',
    bonuses: [
      '$0.05/mi Monthly Reefer Maintenance & Monitoring Bonus',
      '$1,500 Sign-on Bonus paid in 3 installments',
    ],
    benefits: [
      'Comprehensive Medical, Dental, Vision & Life Insurance',
      '401(k) with 4% match',
      'New Freightliner Cascadia 2025/2026 with APU & inverter',
    ],
    effectiveDate: '2026-01-01',
    status: 'Approved',
    approvedBy: 'Marcus Vance',
  },
  {
    id: 'pay_regional_hourly',
    tenantId: 'tenant_apex',
    title: 'Regional Dedicated - Hourly + Home Weekly',
    position: 'Regional Dry Van',
    payType: 'Hourly',
    baseRateDisplay: '$29.50 / hour',
    baseRateValue: 29.50,
    detentionPay: '$29.50/hr on-duty not driving',
    layoverPay: '$150/night',
    breakdownPay: 'Full hourly rate for all on-duty breakdown hours',
    bonuses: ['$1,000 Quarterly On-Time Guarantee bonus'],
    benefits: ['Full health & 401(k) package', 'Home every Friday night through Sunday'],
    effectiveDate: '2026-02-01',
    status: 'Approved',
    approvedBy: 'Sarah Lin',
  },
  {
    id: 'pay_br_flatbed_pct',
    tenantId: 'tenant_blueridge',
    title: 'Specialized Flatbed - Gross Revenue Share',
    position: 'Flatbed Specialized',
    payType: 'Percentage',
    baseRateDisplay: '28% of gross linehaul load revenue',
    baseRateValue: 0.28,
    detentionPay: '$35/hr after 2 hours customer delay',
    layoverPay: '$160/day standby',
    breakdownPay: '$150/day hotel allowance',
    bonuses: [
      '$50 per heavy tarp load',
      '$75 per over-dimensional secured transport load',
      '$3,000 Master Rigger retention anniversary bonus',
    ],
    benefits: [
      'UnitedHealthcare Gold Tier',
      '100% Paid STD/LTD Disability',
      'Assigned Kenworth W990 / Peterbilt 579',
    ],
    effectiveDate: '2026-01-15',
    status: 'Approved',
    approvedBy: 'Rachel Ross',
  },
];

// Helper to build 60+ synthetic drivers
const FIRST_NAMES = [
  'Michael', 'James', 'Robert', 'David', 'William', 'Carlos', 'Christopher', 'Daniel', 'Marcus', 'Tyrone',
  'Matthew', 'Anthony', 'Travis', 'Dustin', 'Cody', 'Derrick', 'Brandon', 'Jose', 'Kevin', 'Jason',
  'Eduardo', 'DeAndre', 'Austin', 'Jesse', 'Kenneth', 'Ronald', 'Timothy', 'Brian', 'Jeffrey', 'Gary',
  'Scott', 'Eric', 'Stephen', 'Larry', 'Frank', 'Raymond', 'Gregory', 'Joshua', 'Jerry', 'Dennis',
  'Walter', 'Patrick', 'Peter', 'Harold', 'Douglas', 'Henry', 'Carl', 'Arthur', 'Ryan', 'Roger',
  'Joe', 'Juan', 'Jack', 'Albert', 'Jonathan', 'Justin', 'Terry', 'Gerald', 'Keith', 'Samuel',
];

const LAST_NAMES = [
  'Miller', 'Johnson', 'Smith', 'Williams', 'Brown', 'Jones', 'Garcia', 'Martinez', 'Rodriguez', 'Davis',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
  'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes',
];

const STATES = ['TX', 'OH', 'PA', 'GA', 'FL', 'NC', 'IL', 'IN', 'TN', 'MI', 'MO', 'VA', 'SC', 'KY', 'AL'];
const CITIES: Record<string, string[]> = {
  TX: ['Fort Worth', 'Houston', 'San Antonio', 'Arlington', 'El Paso'],
  OH: ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron'],
  PA: ['Allentown', 'Harrisburg', 'Scranton', 'Pittsburgh', 'York'],
  GA: ['Atlanta', 'Savannah', 'Augusta', 'Macon', 'Columbus'],
  FL: ['Jacksonville', 'Tampa', 'Orlando', 'Ocala', 'Lakeland'],
  NC: ['Charlotte', 'Raleigh', 'Greensboro', 'Winston-Salem', 'Fayetteville'],
  IL: ['Joliet', 'Peoria', 'Rockford', 'Elgin', 'Naperville'],
  IN: ['Indianapolis', 'Fort Wayne', 'South Bend', 'Evansville', 'Gary'],
  TN: ['Memphis', 'Nashville', 'Knoxville', 'Chattanooga', 'Clarksville'],
  MI: ['Detroit', 'Grand Rapids', 'Flint', 'Lansing', 'Kalamazoo'],
  MO: ['Kansas City', 'St. Louis', 'Springfield', 'Joplin', 'Columbia'],
  VA: ['Roanoke', 'Richmond', 'Norfolk', 'Lynchburg', 'Harrisonburg'],
  SC: ['Greenville', 'Columbia', 'Charleston', 'Spartanburg', 'Florence'],
  KY: ['Louisville', 'Lexington', 'Bowling Green', 'Owensboro', 'Covington'],
  AL: ['Birmingham', 'Huntsville', 'Mobile', 'Montgomery', 'Tuscaloosa'],
};

const STAGES: DriverPipelineStage[] = [
  'new_lead',
  'contacted',
  'pre_qualified',
  'application_submitted',
  'documents_review',
  'voe_in_progress',
  'conditional_offer',
  'orientation_scheduled',
  'dq_ready',
  'rejected',
];

const POSITIONS: PositionType[] = [
  'OTR Solo',
  'OTR Team',
  'Regional Dry Van',
  'Reefer Division',
  'Dedicated Fleet',
  'Flatbed Specialized',
];

export function generateSeedDrivers(): Driver[] {
  const drivers: Driver[] = [];

  for (let i = 0; i < 64; i++) {
    const isApex = i < 46;
    const tenantId = isApex ? 'tenant_apex' : 'tenant_blueridge';
    const recruiterId = isApex
      ? i % 2 === 0
        ? 'usr_jamal'
        : 'usr_sarah'
      : 'usr_david';

    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName = LAST_NAMES[i % LAST_NAMES.length];
    const state = STATES[i % STATES.length];
    const citiesInState = CITIES[state] || ['Springfield'];
    const city = citiesInState[i % citiesInState.length];

    // Distribute stages realistically
    const stage = STAGES[i % STAGES.length];
    const position = isApex
      ? POSITIONS[i % 5]
      : 'Flatbed Specialized';

    const cdlClass: Driver['cdlClass'] = i % 12 === 0 ? 'Class B' : 'Class A';
    const experienceYears = Math.floor(2 + (i % 18));
    const leadScore = Math.min(99, Math.max(48, 88 - (i % 7) * 4 + (experienceYears > 5 ? 12 : 0)));

    const cdlNum = `${state}${100234 + i * 37}`;
    const dobYear = 1972 + (i % 25);
    const dob = `${dobYear}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`;

    // Expiration dates
    const medDaysOffset = (i % 3 === 0) ? -12 : (i * 25) % 360;
    const medExpiry = new Date(2026, 9, 15 + medDaysOffset).toISOString().split('T')[0];

    const cdlDaysOffset = (i * 70) % 700 + 40;
    const cdlExpiry = new Date(2026, 9, 15 + cdlDaysOffset).toISOString().split('T')[0];

    const qualificationStatus: Driver['qualificationStatus'] =
      stage === 'rejected'
        ? 'Not Qualified'
        : i % 7 === 0
        ? 'Review Required'
        : 'Qualified';

    let dqPercentage = 20;
    if (stage === 'pre_qualified') dqPercentage = 45;
    if (stage === 'application_submitted') dqPercentage = 60;
    if (stage === 'documents_review') dqPercentage = 75;
    if (stage === 'voe_in_progress') dqPercentage = 85;
    if (stage === 'conditional_offer') dqPercentage = 90;
    if (stage === 'orientation_scheduled') dqPercentage = 95;
    if (stage === 'dq_ready') dqPercentage = 100;

    const safetyApproval: Driver['safetyApprovalStatus'] =
      stage === 'dq_ready'
        ? 'Approved'
        : stage === 'orientation_scheduled'
        ? 'Conditional'
        : 'Pending Review';

    // Endorsements
    const endorsements: string[] = [];
    if (i % 2 === 0) endorsements.push('Tanker (N)');
    if (i % 3 === 0) endorsements.push('Doubles/Triples (T)');
    if (i % 5 === 0) endorsements.push('Hazmat (H)');

    const restrictions: string[] = [];
    if (i % 4 === 0) restrictions.push('Corrective Lenses (B)');
    if (i % 15 === 0) restrictions.push('No Manual Transmission (E)');

    const source = i % 4 === 0 ? 'Indeed' : i % 4 === 1 ? 'TruckersReport' : i % 4 === 2 ? 'Driver Referral' : 'Facebook Lead Ads';
    const referredBy = source === 'Driver Referral' ? (i % 2 === 0 ? 'Marcus Reynolds (Truck #204)' : 'James Sterling (Truck #119)') : undefined;

    const driverId = `drv_${1000 + i}`;

    const driver: Driver = {
      id: driverId,
      tenantId,
      assignedRecruiterId: recruiterId,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@emaildriver.net`,
      phone: `(${300 + (i % 600)}) 555-${String(1000 + i * 13).slice(-4)}`,
      dateOfBirth: dob,
      city,
      state,
      zip: String(75000 + i * 110),
      cdlNumber: cdlNum,
      cdlState: state,
      cdlClass,
      cdlExpiration: cdlExpiry,
      endorsements,
      restrictions,
      medCardExpiration: medExpiry,
      totalExperienceYears: experienceYears,
      stage,
      targetPosition: position,
      source,
      referredBy,
      leadScore,
      qualificationStatus,
      dqReadinessPercentage: dqPercentage,
      safetyApprovalStatus: safetyApproval,
      safetyApprovedBy: safetyApproval === 'Approved' ? (isApex ? 'Elena Rodriguez' : 'Rachel Ross') : undefined,
      safetyApprovedAt: safetyApproval === 'Approved' ? '2026-10-10T14:30:00Z' : undefined,
      conditionalOfferId: ['conditional_offer', 'orientation_scheduled', 'dq_ready'].includes(stage) ? `ofr_${1000 + i}` : undefined,
      createdAt: new Date(2026, 8, 1 + (i % 40)).toISOString(),
      updatedAt: new Date(2026, 9, 10 + (i % 4)).toISOString(),
      accidentsCount: i % 9 === 0 ? 1 : 0,
      movingViolationsCount: i % 7 === 0 ? 1 : 0,
      applicationToken: `tok_${Math.random().toString(36).substring(2, 10)}`,
      applicationCompleted: !['new_lead', 'contacted', 'pre_qualified'].includes(stage),
      applicationCompletedAt: !['new_lead', 'contacted', 'pre_qualified'].includes(stage) ? '2026-10-04T11:20:00Z' : undefined,
      notes: `Driver with ${experienceYears} yrs experience. Familiar with Reefer & Dry Van. Clean record verified.`,
      documents: [
        {
          id: `doc_${driverId}_cdl_f`,
          type: 'CDL Front',
          fileName: `${lastName}_CDL_Front.jpg`,
          fileSize: '2.4 MB',
          uploadedAt: '2026-10-02T09:15:00Z',
          expiresAt: cdlExpiry,
          status: stage === 'new_lead' ? 'Missing' : 'Approved',
          verifiedBy: 'Sarah Lin',
          verifiedAt: '2026-10-02T10:00:00Z',
          ocrExtracted: {
            cdlNumber: { value: cdlNum, confidence: 0.98 },
            state: { value: state, confidence: 0.99 },
            name: { value: `${firstName} ${lastName}`.toUpperCase(), confidence: 0.96 },
            dob: { value: dob, confidence: 0.95 },
            cdlClass: { value: cdlClass, confidence: 0.97 },
            expiration: { value: cdlExpiry, confidence: 0.99 },
          },
        },
        {
          id: `doc_${driverId}_med`,
          type: 'Medical Card',
          fileName: `${lastName}_DOT_Medical_Card.pdf`,
          fileSize: '1.1 MB',
          uploadedAt: '2026-10-03T11:00:00Z',
          expiresAt: medExpiry,
          status: medDaysOffset < 0 ? 'Expired' : stage === 'new_lead' ? 'Missing' : 'Approved',
          verifiedBy: 'Elena Rodriguez',
          verifiedAt: '2026-10-03T14:20:00Z',
        },
        {
          id: `doc_${driverId}_mvr`,
          type: 'MVR Report',
          fileName: `${lastName}_State_MVR_3yr.pdf`,
          fileSize: '840 KB',
          uploadedAt: '2026-10-04T08:30:00Z',
          status: ['new_lead', 'contacted'].includes(stage) ? 'Requested' : 'Approved',
          verifiedBy: 'Elena Rodriguez',
        },
        {
          id: `doc_${driverId}_drug`,
          type: 'Drug Screen Result',
          fileName: `${lastName}_Quest_PreEmp_UDS.pdf`,
          fileSize: '512 KB',
          uploadedAt: '2026-10-06T16:00:00Z',
          status: ['conditional_offer', 'orientation_scheduled', 'dq_ready'].includes(stage) ? 'Approved' : 'Pending',
        },
        {
          id: `doc_${driverId}_psp`,
          type: 'PSP Record',
          fileName: `${lastName}_FMCSA_PSP_History.pdf`,
          fileSize: '620 KB',
          uploadedAt: '2026-10-04T09:00:00Z',
          status: 'Approved',
        },
      ],
      employmentHistory: [
        {
          id: `emp_${driverId}_1`,
          companyName: 'Heartland Express Carrier',
          contactPerson: 'Barbara Miller',
          phone: '(319) 555-4011',
          email: 'voe@heartlandexpress.mock',
          startDate: '2023-04-01',
          endDate: '2026-08-30',
          reasonForLeaving: 'Looking for regional routes closer to home',
          equipmentOperated: 'Freightliner Cascadia 53ft Dry Van',
          hadAccidents: false,
          fmcsrSubject: true,
          dotSafetySensitive: true,
          voeStatus: ['voe_in_progress', 'conditional_offer', 'orientation_scheduled', 'dq_ready'].includes(stage)
            ? 'Received'
            : 'Sent',
          voeSentDate: '2026-10-02',
          voeReceivedDate: ['voe_in_progress', 'conditional_offer', 'orientation_scheduled', 'dq_ready'].includes(stage)
            ? '2026-10-05'
            : undefined,
          voeNotes: 'Verbal VOE confirmed by Barbara. Positive safety marks, eligible for rehire.',
        },
        {
          id: `emp_${driverId}_2`,
          companyName: 'Swift Transportation',
          contactPerson: 'HR Verification Desk',
          phone: '(800) 555-9000',
          email: 'swift.voe@tenstreet.mock',
          startDate: '2020-01-15',
          endDate: '2023-03-20',
          reasonForLeaving: 'Pay increase & route change',
          equipmentOperated: 'Volvo VNL 760 Reefer',
          hadAccidents: false,
          fmcsrSubject: true,
          dotSafetySensitive: true,
          voeStatus: 'Received',
          voeSentDate: '2026-10-02',
          voeReceivedDate: '2026-10-04',
        },
      ],
      communications: [
        {
          id: `com_${driverId}_1`,
          timestamp: '2026-10-02T10:14:00Z',
          type: 'outbound_call',
          author: recruiterId === 'usr_jamal' ? 'Jamal Davis' : 'Sarah Lin',
          authorRole: 'Recruiter',
          summary: 'Initial phone screen & interest confirmation',
          details: 'Discussed home time requirements (every other weekend). Driver has 53ft dry van experience. Very interested in our dedicated routes.',
          outcome: 'Connected',
          followUpDate: '2026-10-04',
        },
        {
          id: `com_${driverId}_2`,
          timestamp: '2026-10-03T14:45:00Z',
          type: 'sms',
          author: 'System',
          authorRole: 'Automated Service',
          summary: 'Application wizard link sent via SMS',
          details: `Sent secure link: https://rigready.applet.internal/apply/${driverId}`,
          outcome: 'Sent Application',
        },
      ],
      auditLogs: [
        {
          id: `aud_${driverId}_1`,
          timestamp: '2026-10-01T08:00:00Z',
          actor: 'System',
          actorRole: 'Inbound Hook',
          action: 'Driver Created',
          details: `Lead imported from ${source}`,
        },
        {
          id: `aud_${driverId}_2`,
          timestamp: '2026-10-02T10:20:00Z',
          actor: recruiterId === 'usr_jamal' ? 'Jamal Davis' : 'Sarah Lin',
          actorRole: 'Recruiter',
          action: 'Pipeline Advanced',
          field: 'stage',
          oldValue: 'new_lead',
          newValue: stage,
          details: `Moved candidate to ${stage}`,
        },
      ],
    };

    drivers.push(driver);
  }

  return drivers;
}

export const SEED_DRIVERS: Driver[] = generateSeedDrivers();

export const SEED_OFFERS: ConditionalOfferLetter[] = [
  {
    id: 'ofr_1006',
    tenantId: 'tenant_apex',
    driverId: 'drv_1006',
    driverName: 'Christopher Martinez',
    position: 'OTR Solo',
    payTemplateId: 'pay_otr_van_cpm',
    paySummary: '$0.64 / practical mile + $25/hr detention after 2 hours',
    bonusesSummary: '$0.04/mi Safety Bonus + $2,500 Referral Program eligible',
    benefitsSummary: 'BCBS Health/Dental/Vision + 401(k) 4% match from day 90',
    proposedStartDate: '2026-10-26',
    orientationLocation: 'Apex Terminal Dallas, 4800 Logistics Way, Dallas TX 75247',
    approvalStatus: 'Approved by Manager',
    approvedByManager: 'Sarah Lin',
    managerApprovedAt: '2026-10-08T15:20:00Z',
    version: 1,
    createdAt: '2026-10-08T11:00:00Z',
    updatedAt: '2026-10-08T15:20:00Z',
  },
  {
    id: 'ofr_1016',
    tenantId: 'tenant_apex',
    driverId: 'drv_1016',
    driverName: 'Brandon Hernandez',
    position: 'Reefer Division',
    payTemplateId: 'pay_reefer_cpm',
    paySummary: '$0.69 / practical mile + $28/hr detention after 2 hours',
    bonusesSummary: '$0.05/mi Reefer Monitoring + $1,500 Sign-on Bonus',
    benefitsSummary: 'Full Health, Vision, Dental & 401(k) + 2026 Cascadia with APU',
    proposedStartDate: '2026-11-02',
    orientationLocation: 'Apex Terminal Dallas, 4800 Logistics Way, Dallas TX 75247',
    approvalStatus: 'Pending Manager Approval',
    version: 1,
    createdAt: '2026-10-11T09:40:00Z',
    updatedAt: '2026-10-11T09:40:00Z',
  },
  {
    id: 'ofr_1048',
    tenantId: 'tenant_blueridge',
    driverId: 'drv_1048',
    driverName: 'Ryan Roberts',
    position: 'Flatbed Specialized',
    payTemplateId: 'pay_br_flatbed_pct',
    paySummary: '28% of gross linehaul load revenue + $35/hr detention',
    bonusesSummary: '$50/tarp load + $75 over-dim transport + $3,000 Master Rigger',
    benefitsSummary: 'UHC Gold Tier Medical + Kenworth W990 assigned rig',
    proposedStartDate: '2026-10-28',
    orientationLocation: 'Blue Ridge Terminal, 120 Mountain Vista Hwy, Roanoke VA 24018',
    approvalStatus: 'Sent to Driver',
    approvedByManager: 'Rachel Ross',
    managerApprovedAt: '2026-10-09T16:00:00Z',
    version: 1,
    createdAt: '2026-10-09T10:30:00Z',
    updatedAt: '2026-10-09T16:00:00Z',
  },
];

export const SEED_NOTIFICATIONS: NotificationAlert[] = [
  {
    id: 'notif_1',
    tenantId: 'tenant_apex',
    type: 'dq_expiration',
    title: 'DOT Medical Card Expired',
    message: 'Driver Michael Miller (#drv_1000) medical card expired on Oct 3, 2026.',
    driverId: 'drv_1000',
    timestamp: '2026-10-12T08:15:00Z',
    isRead: false,
    severity: 'high',
  },
  {
    id: 'notif_2',
    tenantId: 'tenant_apex',
    type: 'voe_overdue',
    title: 'Verification of Employment Overdue',
    message: 'Heartland Express Carrier has not replied to VOE for Anthony Davis (#drv_1011) after 7 days.',
    driverId: 'drv_1011',
    timestamp: '2026-10-12T11:00:00Z',
    isRead: false,
    severity: 'medium',
  },
  {
    id: 'notif_3',
    tenantId: 'tenant_apex',
    type: 'new_application',
    title: 'Full Application Submitted',
    message: 'Candidate Cody Jackson completed the mobile 10-year DOT application wizard.',
    driverId: 'drv_1014',
    timestamp: '2026-10-12T14:40:00Z',
    isRead: false,
    severity: 'low',
  },
  {
    id: 'notif_4',
    tenantId: 'tenant_apex',
    type: 'offer_action',
    title: 'Conditional Offer Ready for Approval',
    message: 'Offer letter for Brandon Hernandez (#drv_1016) awaits Recruiting Manager signature.',
    driverId: 'drv_1016',
    timestamp: '2026-10-13T07:20:00Z',
    isRead: false,
    severity: 'high',
  },
  {
    id: 'notif_5',
    tenantId: 'tenant_blueridge',
    type: 'dq_expiration',
    title: 'Annual MVR Review Due',
    message: 'Annual MVR query required for 4 active drivers within 14 days.',
    timestamp: '2026-10-11T09:00:00Z',
    isRead: false,
    severity: 'medium',
  },
];
