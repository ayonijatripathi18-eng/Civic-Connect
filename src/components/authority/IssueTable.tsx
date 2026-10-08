import React from 'react';
import { AuthorityIssue } from '../../types/authority';
import { StatusBadge, PriorityBadge } from './AuthorityStatusBadge';
import {
  MapPin,
  Clock,
  Layers,
  Briefcase,
  AlertTriangle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface IssueTableProps {
  issues: AuthorityIssue[];
  onSelectIssue: (issue: AuthorityIssue) => void;
  isLoading?: boolean;
}

export const IssueTable: React.FC<IssueTableProps> = ({
  issues,
  onSelectIssue,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
        <div className="animate-spin w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
        <p className="font-semibold text-sm">Loading municipal tickets...</p>
      </div>
    );
  }

  if (issues.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
        <AlertTriangle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <h3 className="font-bold text-base text-slate-800">No issues found</h3>
        <p className="text-xs text-slate-500 mt-1">
          No civic complaints match the active filters or jurisdiction query.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left min-w-[980px]">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Ticket ID</th>
              <th className="py-3 px-4">Civic Issue</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Cluster</th>
              <th className="py-3 px-4">Assigned To</th>
              <th className="py-3 px-4">Location / Ward</th>
              <th className="py-3 px-4">Reported</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {issues.map((issue) => {
              const hasCluster = issue.cluster && issue.cluster.clusterCount > 1;

              return (
                <tr
                  key={issue.id}
                  onClick={() => onSelectIssue(issue)}
                  className="hover:bg-blue-50/30 cursor-pointer transition-colors group"
                >
                  {/* ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                    {issue.id}
                  </td>

                  {/* TITLE & CATEGORY */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                      {issue.title}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <span className="font-medium text-slate-600">{issue.category}</span>
                      <span>·</span>
                      <span className="truncate">{issue.subcategory}</span>
                    </div>
                  </td>

                  {/* PRIORITY */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <PriorityBadge priority={issue.priority} size="sm" />
                  </td>

                  {/* STATUS */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge status={issue.status} size="sm" />
                  </td>

                  {/* CLUSTER COUNT */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {hasCluster ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        <Layers className="w-3 h-3 text-amber-600" />
                        <span>{issue.cluster.clusterCount} reports</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">1 report</span>
                    )}
                  </td>

                  {/* ASSIGNED DEPARTMENT & OFFICER */}
                  <td className="py-3.5 px-4 max-w-[180px]">
                    {issue.assignment ? (
                      <div>
                        <div className="font-bold text-slate-800 truncate">
                          {issue.assignment.officerName}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {issue.assignment.team}
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">Unassigned</span>
                    )}
                  </td>

                  {/* LOCATION & WARD */}
                  <td className="py-3.5 px-4 max-w-[200px]">
                    <div className="font-medium text-slate-800 truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{issue.location}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">
                      {issue.ward}
                    </div>
                  </td>

                  {/* DATE & OVERDUE */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="text-slate-700 font-medium">
                      {new Date(issue.dateReported).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    {issue.isOverdue && issue.status !== 'Resolved' && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-red-600 font-bold">
                        <Clock className="w-3 h-3" /> Overdue
                      </span>
                    )}
                  </td>

                  {/* ACTION */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      className="btn btn-secondary py-1 px-2.5 text-xs font-semibold group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all inline-flex items-center gap-1"
                    >
                      <span>Manage</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
        <span>Showing {issues.length} active civic issues</span>
        <span className="font-medium">Click any row to open the complete administrative management console</span>
      </div>
    </div>
  );
};
