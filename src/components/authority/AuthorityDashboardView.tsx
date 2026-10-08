import React from 'react';
import { AuthorityIssue, AuthorityIssueStatus } from '../../types/authority';
import { AuthorityStatCard } from './AuthorityStatCard';
import { StatusBadge, PriorityBadge } from './AuthorityStatusBadge';
import {
  Inbox,
  AlertTriangle,
  Clock,
  Wrench,
  CheckCircle2,
  Layers,
  ArrowRight,
  TrendingUp,
  MapPin,
  Briefcase
} from 'lucide-react';

interface AuthorityDashboardViewProps {
  issues: AuthorityIssue[];
  onSelectIssue: (issue: AuthorityIssue) => void;
  onNavigateToIssues: (statusFilter?: AuthorityIssueStatus | 'All') => void;
}

export const AuthorityDashboardView: React.FC<AuthorityDashboardViewProps> = ({
  issues,
  onSelectIssue,
  onNavigateToIssues
}) => {
  const total = issues.length;
  const newUnreviewed = issues.filter((i) => i.status === 'Reported').length;
  const highPriority = issues.filter((i) => i.priority === 'Critical' || i.priority === 'High').length;
  const underReview = issues.filter((i) => i.status === 'Under Review' || i.status === 'Received').length;
  const inProgress = issues.filter((i) => i.status === 'In Progress' || i.status === 'Assigned').length;
  const resolved = issues.filter((i) => i.status === 'Resolved' || i.status === 'Closed').length;
  const overdue = issues.filter((i) => i.isOverdue && i.status !== 'Resolved').length;

  const totalClusters = issues.reduce(
    (acc, curr) => acc + (curr.cluster && curr.cluster.clusterCount > 1 ? curr.cluster.clusterCount - 1 : 0),
    0
  );

  // Urgent tickets requiring immediate attention
  const urgentTickets = issues
    .filter((i) => (i.priority === 'Critical' || i.isOverdue) && i.status !== 'Resolved')
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* KPI METRIC CARDS ROW 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AuthorityStatCard
          label="Total Active Tickets"
          value={total}
          subtext="Under municipal jurisdiction"
          icon={<Inbox className="w-5 h-5 text-blue-600" />}
          onClick={() => onNavigateToIssues('All')}
        />
        <AuthorityStatCard
          label="New / Unreviewed"
          value={newUnreviewed}
          subtext="Pending engineering triage"
          icon={<Clock className="w-5 h-5 text-red-600" />}
          variant="danger"
          badge="Action Req."
          onClick={() => onNavigateToIssues('Reported')}
        />
        <AuthorityStatCard
          label="High / Critical Urgency"
          value={highPriority}
          subtext="Immediate road & life safety hazards"
          icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
          variant="warning"
          onClick={() => onNavigateToIssues('All')}
        />
        <AuthorityStatCard
          label="Active Overdue SLA"
          value={overdue}
          subtext="Resolution SLA target breached"
          icon={<AlertTriangle className="w-5 h-5 text-rose-600" />}
          variant="danger"
          badge="Escalated"
        />
      </div>

      {/* KPI METRIC CARDS ROW 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AuthorityStatCard
          label="Under Review / Assigned"
          value={underReview + issues.filter((i) => i.status === 'Assigned').length}
          subtext="Dispatched to department teams"
          icon={<Briefcase className="w-5 h-5 text-indigo-600" />}
          variant="info"
          onClick={() => onNavigateToIssues('Assigned')}
        />
        <AuthorityStatCard
          label="Field Operations In Progress"
          value={inProgress}
          subtext="Ground repair crews deployed"
          icon={<Wrench className="w-5 h-5 text-amber-600" />}
          variant="warning"
          onClick={() => onNavigateToIssues('In Progress')}
        />
        <AuthorityStatCard
          label="Resolved & Certified"
          value={resolved}
          subtext="Photographic evidence uploaded"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          variant="success"
          onClick={() => onNavigateToIssues('Resolved')}
        />
      </div>

      {/* ACTIONABLE ROW: URGENT ACTION & DEDUPLICATION BANNER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CRITICAL / OVERDUE TICKETS REQUIRING ATTENTION */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#dc3545]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#102a43]">
                Tickets Requiring Immediate Attention
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToIssues('All')}
              className="text-xs font-bold text-[#1769aa] hover:underline flex items-center gap-1"
            >
              <span>View Roster</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {urgentTickets.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Zero urgent escalations at this moment. All critical SLAs are currently compliant.
              </div>
            ) : (
              urgentTickets.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectIssue(item)}
                  className="p-3.5 rounded-xl border border-[#e2e8f0] bg-white hover:bg-slate-50 hover:border-[#1769aa]/40 transition-all cursor-pointer flex justify-between items-center gap-4 group shadow-2xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#1769aa]">{item.id}</span>
                      <PriorityBadge priority={item.priority} size="sm" />
                      <StatusBadge status={item.status} size="sm" />
                    </div>
                    <h4 className="text-xs font-bold text-[#102a43] truncate group-hover:text-[#1769aa] transition-colors">
                      {item.title}
                    </h4>
                    <div className="text-[11px] text-[#64748b] flex items-center gap-1.5 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{item.location}</span>
                      <span>·</span>
                      <span className="text-[#1769aa] font-semibold">{item.department}</span>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="btn btn-secondary py-1 px-2.5 text-xs font-bold inline-flex items-center gap-1 group-hover:bg-[#102a43] group-hover:text-white group-hover:border-[#102a43]">
                      <span>Console</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* CLUSTER AI IMPACT & RECENT ACTIVITY */}
        <div className="space-y-6">
          {/* CLUSTER BENEFIT CARD */}
          <div className="bg-[#fff7e6] p-5 rounded-2xl border border-[#fed7aa] shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-[#d97706] font-bold text-xs uppercase tracking-wider">
              <Layers className="w-4 h-4 text-[#d97706]" />
              <span>AI Cluster Detection Active</span>
            </div>
            <div className="text-2xl font-extrabold text-[#102a43]">
              {totalClusters} Duplicate Complaints Grouped
            </div>
            <p className="text-xs text-[#92400e] leading-relaxed font-medium">
              Citizens reporting the same pothole, leak, or electrical outage are automatically deduplicated into
              single master tickets.
            </p>
          </div>

          {/* QUICK ROSTER LINK */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Department Operations
            </h4>
            <div className="space-y-2 text-xs">
              <button
                type="button"
                onClick={() => onNavigateToIssues('In Progress')}
                className="w-full flex justify-between items-center p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 font-semibold text-slate-700 transition-colors"
              >
                <span>Active Field Dispatches</span>
                <span className="font-bold text-amber-700">{inProgress}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateToIssues('Reported')}
                className="w-full flex justify-between items-center p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 font-semibold text-slate-700 transition-colors"
              >
                <span>Awaiting Engineering Acknowledgment</span>
                <span className="font-bold text-red-700">{newUnreviewed}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateToIssues('Resolved')}
                className="w-full flex justify-between items-center p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 font-semibold text-slate-700 transition-colors"
              >
                <span>Completed Resolutions Archive</span>
                <span className="font-bold text-emerald-700">{resolved}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
