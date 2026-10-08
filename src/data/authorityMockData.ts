import {
  AuthorityUser,
  AuthorityIssue,
  AuthorityNotification,
  AuthorityAnalyticsSummary
} from '../types/authority';

/**
 * MOCK AUTHORITY DATA STORE
 * 
 * IMPORTANT ARCHITECTURAL NOTE:
 * This file isolates frontend demo data. In production, this layer is replaced
 * by the real REST API endpoints:
 * - GET /api/authority/issues
 * - GET /api/authority/me
 * - GET /api/authority/analytics
 * 
 * No sensitive backend secrets or real database authentication are stored here.
 */

export const MOCK_OFFICER_USER: AuthorityUser = {
  authorityId: 'AUTH-PWD-4402',
  name: 'Vikramaditya Rathore',
  email: 'v.rathore@pwd.gov.in',
  phone: '+91 98260 41102',
  department: 'Public Works Department (PWD)',
  designation: 'Senior Executive Engineer (Roads & Bridges)',
  jurisdiction: 'Zone 3 — Central Metropolitan Division',
  role: 'DEPARTMENT_ADMIN',
  isActive: true,
  createdAt: '2024-03-15T09:30:00Z',
  lastLoginAt: '2026-10-06T08:12:00Z'
};

export const MOCK_SUPER_ADMIN_USER: AuthorityUser = {
  authorityId: 'AUTH-HQ-001',
  name: 'Dr. Aruna Sundaram, IAS',
  email: 'commissioner@municipalcorp.gov.in',
  phone: '+91 94250 88201',
  department: 'Municipal Corporation General Administration',
  designation: 'Municipal Commissioner & Chief Vigilance Officer',
  jurisdiction: 'Greater Municipal Corporation (All Wards)',
  role: 'SUPER_ADMIN',
  isActive: true,
  createdAt: '2023-01-10T09:00:00Z',
  lastLoginAt: '2026-10-06T07:45:00Z'
};

export const MOCK_FIELD_OFFICER_USER: AuthorityUser = {
  authorityId: 'AUTH-FLD-8821',
  name: 'Rajesh Shrivastava',
  email: 'r.shrivastava@pwd.gov.in',
  phone: '+91 98261 55904',
  department: 'Public Works Department (PWD)',
  designation: 'Assistant Engineer (Field Maintenance)',
  jurisdiction: 'Ward 14 & 15',
  role: 'OFFICER',
  isActive: true,
  createdAt: '2025-06-20T10:00:00Z',
  lastLoginAt: '2026-10-06T08:30:00Z'
};

export const MOCK_ROSTER_DEPARTMENTS = [
  'Public Works Department (PWD)',
  'Sanitation & Solid Waste Management',
  'Water Supply & Sewerage Board',
  'City Power & Street Lighting Wing',
  'Traffic Police & Road Safety Cell',
  'Horticulture & Parks Department',
  'Public Health & Environment Cell'
];

export const MOCK_ROSTER_OFFICERS = [
  { id: 'AUTH-FLD-8821', name: 'Rajesh Shrivastava', team: 'Asphalt Rapid Response Team', dept: 'Public Works Department (PWD)' },
  { id: 'AUTH-FLD-8822', name: 'Manish Chouksey', team: 'Pothole Patching Crew A', dept: 'Public Works Department (PWD)' },
  { id: 'AUTH-FLD-8823', name: 'Sunita Malviya', team: 'Footpath & Curb Repair Wing', dept: 'Public Works Department (PWD)' },
  { id: 'AUTH-SNT-3301', name: 'Gopal Krishna', team: 'Heavy Waste Clear Squad 2', dept: 'Sanitation & Solid Waste Management' },
  { id: 'AUTH-WTR-2204', name: 'Deepak Saxena', team: 'Pipeline Leakage Intervention', dept: 'Water Supply & Sewerage Board' },
  { id: 'AUTH-PWR-1109', name: 'Anil Deshmukh', team: 'High-Mast Luminary Team', dept: 'City Power & Street Lighting Wing' }
];

export const INITIAL_AUTHORITY_ISSUES: AuthorityIssue[] = [
  {
    id: 'CIV-2026-01842',
    title: 'Severe Crater-like Pothole on Main Arterial Road',
    description: 'A 4.5-foot wide, 8-inch deep crater has developed near the city bus terminal. Two-wheelers frequently swerve into oncoming traffic lanes, creating an acute rollover hazard during peak rush hours.',
    category: 'Roads & Potholes',
    subcategory: 'Asphalt Surface Fracture & Pavement Cavity',
    department: 'Public Works Department (PWD)',
    location: 'Main Road, Sector 3, Near City Center Bus Stop',
    latitude: 23.2599,
    longitude: 77.4126,
    ward: 'Ward 14 (Central Business District)',
    zone: 'Zone 3 (Central)',
    priority: 'Critical',
    status: 'In Progress',
    dateReported: '2026-10-04T08:15:00Z',
    lastUpdatedAt: '2026-10-06T06:45:00Z',
    slaTargetHours: 24,
    isOverdue: true,
    hoursElapsed: 46,
    evidencePhotos: [
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=1200&q=80'
    ],
    voiceTranscript: 'There is a deep, dangerous pothole near the Sector 3 bus stand. A scooter lost control this morning. Traffic is backing up and rain will turn it into a sinkhole.',
    citizen: {
      id: 'CIT-7782',
      name: 'Dr. Alok Nath Mukherjee',
      email: 'alok.mukherjee@aiims.edu',
      phone: '+91 98260 12345',
      ward: 'Ward 14',
      totalReportsSubmitted: 6,
      registeredDate: '2025-02-12',
      verifiedCitizen: true
    },
    cluster: {
      primaryIssueId: 'CIV-2026-01842',
      clusterCount: 7,
      clusterRadiusMeters: 65,
      linkedReports: [
        {
          reportId: 'CIV-2026-01891',
          citizenName: 'Meera Rajput',
          citizenEmail: 'meera.r@gmail.com',
          submittedAt: '2026-10-04T09:30:00Z',
          location: 'Opposite Metro Pillar 114, Sector 3',
          description: 'Huge pothole damaging vehicle rims and causing sudden braking.',
          distanceFromPrimaryMeters: 18
        },
        {
          reportId: 'CIV-2026-01904',
          citizenName: 'Kavita Chawla',
          citizenEmail: 'kavita.c@gmail.com',
          submittedAt: '2026-10-04T11:20:00Z',
          location: 'Sector 3 Main Bus Stop Lane',
          description: 'Water collecting in crater, completely invisible to night drivers.',
          distanceFromPrimaryMeters: 25
        },
        {
          reportId: 'CIV-2026-01911',
          citizenName: 'Rohit K. Pandey',
          citizenEmail: 'rohit.pandey@tech.in',
          submittedAt: '2026-10-04T13:45:00Z',
          location: 'Main Road Sector 3 Entry Gate',
          description: 'Dangerous road crater, auto-rickshaw overturned yesterday.',
          distanceFromPrimaryMeters: 40
        },
        {
          reportId: 'CIV-2026-01933',
          citizenName: 'Sunil Bhattacharya',
          citizenEmail: 'sunil.bhatt@yahoo.com',
          submittedAt: '2026-10-04T16:10:00Z',
          location: 'Near Sector 3 Bus Shelter',
          description: 'Extremely deep asphalt damage, needs emergency gravel and asphalt patching.',
          distanceFromPrimaryMeters: 12
        },
        {
          reportId: 'CIV-2026-01955',
          citizenName: 'Sanjay Deshpande',
          citizenEmail: 'sanjay.d@corp.org',
          submittedAt: '2026-10-05T07:20:00Z',
          location: 'Main Road Sector 3',
          description: 'Traffic gridlock caused by vehicles avoiding the central hole.',
          distanceFromPrimaryMeters: 30
        },
        {
          reportId: 'CIV-2026-01980',
          citizenName: 'Pooja Iyer',
          citizenEmail: 'pooja.iyer@gmail.com',
          submittedAt: '2026-10-05T09:40:00Z',
          location: 'Sector 3 Bus Stop',
          description: 'Pothole expanding across both traffic lanes.',
          distanceFromPrimaryMeters: 22
        }
      ]
    },
    aiAnalysis: {
      category: 'Roads & Potholes',
      subcategory: 'Surface Cavity / High Speed Corridor Risk',
      severity: 'Critical',
      urgency: 'Immediate (< 24h)',
      confidence: 0.96,
      summary: 'Critical road pavement structural cavity on a high-density transit artery.',
      reasoning: 'Visual analysis confirms deep sub-base exposure with edge crumbling exceeding 150mm depth. Semantic correlation across 7 distinct citizen reports points to active traffic disruption and vehicle collision risks.',
      recommendedDepartment: 'Public Works Department (PWD)',
      recommendedAuthority: 'Asphalt Rapid Response Team',
      hazardScore: 92
    },
    assignment: {
      department: 'Public Works Department (PWD)',
      team: 'Asphalt Rapid Response Team',
      officerName: 'Rajesh Shrivastava',
      officerId: 'AUTH-FLD-8821',
      assignedBy: 'Vikramaditya Rathore (Senior Executive Engineer)',
      assignedAt: '2026-10-04T10:00:00Z',
      expectedResolutionDate: '2026-10-06T18:00:00Z'
    },
    internalNotes: [
      {
        id: 'NOTE-101',
        authorName: 'Vikramaditya Rathore',
        authorDesignation: 'Executive Engineer',
        authorId: 'AUTH-PWD-4402',
        content: 'Mobilized hot-mix asphalt batching plant order #AS-441. Night shifting crew will execute base-compaction.',
        createdAt: '2026-10-04T10:15:00Z',
        isConfidential: true
      },
      {
        id: 'NOTE-102',
        authorName: 'Rajesh Shrivastava',
        authorDesignation: 'Assistant Engineer',
        authorId: 'AUTH-FLD-8821',
        content: 'Traffic police coordinator SI Rameshwar informed for nocturnal lane closure (11 PM - 4 AM). Barricading boards deployed on site.',
        createdAt: '2026-10-05T14:20:00Z',
        isConfidential: false
      }
    ],
    citizenUpdates: [
      {
        id: 'UPD-201',
        title: 'Report Received and Verified by Municipal Engineers',
        message: 'Your report along with 6 linked neighborhood submissions has been validated by PWD engineers. Heavy machinery and hot-mix asphalt dispatched.',
        sentAt: '2026-10-04T10:05:00Z',
        authorName: 'PWD Municipal Control Room',
        deliveryStatus: 'Delivered',
        triggeredStatusChange: 'Acknowledged'
      },
      {
        id: 'UPD-202',
        title: 'Repair Operations Active On Site',
        message: 'Field repair team under AE Rajesh Shrivastava is actively deploying roller compactor and bitumen sealing.',
        sentAt: '2026-10-05T22:30:00Z',
        authorName: 'PWD Rapid Response',
        deliveryStatus: 'Delivered',
        triggeredStatusChange: 'In Progress'
      }
    ],
    auditTrail: [
      {
        id: 'AUD-001',
        timestamp: '2026-10-04T08:15:00Z',
        action: 'REPORT_SUBMITTED',
        actorName: 'Dr. Alok Nath Mukherjee',
        actorRole: 'Citizen',
        details: 'Citizen submitted photo evidence and audio description via Mobile App.'
      },
      {
        id: 'AUD-002',
        timestamp: '2026-10-04T08:15:12Z',
        action: 'AI_TRIAGE_COMPLETED',
        actorName: 'CIVIC AI Engine v2.4',
        actorRole: 'Automated Service',
        details: 'Categorized as Roads & Potholes (Critical, 96% confidence). Auto-routed to PWD.'
      },
      {
        id: 'AUD-003',
        timestamp: '2026-10-04T09:35:00Z',
        action: 'CLUSTER_DETECTED',
        actorName: 'CIVIC AI Cluster Detector',
        actorRole: 'Automated Service',
        details: 'Merged 6 duplicate citizen submissions within 65m radius into primary ticket.'
      },
      {
        id: 'AUD-004',
        timestamp: '2026-10-04T10:00:00Z',
        action: 'OFFICER_ASSIGNED',
        actorName: 'Vikramaditya Rathore',
        actorRole: 'DEPARTMENT_ADMIN',
        details: 'Assigned to AE Rajesh Shrivastava (Asphalt Rapid Response Team).'
      },
      {
        id: 'AUD-005',
        timestamp: '2026-10-05T22:30:00Z',
        action: 'STATUS_CHANGED',
        actorName: 'Rajesh Shrivastava',
        actorRole: 'OFFICER',
        details: 'Status transitioned from Acknowledged to In Progress.',
        previousState: 'Acknowledged',
        newState: 'In Progress'
      }
    ]
  },
  {
    id: 'CIV-2026-01791',
    title: 'High-Mast Streetlight Outage & Exposed High-Voltage Line',
    description: 'High-mast light fixture non-functional outside university girls hostel gate. Storm damaged the bottom access box, leaving live 440V copper cables exposed at pedestrian arm level in pitch dark.',
    category: 'Streetlights',
    subcategory: 'Electrical Safety Hazard & Total Dark Corridor',
    department: 'City Power & Street Lighting Wing',
    location: 'University Gate 2, Metro Ring Road, Sector 2',
    latitude: 23.2514,
    longitude: 77.4231,
    ward: 'Ward 12 (University Sector)',
    zone: 'Zone 3 (Central)',
    priority: 'Critical',
    status: 'Under Review',
    dateReported: '2026-10-05T18:40:00Z',
    lastUpdatedAt: '2026-10-06T07:15:00Z',
    slaTargetHours: 24,
    isOverdue: false,
    hoursElapsed: 14,
    evidencePhotos: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80'
    ],
    voiceTranscript: 'The main streetlight is completely blacked out outside the campus gate and exposed electric wires are hanging out of the open box.',
    citizen: {
      id: 'CIT-9102',
      name: 'Priya Sharma',
      email: 'priya.sharma@univ.ac.in',
      phone: '+91 97520 88319',
      ward: 'Ward 12',
      totalReportsSubmitted: 3,
      registeredDate: '2025-08-10',
      verifiedCitizen: true
    },
    cluster: {
      primaryIssueId: 'CIV-2026-01791',
      clusterCount: 4,
      clusterRadiusMeters: 45,
      linkedReports: [
        {
          reportId: 'CIV-2026-01802',
          citizenName: 'Rohit Agrawal',
          citizenEmail: 'rohit.agr@gmail.com',
          submittedAt: '2026-10-05T19:15:00Z',
          location: 'University Gate 2 Entrance',
          description: 'Dangerous open junction box sparking near sidewalk.',
          distanceFromPrimaryMeters: 10
        },
        {
          reportId: 'CIV-2026-01825',
          citizenName: 'Sneha Banerjee',
          citizenEmail: 'sneha.b@univ.ac.in',
          submittedAt: '2026-10-05T20:45:00Z',
          location: 'Ring Road near Metro Gate 2',
          description: 'Hostel walkway completely dark and women students feel unsafe.',
          distanceFromPrimaryMeters: 35
        }
      ]
    },
    aiAnalysis: {
      category: 'Streetlights',
      subcategory: 'High Voltage Exposed Cable / Public Safety',
      severity: 'Critical',
      urgency: 'Immediate (< 24h)',
      confidence: 0.94,
      summary: 'Public electrocution risk coupled with security vulnerability on campus perimeter.',
      reasoning: 'Image diagnostics identify opened MCB junction plate with bare terminal lugs protruding into public walkway.',
      recommendedDepartment: 'City Power & Street Lighting Wing',
      recommendedAuthority: 'High-Mast Emergency Response Cell',
      hazardScore: 95
    },
    assignment: {
      department: 'City Power & Street Lighting Wing',
      team: 'High-Mast Luminary Team',
      officerName: 'Anil Deshmukh',
      officerId: 'AUTH-PWR-1109',
      assignedBy: 'Chief Electrical Inspectorate',
      assignedAt: '2026-10-05T21:00:00Z',
      expectedResolutionDate: '2026-10-06T15:00:00Z'
    },
    internalNotes: [
      {
        id: 'NOTE-201',
        authorName: 'Anil Deshmukh',
        authorDesignation: 'Junior Engineer (Electrical)',
        authorId: 'AUTH-PWR-1109',
        content: 'Isolator breaker tripped remotely as precautionary measure. Replacement 100A enclosure box requisited from central store.',
        createdAt: '2026-10-05T21:40:00Z',
        isConfidential: true
      }
    ],
    citizenUpdates: [
      {
        id: 'UPD-301',
        title: 'Emergency Power Isolation Executed',
        message: 'Power line to the damaged junction box was isolated remotely for public safety. Repair van en route.',
        sentAt: '2026-10-05T22:00:00Z',
        authorName: 'City Power Wing Control',
        deliveryStatus: 'Delivered',
        triggeredStatusChange: 'Under Review'
      }
    ],
    auditTrail: [
      {
        id: 'AUD-101',
        timestamp: '2026-10-05T18:40:00Z',
        action: 'REPORT_SUBMITTED',
        actorName: 'Priya Sharma',
        actorRole: 'Citizen',
        details: 'Citizen flagged high-voltage hazard.'
      },
      {
        id: 'AUD-102',
        timestamp: '2026-10-05T21:00:00Z',
        action: 'OFFICER_ASSIGNED',
        actorName: 'Dispatched System',
        actorRole: 'System',
        details: 'Assigned to JE Anil Deshmukh.'
      }
    ]
  },
  {
    id: 'CIV-2026-01631',
    title: 'Commercial Solid Waste & Overflowing Dumpster at Vegetable Market',
    description: 'Rotting organic food waste overflowing across 40 meters of market pedestrian path. Drainage inlet blocked by polythene dumps, creating stagnant sludge and extreme fly infestation.',
    category: 'Garbage & Waste',
    subcategory: 'Commercial Solid Waste Accumulation & Drain Clog',
    department: 'Sanitation & Solid Waste Management',
    location: 'Sector 4 Wholesale Mandi, Ring Road Corner',
    latitude: 23.2685,
    longitude: 77.3992,
    ward: 'Ward 8 (Subhash Nagar)',
    zone: 'Zone 2 (North)',
    priority: 'High',
    status: 'Resolved',
    dateReported: '2026-10-02T07:10:00Z',
    lastUpdatedAt: '2026-10-03T16:30:00Z',
    slaTargetHours: 48,
    isOverdue: false,
    hoursElapsed: 33,
    evidencePhotos: [
      'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1200&q=80'
    ],
    citizen: {
      id: 'CIT-4410',
      name: 'Rohan Verma',
      email: 'rohan.v@civic.org',
      phone: '+91 94255 10092',
      ward: 'Ward 8',
      totalReportsSubmitted: 11,
      registeredDate: '2024-11-05',
      verifiedCitizen: true
    },
    cluster: {
      primaryIssueId: 'CIV-2026-01631',
      clusterCount: 3,
      clusterRadiusMeters: 40,
      linkedReports: [
        {
          reportId: 'CIV-2026-01644',
          citizenName: 'Babulal Sahu',
          citizenEmail: 'babulal.mandi@gmail.com',
          submittedAt: '2026-10-02T08:30:00Z',
          location: 'Sector 4 Mandi Gate 1',
          description: 'Garbage trucks haven’t picked waste for 3 days.',
          distanceFromPrimaryMeters: 20
        }
      ]
    },
    aiAnalysis: {
      category: 'Garbage & Waste',
      subcategory: 'Public Market Health Hazard',
      severity: 'High',
      urgency: 'Urgent (< 48h)',
      confidence: 0.95,
      summary: 'Biowaste accumulation obstructing stormwater intake grate.',
      reasoning: 'Debris exceeds standard container capacity. High risk of monsoon urban waterlogging.',
      recommendedDepartment: 'Sanitation & Solid Waste Management',
      recommendedAuthority: 'Heavy Waste Clear Squad 2',
      hazardScore: 78
    },
    assignment: {
      department: 'Sanitation & Solid Waste Management',
      team: 'Heavy Waste Clear Squad 2',
      officerName: 'Gopal Krishna',
      officerId: 'AUTH-SNT-3301',
      assignedBy: 'Ward 8 Sanitary Inspector',
      assignedAt: '2026-10-02T09:00:00Z'
    },
    internalNotes: [
      {
        id: 'NOTE-301',
        authorName: 'Gopal Krishna',
        authorDesignation: 'Chief Sanitary Inspector',
        authorId: 'AUTH-SNT-3301',
        content: 'Deployed JCB loader #MP-04-HE-1922 and three 10-ton tipper trucks. Lime powder disinfectant sprayed over cleaned surface.',
        createdAt: '2026-10-03T15:00:00Z',
        isConfidential: false
      }
    ],
    citizenUpdates: [
      {
        id: 'UPD-401',
        title: 'Waste Removed & Disinfectant Applied',
        message: 'Sanitation department has cleared 14 metric tons of commercial waste and cleared storm grates. Photographic resolution attached.',
        sentAt: '2026-10-03T16:30:00Z',
        authorName: 'Municipal Health Officer',
        deliveryStatus: 'Delivered',
        triggeredStatusChange: 'Resolved'
      }
    ],
    resolution: {
      resolvedAt: '2026-10-03T16:30:00Z',
      resolvedByOfficer: 'Gopal Krishna',
      officerId: 'AUTH-SNT-3301',
      description: 'Comprehensive mechanical sweeping, JCB removal of 14.2 metric tons of wet vegetable refuse, pressure washing of drain intake and bleacher disinfection.',
      beforePhotoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1200&q=80',
      afterPhotoUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      completionRemarks: 'Market committee cautioned against off-bin dumping. Daily 5 AM compactor scheduled.',
      verifiedBySupervisor: true
    },
    auditTrail: [
      {
        id: 'AUD-201',
        timestamp: '2026-10-02T07:10:00Z',
        action: 'REPORT_SUBMITTED',
        actorName: 'Rohan Verma',
        actorRole: 'Citizen',
        details: 'Report logged.'
      },
      {
        id: 'AUD-202',
        timestamp: '2026-10-03T16:30:00Z',
        action: 'ISSUE_RESOLVED',
        actorName: 'Gopal Krishna',
        actorRole: 'OFFICER',
        details: 'Resolution evidence uploaded and ticket resolved.',
        previousState: 'In Progress',
        newState: 'Resolved'
      }
    ]
  },
  {
    id: 'CIV-2026-01574',
    title: 'Collapsed Paving Footpath & Open Utility Trench',
    description: 'Pedestrian sidewalk caved into a 6-foot telecommunication trench. Blind walking path and accessibility ramp completely severed.',
    category: 'Public Infrastructure',
    subcategory: 'Pedestrian Sidewalk Collapse',
    department: 'Public Works Department (PWD)',
    location: 'Central Market Road, Sector 5 Crossing',
    latitude: 23.2541,
    longitude: 77.4082,
    ward: 'Ward 14 (Central Business District)',
    zone: 'Zone 3 (Central)',
    priority: 'Medium',
    status: 'Assigned',
    dateReported: '2026-10-03T14:10:00Z',
    lastUpdatedAt: '2026-10-04T11:00:00Z',
    slaTargetHours: 72,
    isOverdue: false,
    hoursElapsed: 68,
    evidencePhotos: [
      'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=1200&q=80'
    ],
    citizen: {
      id: 'CIT-3309',
      name: 'Anita Deshmukh',
      email: 'anita.d@civic.org',
      phone: '+91 98263 77102',
      ward: 'Ward 14',
      totalReportsSubmitted: 4,
      registeredDate: '2025-01-20',
      verifiedCitizen: true
    },
    cluster: {
      primaryIssueId: 'CIV-2026-01574',
      clusterCount: 2,
      clusterRadiusMeters: 30,
      linkedReports: []
    },
    aiAnalysis: {
      category: 'Public Infrastructure',
      subcategory: 'Pedestrian Walkway Hazard',
      severity: 'Medium',
      urgency: 'Standard (< 72h)',
      confidence: 0.91,
      summary: 'Collapsed paver blocks exposing subterranean telecom conduit.',
      reasoning: 'Non-vehicular corridor; pedestrian rerouted into street. Medium severity.',
      recommendedDepartment: 'Public Works Department (PWD)',
      recommendedAuthority: 'Footpath & Curb Repair Wing',
      hazardScore: 58
    },
    assignment: {
      department: 'Public Works Department (PWD)',
      team: 'Footpath & Curb Repair Wing',
      officerName: 'Sunita Malviya',
      officerId: 'AUTH-FLD-8823',
      assignedBy: 'Vikramaditya Rathore',
      assignedAt: '2026-10-04T11:00:00Z'
    },
    internalNotes: [
      {
        id: 'NOTE-401',
        authorName: 'Sunita Malviya',
        authorDesignation: 'Overseer',
        authorId: 'AUTH-FLD-8823',
        content: 'Notified Telecom agency Airtel Broadband regarding illegal unbackfilled trenching. Penalty notice drafted.',
        createdAt: '2026-10-04T11:30:00Z',
        isConfidential: true
      }
    ],
    citizenUpdates: [],
    auditTrail: [
      {
        id: 'AUD-301',
        timestamp: '2026-10-03T14:10:00Z',
        action: 'REPORT_SUBMITTED',
        actorName: 'Anita Deshmukh',
        actorRole: 'Citizen',
        details: 'Report created.'
      }
    ]
  },
  {
    id: 'CIV-2026-01420',
    title: 'Drinking Water Pipeline Fracture & Residential Street Inundation',
    description: 'Underground 300mm main potable water pipe fractured during road boring. Potable water flooding residential basements; loss of water pressure for ~450 households.',
    category: 'Water Supply',
    subcategory: 'Primary Distribution Pipe Burst',
    department: 'Water Supply & Sewerage Board',
    location: 'Green Park, Block B, Avenue 4 Junction',
    latitude: 23.2622,
    longitude: 77.4208,
    ward: 'Ward 9 (Green Park Colony)',
    zone: 'Zone 4 (East)',
    priority: 'Critical',
    status: 'Acknowledged',
    dateReported: '2026-10-06T06:20:00Z',
    lastUpdatedAt: '2026-10-06T07:50:00Z',
    slaTargetHours: 12,
    isOverdue: false,
    hoursElapsed: 3,
    evidencePhotos: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80'
    ],
    citizen: {
      id: 'CIT-1190',
      name: 'Karan Mehra',
      email: 'karan.mehra@gmail.com',
      phone: '+91 99260 44881',
      ward: 'Ward 9',
      totalReportsSubmitted: 8,
      registeredDate: '2024-05-18',
      verifiedCitizen: true
    },
    cluster: {
      primaryIssueId: 'CIV-2026-01420',
      clusterCount: 9,
      clusterRadiusMeters: 80,
      linkedReports: [
        {
          reportId: 'CIV-2026-01422',
          citizenName: 'Manjula Rao',
          citizenEmail: 'manjula.r@gmail.com',
          submittedAt: '2026-10-06T06:45:00Z',
          location: 'Block B House 44',
          description: 'Water gushing into ground floor parking garage.',
          distanceFromPrimaryMeters: 15
        },
        {
          reportId: 'CIV-2026-01427',
          citizenName: 'Harish Tandon',
          citizenEmail: 'harish.t@gmail.com',
          submittedAt: '2026-10-06T07:10:00Z',
          location: 'Block B Lane 2',
          description: 'Zero tap water pressure since 6 AM.',
          distanceFromPrimaryMeters: 45
        }
      ]
    },
    aiAnalysis: {
      category: 'Water Supply',
      subcategory: 'High Volume Potable Loss & Inundation',
      severity: 'Critical',
      urgency: 'Immediate (< 24h)',
      confidence: 0.98,
      summary: 'Main trunk line burst causing residential damage and water supply stoppage.',
      reasoning: 'Extremely high civic disruption across 450+ families. High contamination risk if sewer backflows into depressurized line.',
      recommendedDepartment: 'Water Supply & Sewerage Board',
      recommendedAuthority: 'Pipeline Leakage Intervention',
      hazardScore: 98
    },
    assignment: {
      department: 'Water Supply & Sewerage Board',
      team: 'Pipeline Leakage Intervention',
      officerName: 'Deepak Saxena',
      officerId: 'AUTH-WTR-2204',
      assignedBy: 'Executive Engineer (Water Distribution)',
      assignedAt: '2026-10-06T07:00:00Z'
    },
    internalNotes: [
      {
        id: 'NOTE-501',
        authorName: 'Deepak Saxena',
        authorDesignation: 'Assistant Engineer',
        authorId: 'AUTH-WTR-2204',
        content: 'Main Sluice Valve 12 isolated at 07:15. Water tanker distribution dispatched for Block B residents.',
        createdAt: '2026-10-06T07:30:00Z',
        isConfidential: false
      }
    ],
    citizenUpdates: [
      {
        id: 'UPD-501',
        title: 'Emergency Valve Isolated & Supply Tankers Dispatched',
        message: 'Main line shut down for excavation and pipe replacement. Two free drinking water tankers stationed at Block B community park.',
        sentAt: '2026-10-06T07:50:00Z',
        authorName: 'Water Works Emergency Bureau',
        deliveryStatus: 'Delivered',
        triggeredStatusChange: 'Acknowledged'
      }
    ],
    auditTrail: [
      {
        id: 'AUD-401',
        timestamp: '2026-10-06T06:20:00Z',
        action: 'REPORT_SUBMITTED',
        actorName: 'Karan Mehra',
        actorRole: 'Citizen',
        details: 'Emergency ticket opened.'
      }
    ]
  },
  {
    id: 'CIV-2026-01318',
    title: 'Automated Traffic Controller Malfunction at Major Junction',
    description: 'Four-way intersection traffic lights flashing conflicting green signals simultaneously, resulting in gridlock and vehicle standoffs.',
    category: 'Traffic',
    subcategory: 'Traffic Signal Controller Circuit Fault',
    department: 'Traffic Police & Road Safety Cell',
    location: 'Ring Road Junction, Outer Corridor',
    latitude: 23.2711,
    longitude: 77.4199,
    ward: 'Ward 15 (Ring Road Bypass)',
    zone: 'Zone 3 (Central)',
    priority: 'High',
    status: 'Reported',
    dateReported: '2026-10-06T07:35:00Z',
    lastUpdatedAt: '2026-10-06T07:35:00Z',
    slaTargetHours: 24,
    isOverdue: false,
    hoursElapsed: 1,
    evidencePhotos: [
      'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80'
    ],
    citizen: {
      id: 'CIT-8820',
      name: 'Ritu Sen',
      email: 'ritu.sen@trafficwatch.in',
      phone: '+91 97130 99221',
      ward: 'Ward 15',
      totalReportsSubmitted: 2,
      registeredDate: '2026-01-14',
      verifiedCitizen: true
    },
    cluster: {
      primaryIssueId: 'CIV-2026-01318',
      clusterCount: 3,
      clusterRadiusMeters: 50,
      linkedReports: []
    },
    aiAnalysis: {
      category: 'Traffic',
      subcategory: 'Intersection Signal Controller Logic Crash',
      severity: 'High',
      urgency: 'Immediate (< 24h)',
      confidence: 0.93,
      summary: 'Conflicting signal sequence posing direct head-on collision danger.',
      reasoning: 'Image and text denote dual green indicator cycle on intersecting avenues.',
      recommendedDepartment: 'Traffic Police & Road Safety Cell',
      recommendedAuthority: 'Signals Engineering Unit',
      hazardScore: 89
    },
    internalNotes: [],
    citizenUpdates: [],
    auditTrail: [
      {
        id: 'AUD-501',
        timestamp: '2026-10-06T07:35:00Z',
        action: 'REPORT_SUBMITTED',
        actorName: 'Ritu Sen',
        actorRole: 'Citizen',
        details: 'Citizen report registered.'
      }
    ]
  }
];

export const MOCK_NOTIFICATIONS: AuthorityNotification[] = [
  {
    id: 'NOTIF-01',
    type: 'NEW_HIGH_PRIORITY',
    title: 'CRITICAL: Water Main Burst in Ward 9',
    message: 'Potable water main ruptured at Green Park Block B. 450 residential connections impacted. Immediate isolation required.',
    timestamp: '2026-10-06T06:22:00Z',
    read: false,
    priority: 'Critical',
    linkedIssueId: 'CIV-2026-01420'
  },
  {
    id: 'NOTIF-02',
    type: 'CLUSTER_MERGED',
    title: 'Cluster Alert: 7 Citizen Reports Merged',
    message: 'AI cluster algorithm detected 6 additional citizen reports for crater pothole on Main Road (CIV-2026-01842).',
    timestamp: '2026-10-04T09:36:00Z',
    read: false,
    priority: 'High',
    linkedIssueId: 'CIV-2026-01842'
  },
  {
    id: 'NOTIF-03',
    type: 'SLA_BREACH_WARNING',
    title: 'SLA Breach: Issue Overdue by 22 Hours',
    message: 'Ticket CIV-2026-01842 (Critical Road Crater) has exceeded the 24-hour SLA window without resolution sign-off.',
    timestamp: '2026-10-05T08:16:00Z',
    read: false,
    priority: 'Critical',
    linkedIssueId: 'CIV-2026-01842'
  },
  {
    id: 'NOTIF-04',
    type: 'NEW_EVIDENCE',
    title: 'New High-Voltage Hazard Reported in Ward 12',
    message: 'Open 440V distribution box flagged at university corridor. Remote isolator deployed.',
    timestamp: '2026-10-05T18:42:00Z',
    read: true,
    priority: 'High',
    linkedIssueId: 'CIV-2026-01791'
  }
];

export const MOCK_CITIZENS_DIRECTORY = [
  {
    id: 'CIT-7782',
    name: 'Dr. Alok Nath Mukherjee',
    email: 'alok.mukherjee@aiims.edu',
    phone: '+91 98260 12345',
    ward: 'Ward 14 (CBD)',
    totalReportsSubmitted: 6,
    registeredDate: '2025-02-12',
    verifiedCitizen: true,
    lastReportDate: '2026-10-04',
    relatedIssueIds: ['CIV-2026-01842']
  },
  {
    id: 'CIT-9102',
    name: 'Priya Sharma',
    email: 'priya.sharma@univ.ac.in',
    phone: '+91 97520 88319',
    ward: 'Ward 12 (University)',
    totalReportsSubmitted: 3,
    registeredDate: '2025-08-10',
    verifiedCitizen: true,
    lastReportDate: '2026-10-05',
    relatedIssueIds: ['CIV-2026-01791']
  },
  {
    id: 'CIT-4410',
    name: 'Rohan Verma',
    email: 'rohan.v@civic.org',
    phone: '+91 94255 10092',
    ward: 'Ward 8 (Subhash Nagar)',
    totalReportsSubmitted: 11,
    registeredDate: '2024-11-05',
    verifiedCitizen: true,
    lastReportDate: '2026-10-02',
    relatedIssueIds: ['CIV-2026-01631']
  },
  {
    id: 'CIT-3309',
    name: 'Anita Deshmukh',
    email: 'anita.d@civic.org',
    phone: '+91 98263 77102',
    ward: 'Ward 14 (CBD)',
    totalReportsSubmitted: 4,
    registeredDate: '2025-01-20',
    verifiedCitizen: true,
    lastReportDate: '2026-10-03',
    relatedIssueIds: ['CIV-2026-01574']
  },
  {
    id: 'CIT-1190',
    name: 'Karan Mehra',
    email: 'karan.mehra@gmail.com',
    phone: '+91 99260 44881',
    ward: 'Ward 9 (Green Park)',
    totalReportsSubmitted: 8,
    registeredDate: '2024-05-18',
    verifiedCitizen: true,
    lastReportDate: '2026-10-06',
    relatedIssueIds: ['CIV-2026-01420']
  },
  {
    id: 'CIT-8820',
    name: 'Ritu Sen',
    email: 'ritu.sen@trafficwatch.in',
    phone: '+91 97130 99221',
    ward: 'Ward 15 (Ring Road)',
    totalReportsSubmitted: 2,
    registeredDate: '2026-01-14',
    verifiedCitizen: true,
    lastReportDate: '2026-10-06',
    relatedIssueIds: ['CIV-2026-01318']
  }
];

export const MOCK_ANALYTICS_DATA: AuthorityAnalyticsSummary = {
  totalIssues: 184,
  newUnreviewed: 24,
  underReview: 18,
  assigned: 32,
  inProgress: 41,
  resolved: 63,
  overdue: 14,
  highPriorityCount: 38,
  duplicateMergedCount: 46,
  averageAckHours: 2.4,
  averageResolutionHours: 28.6,
  slaComplianceRate: 84.8,
  byCategory: [
    { name: 'Roads & Potholes', count: 68, percentage: 37 },
    { name: 'Streetlights & Electrical', count: 42, percentage: 23 },
    { name: 'Garbage & Sanitation', count: 34, percentage: 18 },
    { name: 'Water & Sewerage', count: 24, percentage: 13 },
    { name: 'Traffic & Transport', count: 16, percentage: 9 }
  ],
  byPriority: [
    { priority: 'Critical', count: 22, percentage: 12 },
    { priority: 'High', count: 56, percentage: 30 },
    { priority: 'Medium', count: 74, percentage: 40 },
    { priority: 'Low', count: 32, percentage: 18 }
  ],
  byStatus: [
    { status: 'Reported', count: 24 },
    { status: 'Under Review', count: 18 },
    { status: 'Assigned', count: 32 },
    { status: 'In Progress', count: 41 },
    { status: 'Resolved', count: 63 },
    { status: 'Rejected', count: 6 }
  ],
  byWard: [
    { ward: 'Ward 14 (CBD)', count: 48, resolvedCount: 32 },
    { ward: 'Ward 12 (University)', count: 36, resolvedCount: 22 },
    { ward: 'Ward 8 (Subhash Nagar)', count: 34, resolvedCount: 26 },
    { ward: 'Ward 9 (Green Park)', count: 38, resolvedCount: 20 },
    { ward: 'Ward 15 (Ring Road)', count: 28, resolvedCount: 14 }
  ]
};
