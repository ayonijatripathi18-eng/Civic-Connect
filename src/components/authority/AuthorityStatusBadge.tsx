import React from 'react';
import { AuthorityIssueStatus, AuthorityIssuePriority } from '../../types/authority';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Wrench,
  XCircle,
  Eye,
  Send,
  UserCheck
} from 'lucide-react';

export const StatusBadge: React.FC<{ status: AuthorityIssueStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'md'
}) => {
  const getStyle = () => {
    switch (status) {
      case 'Reported':
        return {
          bg: 'bg-red-50 text-red-700 border-red-200',
          icon: <AlertCircle className="w-3.5 h-3.5 text-red-600" />
        };
      case 'Received':
        return {
          bg: 'bg-orange-50 text-orange-700 border-orange-200',
          icon: <Clock className="w-3.5 h-3.5 text-orange-600" />
        };
      case 'Acknowledged':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: <Eye className="w-3.5 h-3.5 text-blue-600" />
        };
      case 'Under Review':
        return {
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: <Clock className="w-3.5 h-3.5 text-purple-600" />
        };
      case 'Assigned':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          icon: <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
        };
      case 'In Progress':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <Wrench className="w-3.5 h-3.5 text-amber-600" />
        };
      case 'Resolved':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        };
      case 'Closed':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-300',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
        };
      case 'Rejected':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          icon: <Clock className="w-3.5 h-3.5 text-slate-500" />
        };
    }
  };

  const style = getStyle();
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${style.bg} ${padding}`}
    >
      {style.icon}
      <span>{status}</span>
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: AuthorityIssuePriority; size?: 'sm' | 'md' }> = ({
  priority,
  size = 'md'
}) => {
  const getStyle = () => {
    switch (priority) {
      case 'Critical':
        return {
          bg: 'bg-rose-600 text-white border-rose-700 shadow-sm animate-pulse',
          dot: 'bg-white'
        };
      case 'High':
        return {
          bg: 'bg-red-50 text-red-700 border-red-200',
          dot: 'bg-red-500'
        };
      case 'Medium':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500'
        };
      case 'Low':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500'
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          dot: 'bg-slate-400'
        };
    }
  };

  const style = getStyle();
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-md border ${style.bg} ${padding}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      <span>{priority}</span>
    </span>
  );
};
