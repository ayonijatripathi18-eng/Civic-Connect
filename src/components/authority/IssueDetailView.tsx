import React, { useState } from 'react';
import {
  AuthorityIssue,
  AuthorityIssueStatus,
  AuthorityIssuePriority,
  AssignmentData,
  ResolutionData,
  AuthorityUser
} from '../../types/authority';
import { StatusBadge, PriorityBadge } from './AuthorityStatusBadge';
import LocationMap from '../LocationMap';
import {
  MOCK_ROSTER_DEPARTMENTS,
  MOCK_ROSTER_OFFICERS
} from '../../data/authorityMockData';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Sparkles,
  Layers,
  User,
  Phone,
  Mail,
  Send,
  Lock,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  FileText,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Briefcase,
  History,
  ShieldCheck,
  Building2,
  Calendar
} from 'lucide-react';

interface IssueDetailViewProps {
  issue: AuthorityIssue;
  currentUser: AuthorityUser;
  onBack: () => void;
  onUpdateStatus: (newStatus: AuthorityIssueStatus) => Promise<void>;
  onAssign: (assignment: AssignmentData) => Promise<void>;
  onAddNote: (content: string) => Promise<void>;
  onAddCitizenUpdate: (title: string, message: string, triggerStatus?: AuthorityIssueStatus) => Promise<void>;
  onResolve: (resolution: ResolutionData) => Promise<void>;
}

export const IssueDetailView: React.FC<IssueDetailViewProps> = ({
  issue,
  currentUser,
  onBack,
  onUpdateStatus,
  onAssign,
  onAddNote,
  onAddCitizenUpdate,
  onResolve
}) => {
  // Tabs & collapsible states
  const [activeTab, setActiveTab] = useState<'overview' | 'assignment' | 'notes' | 'updates' | 'resolution' | 'audit'>('overview');
  const [clusterExpanded, setClusterExpanded] = useState(false);

  // Form states
  const [noteContent, setNoteContent] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  const [citizenUpdateTitle, setCitizenUpdateTitle] = useState('');
  const [citizenUpdateMessage, setCitizenUpdateMessage] = useState('');
  const [citizenUpdateTriggerStatus, setCitizenUpdateTriggerStatus] = useState<AuthorityIssueStatus>(issue.status);
  const [isSubmittingUpdate, setIsSubmittingUpdate] = useState(false);

  // Assignment Form State
  const [assignDept, setAssignDept] = useState(issue.assignment?.department || issue.department);
  const [assignTeam, setAssignTeam] = useState(issue.assignment?.team || 'Rapid Response Unit');
  const [assignOfficerId, setAssignOfficerId] = useState(issue.assignment?.officerId || MOCK_ROSTER_OFFICERS[0].id);
  const [isSubmittingAssign, setIsSubmittingAssign] = useState(false);

  // Resolution Form State
  const [resolutionDesc, setResolutionDesc] = useState('');
  const [resolutionPhoto, setResolutionPhoto] = useState<string>(
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'
  );
  const [resolutionRemarks, setResolutionRemarks] = useState('');
  const [isSubmittingResolution, setIsSubmittingResolution] = useState(false);

  // Action status loading
  const [statusLoading, setStatusLoading] = useState(false);

  const handleStatusChange = async (status: AuthorityIssueStatus) => {
    setStatusLoading(true);
    try {
      await onUpdateStatus(status);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    setIsSubmittingNote(true);
    try {
      await onAddNote(noteContent.trim());
      setNoteContent('');
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const handleSendCitizenUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenUpdateTitle.trim() || !citizenUpdateMessage.trim()) return;
    setIsSubmittingUpdate(true);
    try {
      await onAddCitizenUpdate(citizenUpdateTitle.trim(), citizenUpdateMessage.trim(), citizenUpdateTriggerStatus);
      setCitizenUpdateTitle('');
      setCitizenUpdateMessage('');
    } finally {
      setIsSubmittingUpdate(false);
    }
  };

  const handleSaveAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    const officer = MOCK_ROSTER_OFFICERS.find((o) => o.id === assignOfficerId) || MOCK_ROSTER_OFFICERS[0];
    setIsSubmittingAssign(true);
    try {
      await onAssign({
        department: assignDept,
        team: assignTeam,
        officerName: officer.name,
        officerId: officer.id,
        assignedBy: `${currentUser.name} (${currentUser.designation})`,
        assignedAt: new Date().toISOString()
      });
    } finally {
      setIsSubmittingAssign(false);
    }
  };

  const handleSaveResolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolutionDesc.trim()) return;
    setIsSubmittingResolution(true);
    try {
      await onResolve({
        resolvedAt: new Date().toISOString(),
        resolvedByOfficer: currentUser.name,
        officerId: currentUser.authorityId,
        description: resolutionDesc.trim(),
        beforePhotoUrl: issue.evidencePhotos[0] || '',
        afterPhotoUrl: resolutionPhoto,
        completionRemarks: resolutionRemarks.trim(),
        verifiedBySupervisor: true
      });
    } finally {
      setIsSubmittingResolution(false);
    }
  };

  const allStatuses: AuthorityIssueStatus[] = [
    'Reported',
    'Received',
    'Acknowledged',
    'Under Review',
    'Assigned',
    'In Progress',
    'Resolved',
    'Closed',
    'Rejected'
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* TOP BAR: BACK & QUICK ACTIONS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-bold text-slate-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Ticket Roster</span>
        </button>

        {/* STATUS TRANSITION BUTTONS */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500 mr-1">Status Transition:</span>
          {issue.status !== 'In Progress' && issue.status !== 'Resolved' && (
            <button
              type="button"
              disabled={statusLoading}
              onClick={() => handleStatusChange('In Progress')}
              className="btn btn-secondary py-1 px-3 text-xs font-bold border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100"
            >
              Start Field Work
            </button>
          )}

          {issue.status !== 'Resolved' && (
            <button
              type="button"
              disabled={statusLoading}
              onClick={() => setActiveTab('resolution')}
              className="btn btn-primary py-1 px-3 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Resolved & Upload Evidence</span>
            </button>
          )}

          {/* QUICK STATUS DROPDOWN */}
          <select
            value={issue.status}
            disabled={statusLoading}
            onChange={(e) => handleStatusChange(e.target.value as AuthorityIssueStatus)}
            className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 outline-none"
          >
            {allStatuses.map((s) => (
              <option key={s} value={s}>
                Status: {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* HEADER CARD */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                {issue.id}
              </span>
              <PriorityBadge priority={issue.priority} />
              <StatusBadge status={issue.status} />
              {issue.isOverdue && issue.status !== 'Resolved' && (
                <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold text-xs flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-red-600" />
                  SLA Breached ({issue.hoursElapsed}h elapsed)
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {issue.title}
            </h1>
          </div>

          <div className="text-right text-xs text-slate-500">
            <div>
              Reported on: <strong className="text-slate-700">{new Date(issue.dateReported).toLocaleString()}</strong>
            </div>
            <div>
              Target SLA: <strong className="text-slate-700">{issue.slaTargetHours} hours</strong>
            </div>
          </div>
        </div>

        {/* METADATA BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block font-semibold uppercase text-[10px]">Civic Category</span>
            <span className="font-bold text-slate-800">{issue.category}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold uppercase text-[10px]">Responsible Department</span>
            <span className="font-bold text-blue-800">{issue.department}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold uppercase text-[10px]">Jurisdiction Ward</span>
            <span className="font-bold text-slate-800">{issue.ward}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold uppercase text-[10px]">Assigned Officer</span>
            <span className="font-bold text-slate-800">
              {issue.assignment ? issue.assignment.officerName : 'Unassigned'}
            </span>
          </div>
        </div>
      </div>

      {/* CONSOLE NAVIGATION TABS */}
      <div className="flex border-b border-slate-200 overflow-x-auto space-x-2 text-xs font-bold">
        {[
          { key: 'overview', label: 'Ticket Overview & AI', icon: <FileText className="w-4 h-4" /> },
          { key: 'assignment', label: 'Department Assignment', icon: <Briefcase className="w-4 h-4" /> },
          {
            key: 'notes',
            label: `Internal Notes (${issue.internalNotes.length})`,
            icon: <Lock className="w-4 h-4 text-amber-600" />
          },
          {
            key: 'updates',
            label: `Citizen Updates (${issue.citizenUpdates.length})`,
            icon: <MessageSquare className="w-4 h-4 text-blue-600" />
          },
          { key: 'resolution', label: 'Resolution & Evidence', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> },
          { key: 'audit', label: 'Audit Trail', icon: <History className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as any)}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? 'border-blue-600 text-blue-700 bg-blue-50/30'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & EVIDENCE & AI CLUSTER */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT 2 COLUMNS: EVIDENCE, CLUSTERS, AI ANALYSIS */}
          <div className="lg:col-span-2 space-y-6">
            {/* CITIZEN EVIDENCE PANEL */}
            <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Primary Citizen Evidence & Description</span>
              </h2>

              <p className="text-sm text-slate-700 leading-relaxed mb-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 font-medium">
                "{issue.description}"
              </p>

              {issue.voiceTranscript && (
                <div className="mb-4 p-3 bg-blue-50/60 border border-blue-200 rounded-xl text-xs text-blue-900">
                  <div className="font-bold flex items-center gap-1.5 mb-1 text-blue-800">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" /> AI Speech-to-Text Transcription:
                  </div>
                  <p className="italic font-medium">"{issue.voiceTranscript}"</p>
                </div>
              )}

              <div>
                <span className="text-xs font-bold text-slate-500 block mb-2">Photographic Evidence</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {issue.evidencePhotos.map((photo, i) => (
                    <div key={i} className="rounded-xl overflow-hidden border border-slate-200 h-36 bg-slate-100 shadow-xs">
                      <img src={photo} alt={`Evidence ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* AI MULTIMODAL ANALYSIS PANEL */}
            <section className="bg-gradient-to-br from-indigo-50/60 to-blue-50/40 p-5 rounded-2xl border border-blue-200 shadow-xs">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>AI Triage & Reasoning Diagnostic</span>
                </h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Confidence: {Math.round(issue.aiAnalysis.confidence * 100)}%
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-blue-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Subcategory</span>
                  <span className="font-bold text-slate-800">{issue.aiAnalysis.subcategory}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-blue-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Urgency SLA</span>
                  <span className="font-bold text-indigo-700">{issue.aiAnalysis.urgency}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-blue-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Public Hazard Score</span>
                  <span className="font-extrabold text-red-600">{issue.aiAnalysis.hazardScore} / 100</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-blue-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Recommended Unit</span>
                  <span className="font-bold text-blue-800">{issue.aiAnalysis.recommendedAuthority}</span>
                </div>
              </div>

              <div className="text-xs text-slate-700 space-y-1 bg-white p-3.5 rounded-xl border border-blue-100">
                <div className="font-bold text-slate-900 mb-0.5">{issue.aiAnalysis.summary}</div>
                <p className="text-slate-600 leading-relaxed">{issue.aiAnalysis.reasoning}</p>
              </div>
            </section>

            {/* DUPLICATE / ISSUE CLUSTER PANEL */}
            {issue.cluster && (
              <section className="bg-white p-5 rounded-2xl border border-amber-200/90 shadow-xs">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-600" />
                    <h2 className="text-sm font-bold text-slate-900">
                      Geospatial Duplicate Cluster ({issue.cluster.clusterCount} Citizen Reports)
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setClusterExpanded(!clusterExpanded)}
                    className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1"
                  >
                    <span>{clusterExpanded ? 'Collapse Cluster' : 'Inspect Linked Reports'}</span>
                    {clusterExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <p className="text-xs text-slate-600 mb-3">
                  Our spatial deduplication algorithm merged {issue.cluster.clusterCount} individual complaints within a{' '}
                  <strong>{issue.cluster.clusterRadiusMeters}m radius</strong> into this single operational master ticket.
                </p>

                {clusterExpanded && (
                  <div className="mt-3 space-y-2 border-t border-amber-100 pt-3">
                    {issue.cluster.linkedReports.map((linked) => (
                      <div
                        key={linked.reportId}
                        className="p-3 bg-amber-50/40 border border-amber-200/80 rounded-xl text-xs flex justify-between items-start gap-3"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 font-mono font-bold text-blue-700">
                            <span>{linked.reportId}</span>
                            <span className="text-slate-500 font-sans font-normal">· {linked.citizenName}</span>
                            <span className="text-[10px] px-1.5 rounded bg-amber-100 text-amber-800 font-sans">
                              {linked.distanceFromPrimaryMeters}m away
                            </span>
                          </div>
                          <p className="text-slate-700 italic">"{linked.description}"</p>
                          <div className="text-[10px] text-slate-400">
                            Location: {linked.location} · {new Date(linked.submittedAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>

          {/* RIGHT COLUMN: LOCATION MAP & CITIZEN INFORMATION */}
          <div className="space-y-6">
            {/* LOCATION MAP */}
            <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Geospatial Coordinates</span>
              </h2>

              <div className="text-xs font-bold text-slate-800 mb-1">{issue.location}</div>
              <div className="text-[11px] font-mono text-slate-500 mb-3">
                Lat: {issue.latitude.toFixed(5)}, Lon: {issue.longitude.toFixed(5)} ({issue.ward})
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-200">
                <LocationMap
                  latitude={issue.latitude}
                  longitude={issue.longitude}
                  address={issue.location}
                  interactive={false}
                  showLocateButton={false}
                  height="220px"
                />
              </div>
            </section>

            {/* CITIZEN INFORMATION PANEL */}
            <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span>Primary Reporter Information</span>
              </h2>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Citizen Name</span>
                  <strong className="text-slate-900">{issue.citizen.name}</strong>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Verified Citizen</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Verified ID
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> Official Email
                  </span>
                  <span className="font-mono text-slate-700 truncate max-w-[170px]">{issue.citizen.email}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone
                  </span>
                  <span className="font-mono text-slate-700">{issue.citizen.phone}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Total Submissions</span>
                  <strong className="text-blue-800">{issue.citizen.totalReportsSubmitted} civic reports</strong>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* TAB 2: ASSIGNMENT MANAGEMENT */}
      {activeTab === 'assignment' && (
        <div className="max-w-2xl bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <span>Dispatch & Field Team Assignment</span>
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Assign or transfer responsibility for ticket {issue.id} to an authorized field unit or engineer.
          </p>

          <form onSubmit={handleSaveAssignment} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-700 mb-1">Target Municipal Department</label>
              <select
                value={assignDept}
                onChange={(e) => setAssignDept(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              >
                {MOCK_ROSTER_DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Operational Field Team / Squad</label>
              <input
                type="text"
                value={assignTeam}
                onChange={(e) => setAssignTeam(e.target.value)}
                placeholder="e.g. Asphalt Rapid Response Team"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Lead Officer In Charge</label>
              <select
                value={assignOfficerId}
                onChange={(e) => setAssignOfficerId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              >
                {MOCK_ROSTER_OFFICERS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name} ({o.dept} - {o.team})
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
              <span className="font-bold">Authorized Assignor:</span> {currentUser.name} ({currentUser.designation})
            </div>

            <button
              type="submit"
              disabled={isSubmittingAssign}
              className="btn btn-primary py-2 px-6 text-xs font-bold"
            >
              {isSubmittingAssign ? 'Updating Assignment...' : 'Save & Dispatch Assignment'}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: INTERNAL NOTES */}
      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Authority Confidentiality Notice:</strong> Internal notes are accessible only to authorized
                municipal officers. They are NEVER shared with the citizen.
              </div>
            </div>

            {issue.internalNotes.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                No internal notes on this issue yet. Add the first inspection observation below.
              </div>
            ) : (
              issue.internalNotes.map((note) => (
                <div key={note.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                      {note.authorName} <span className="text-slate-400 font-normal">({note.authorDesignation})</span>
                    </span>
                    <span className="text-[11px] text-slate-400">{new Date(note.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-slate-700 whitespace-pre-wrap">{note.content}</p>
                </div>
              ))
            )}
          </div>

          <div>
            <form onSubmit={handleSaveNote} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-600" /> Add Confidential Note
              </h3>
              <textarea
                rows={4}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Log site inspection findings, material requisitions, contractor delays..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none"
                required
              />
              <button
                type="submit"
                disabled={isSubmittingNote}
                className="btn btn-primary w-full py-2 text-xs font-bold"
              >
                {isSubmittingNote ? 'Saving Note...' : 'Record Internal Note'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: CITIZEN-FACING UPDATES */}
      {activeTab === 'updates' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-blue-50/70 border border-blue-200 p-4 rounded-xl text-xs text-blue-900 flex items-start gap-2">
              <MessageSquare className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <strong>Public Citizen Transparency:</strong> Messages published here will appear in the Citizen's
                "My Reports" tracking timeline and notification center.
              </div>
            </div>

            {issue.citizenUpdates.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                No citizen updates dispatched yet.
              </div>
            ) : (
              issue.citizenUpdates.map((upd) => (
                <div key={upd.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <strong className="text-blue-900 font-bold">{upd.title}</strong>
                    <span className="text-[11px] text-slate-400">{new Date(upd.sentAt).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-slate-700">{upd.message}</p>
                  <div className="text-[10px] text-slate-400 pt-1">
                    Dispatched by: {upd.authorName} · Delivery: <strong className="text-emerald-700">{upd.deliveryStatus}</strong>
                  </div>
                </div>
              ))
            )}
          </div>

          <div>
            <form onSubmit={handleSendCitizenUpdate} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-blue-600" /> Dispatch Citizen Notice
              </h3>
              <div>
                <label className="block text-[11px] text-slate-600 font-semibold mb-1">Headline</label>
                <input
                  type="text"
                  value={citizenUpdateTitle}
                  onChange={(e) => setCitizenUpdateTitle(e.target.value)}
                  placeholder="e.g. Field Crew Mobilized On Site"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 font-semibold mb-1">Citizen Notice Content</label>
                <textarea
                  rows={4}
                  value={citizenUpdateMessage}
                  onChange={(e) => setCitizenUpdateMessage(e.target.value)}
                  placeholder="Inform reporting citizens of inspection status, road diversions, estimated completion..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmittingUpdate}
                className="btn btn-primary w-full py-2 text-xs font-bold"
              >
                {isSubmittingUpdate ? 'Sending...' : 'Publish to Citizen Timeline'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 5: RESOLUTION EVIDENCE (BEFORE VS AFTER) */}
      {activeTab === 'resolution' && (
        <div className="max-w-3xl bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Official Resolution Verification & Sign-Off</span>
            </h2>
            <p className="text-xs text-slate-500">
              Provide photographic proof of completed repairs and formal supervisor sign-off before closing ticket.
            </p>
          </div>

          {/* BEFORE VS AFTER PHOTO COMPARISON */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider block mb-2">
                BEFORE: Citizen Evidence
              </span>
              <div className="h-44 rounded-lg overflow-hidden border border-slate-200 bg-slate-200">
                <img
                  src={issue.evidencePhotos[0]}
                  alt="Before Repair"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-2">
                AFTER: Resolution Evidence
              </span>
              <div className="h-44 rounded-lg overflow-hidden border border-emerald-300 bg-slate-100">
                <img
                  src={issue.resolution ? issue.resolution.afterPhotoUrl : resolutionPhoto}
                  alt="After Repair"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {issue.resolution ? (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Ticket Formally Resolved and Audited</span>
              </div>
              <p>"{issue.resolution.description}"</p>
              <div className="text-[11px] text-emerald-700 pt-1">
                Resolved by: {issue.resolution.resolvedByOfficer} on{' '}
                {new Date(issue.resolution.resolvedAt).toLocaleString()}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveResolution} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1">Official Resolution Description</label>
                <textarea
                  rows={3}
                  value={resolutionDesc}
                  onChange={(e) => setResolutionDesc(e.target.value)}
                  placeholder="Detail the engineering/sanitation action taken, equipment used, area cleared..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">After-Repair Photo URL (Proof of Work)</label>
                <input
                  type="text"
                  value={resolutionPhoto}
                  onChange={(e) => setResolutionPhoto(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Supervisor Remarks</label>
                <input
                  type="text"
                  value={resolutionRemarks}
                  onChange={(e) => setResolutionRemarks(e.target.value)}
                  placeholder="e.g. Surface compacted and tested for drainage flow."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingResolution}
                className="btn btn-primary py-2.5 px-6 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
              >
                {isSubmittingResolution ? 'Auditing & Resolving...' : 'Certify Resolution & Close Ticket'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB 6: AUDIT TRAIL / TIMELINE */}
      {activeTab === 'audit' && (
        <div className="max-w-3xl bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            <span>Immutable Administrative Audit Trail</span>
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Chronological record of every system event, AI triage calculation, and officer action on ticket {issue.id}.
          </p>

          <div className="relative border-l-2 border-slate-200 ml-4 space-y-6">
            {issue.auditTrail.map((ev) => (
              <div key={ev.id} className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-xs" />
                <div className="text-xs">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-slate-900">{ev.action}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(ev.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-600 font-medium">{ev.details}</p>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Actor: <strong className="text-slate-700">{ev.actorName}</strong> ({ev.actorRole})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
