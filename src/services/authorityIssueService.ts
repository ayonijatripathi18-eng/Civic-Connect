import {
  AuthorityIssue,
  AuthorityIssueStatus,
  AssignmentData,
  InternalNote,
  CitizenUpdate,
  ResolutionData,
  AuditEvent
} from '../types/authority';
import { INITIAL_AUTHORITY_ISSUES } from '../data/authorityMockData';

/**
 * CIVIC-CONNECT Authority Issue Service (Frontend Layer)
 * 
 * Future REST / Backend Integration Targets:
 * - GET    /api/authority/issues
 * - GET    /api/authority/issues/:id
 * - PATCH  /api/authority/issues/:id/status
 * - POST   /api/authority/issues/:id/assign
 * - POST   /api/authority/issues/:id/notes
 * - POST   /api/authority/issues/:id/updates
 * - POST   /api/authority/issues/:id/resolution
 */

const STORAGE_KEY = 'civic_authority_issues_store';

function loadIssuesStore(): AuthorityIssue[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Error reading authority issues store', e);
  }
  return INITIAL_AUTHORITY_ISSUES;
}

function saveIssuesStore(issues: AuthorityIssue[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
  } catch (e) {
    console.warn('Error writing authority issues store', e);
  }
}

export const authorityIssueService = {
  async getIssues(): Promise<AuthorityIssue[]> {
    await new Promise((r) => setTimeout(r, 200));
    return loadIssuesStore();
  },

  async getIssueById(id: string): Promise<AuthorityIssue | null> {
    await new Promise((r) => setTimeout(r, 150));
    const list = loadIssuesStore();
    return list.find((i) => i.id === id) || null;
  },

  async updateStatus(
    issueId: string,
    newStatus: AuthorityIssueStatus,
    actorName: string,
    actorRole: string
  ): Promise<AuthorityIssue> {
    const list = loadIssuesStore();
    const index = list.findIndex((i) => i.id === issueId);
    if (index === -1) throw new Error('Issue not found');

    const prevStatus = list[index].status;
    const nowIso = new Date().toISOString();

    const auditEvent: AuditEvent = {
      id: 'AUD-' + Date.now(),
      timestamp: nowIso,
      action: 'STATUS_CHANGED',
      actorName,
      actorRole,
      details: `Status changed from ${prevStatus} to ${newStatus}.`,
      previousState: prevStatus,
      newState: newStatus
    };

    const updatedIssue: AuthorityIssue = {
      ...list[index],
      status: newStatus,
      lastUpdatedAt: nowIso,
      auditTrail: [auditEvent, ...list[index].auditTrail]
    };

    list[index] = updatedIssue;
    saveIssuesStore(list);
    return updatedIssue;
  },

  async assignIssue(
    issueId: string,
    assignment: AssignmentData,
    actorName: string
  ): Promise<AuthorityIssue> {
    const list = loadIssuesStore();
    const index = list.findIndex((i) => i.id === issueId);
    if (index === -1) throw new Error('Issue not found');

    const nowIso = new Date().toISOString();
    const auditEvent: AuditEvent = {
      id: 'AUD-' + Date.now(),
      timestamp: nowIso,
      action: 'OFFICER_ASSIGNED',
      actorName,
      actorRole: 'AUTHORITY',
      details: `Dispatched to ${assignment.department} / ${assignment.team} (Lead: ${assignment.officerName}).`
    };

    const updatedIssue: AuthorityIssue = {
      ...list[index],
      assignment,
      status: list[index].status === 'Reported' ? 'Assigned' : list[index].status,
      lastUpdatedAt: nowIso,
      auditTrail: [auditEvent, ...list[index].auditTrail]
    };

    list[index] = updatedIssue;
    saveIssuesStore(list);
    return updatedIssue;
  },

  async addInternalNote(
    issueId: string,
    content: string,
    author: { name: string; designation: string; id: string }
  ): Promise<AuthorityIssue> {
    const list = loadIssuesStore();
    const index = list.findIndex((i) => i.id === issueId);
    if (index === -1) throw new Error('Issue not found');

    const newNote: InternalNote = {
      id: 'NOTE-' + Date.now(),
      authorName: author.name,
      authorDesignation: author.designation,
      authorId: author.id,
      content,
      createdAt: new Date().toISOString(),
      isConfidential: true
    };

    const updatedIssue: AuthorityIssue = {
      ...list[index],
      internalNotes: [newNote, ...list[index].internalNotes],
      lastUpdatedAt: new Date().toISOString()
    };

    list[index] = updatedIssue;
    saveIssuesStore(list);
    return updatedIssue;
  },

  async addCitizenUpdate(
    issueId: string,
    title: string,
    message: string,
    authorName: string,
    triggerStatus?: AuthorityIssueStatus
  ): Promise<AuthorityIssue> {
    const list = loadIssuesStore();
    const index = list.findIndex((i) => i.id === issueId);
    if (index === -1) throw new Error('Issue not found');

    const newUpdate: CitizenUpdate = {
      id: 'UPD-' + Date.now(),
      title,
      message,
      sentAt: new Date().toISOString(),
      authorName,
      deliveryStatus: 'Sent',
      triggeredStatusChange: triggerStatus
    };

    const updatedIssue: AuthorityIssue = {
      ...list[index],
      citizenUpdates: [newUpdate, ...list[index].citizenUpdates],
      status: triggerStatus || list[index].status,
      lastUpdatedAt: new Date().toISOString()
    };

    list[index] = updatedIssue;
    saveIssuesStore(list);
    return updatedIssue;
  },

  async resolveIssue(
    issueId: string,
    resolution: ResolutionData
  ): Promise<AuthorityIssue> {
    const list = loadIssuesStore();
    const index = list.findIndex((i) => i.id === issueId);
    if (index === -1) throw new Error('Issue not found');

    const nowIso = new Date().toISOString();
    const auditEvent: AuditEvent = {
      id: 'AUD-' + Date.now(),
      timestamp: nowIso,
      action: 'ISSUE_RESOLVED',
      actorName: resolution.resolvedByOfficer,
      actorRole: 'OFFICER',
      details: 'Resolution verified and official photographic evidence uploaded.'
    };

    const updatedIssue: AuthorityIssue = {
      ...list[index],
      status: 'Resolved',
      resolution,
      lastUpdatedAt: nowIso,
      auditTrail: [auditEvent, ...list[index].auditTrail]
    };

    list[index] = updatedIssue;
    saveIssuesStore(list);
    return updatedIssue;
  }
};
