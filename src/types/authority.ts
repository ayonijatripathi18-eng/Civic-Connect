/**
 * CIVIC-CONNECT Authority Portal Type Definitions
 * 
 * Domain and API contracts structured for future backend integration:
 * - POST /api/authority/login
 * - GET  /api/authority/me
 * - GET  /api/authority/issues
 * - PATCH /api/authority/issues/:id/status
 * - POST /api/authority/issues/:id/assign
 * - POST /api/authority/issues/:id/notes
 * - POST /api/authority/issues/:id/updates
 * - POST /api/authority/issues/:id/resolution
 */

export type AuthorityRole = 'SUPER_ADMIN' | 'DEPARTMENT_ADMIN' | 'OFFICER';

export type AuthorityIssueStatus =
  | 'Reported'
  | 'Received'
  | 'Acknowledged'
  | 'Under Review'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Closed'
  | 'Rejected';

export type AuthorityIssuePriority = 'Critical' | 'High' | 'Medium' | 'Low';

export interface AuthorityUser {
  authorityId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  jurisdiction: string;
  role: AuthorityRole;
  isActive: boolean;
  avatarUrl?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface CitizenInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  ward: string;
  totalReportsSubmitted: number;
  registeredDate: string;
  verifiedCitizen: boolean;
}

export interface LinkedCitizenReport {
  reportId: string;
  citizenName: string;
  citizenEmail: string;
  submittedAt: string;
  location: string;
  description: string;
  photoUrl?: string;
  distanceFromPrimaryMeters: number;
}

export interface IssueClusterData {
  primaryIssueId: string;
  clusterCount: number;
  clusterRadiusMeters: number;
  linkedReports: LinkedCitizenReport[];
}

export interface AIAnalysisData {
  category: string;
  subcategory: string;
  severity: AuthorityIssuePriority;
  urgency: 'Immediate (< 24h)' | 'Urgent (< 48h)' | 'Standard (< 72h)' | 'Routine (< 7d)';
  confidence: number;
  summary: string;
  reasoning: string;
  recommendedDepartment: string;
  recommendedAuthority: string;
  hazardScore: number; // 1-100
}

export interface AssignmentData {
  department: string;
  team: string;
  officerName: string;
  officerId: string;
  assignedBy: string;
  assignedAt: string;
  expectedResolutionDate?: string;
}

export interface InternalNote {
  id: string;
  authorName: string;
  authorDesignation: string;
  authorId: string;
  content: string;
  createdAt: string;
  isConfidential: boolean;
}

export interface CitizenUpdate {
  id: string;
  title: string;
  message: string;
  sentAt: string;
  authorName: string;
  deliveryStatus: 'Queued' | 'Sent' | 'Delivered';
  triggeredStatusChange?: AuthorityIssueStatus;
}

export interface ResolutionData {
  resolvedAt: string;
  resolvedByOfficer: string;
  officerId: string;
  description: string;
  beforePhotoUrl: string;
  afterPhotoUrl: string;
  completionRemarks?: string;
  verifiedBySupervisor?: boolean;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  action: string;
  actorName: string;
  actorRole: string;
  details: string;
  previousState?: string;
  newState?: string;
}

export interface AuthorityIssue {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  department: string;
  location: string;
  latitude: number;
  longitude: number;
  ward: string;
  zone: string;
  priority: AuthorityIssuePriority;
  status: AuthorityIssueStatus;
  dateReported: string;
  lastUpdatedAt: string;
  slaTargetHours: number;
  isOverdue: boolean;
  hoursElapsed: number;

  // Evidence
  evidencePhotos: string[];
  voiceTranscript?: string;

  // Citizen linkage
  citizen: CitizenInfo;
  cluster: IssueClusterData;

  // AI Pipeline
  aiAnalysis: AIAnalysisData;

  // Administrative State
  assignment?: AssignmentData;
  internalNotes: InternalNote[];
  citizenUpdates: CitizenUpdate[];
  resolution?: ResolutionData;
  auditTrail: AuditEvent[];
}

export interface AuthorityNotification {
  id: string;
  type: 'NEW_HIGH_PRIORITY' | 'CLUSTER_MERGED' | 'SLA_BREACH_WARNING' | 'NEW_EVIDENCE' | 'STATUS_REMINDER';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'Critical' | 'High' | 'Normal';
  linkedIssueId?: string;
}

export interface AuthorityAnalyticsSummary {
  totalIssues: number;
  newUnreviewed: number;
  underReview: number;
  assigned: number;
  inProgress: number;
  resolved: number;
  overdue: number;
  highPriorityCount: number;
  duplicateMergedCount: number;
  averageAckHours: number;
  averageResolutionHours: number;
  slaComplianceRate: number; // percentage
  byCategory: { name: string; count: number; percentage: number }[];
  byPriority: { priority: AuthorityIssuePriority; count: number; percentage: number }[];
  byStatus: { status: AuthorityIssueStatus; count: number }[];
  byWard: { ward: string; count: number; resolvedCount: number }[];
}
