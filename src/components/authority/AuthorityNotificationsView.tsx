import React from 'react';
import { AuthorityNotification } from '../../types/authority';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Clock,
  ArrowRight,
  CheckCheck
} from 'lucide-react';

interface AuthorityNotificationsViewProps {
  notifications: AuthorityNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onSelectIssueId: (issueId: string) => void;
}

export const AuthorityNotificationsView: React.FC<AuthorityNotificationsViewProps> = ({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onSelectIssueId
}) => {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* HEADER BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <Bell className="w-4 h-4 text-blue-600" />
          <span>Active Alerts & Automated System Dispatches</span>
        </div>

        <button
          type="button"
          onClick={onMarkAllRead}
          className="btn btn-secondary py-1.5 px-3 text-xs font-semibold flex items-center gap-1.5"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* NOTIFICATIONS LIST */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
            No active administrative notifications.
          </div>
        ) : (
          notifications.map((n) => {
            const getIcon = () => {
              switch (n.type) {
                case 'SLA_BREACH_WARNING':
                  return <AlertTriangle className="w-5 h-5 text-red-600" />;
                case 'CLUSTER_MERGED':
                  return <Layers className="w-5 h-5 text-amber-600" />;
                case 'NEW_HIGH_PRIORITY':
                  return <AlertTriangle className="w-5 h-5 text-rose-600" />;
                default:
                  return <Bell className="w-5 h-5 text-blue-600" />;
              }
            };

            return (
              <div
                key={n.id}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 shadow-xs ${
                  !n.read
                    ? 'bg-blue-50/40 border-blue-200 shadow-blue-50/50'
                    : 'bg-white border-slate-200 opacity-85'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-2 rounded-xl bg-white border border-slate-200/80 shrink-0">
                    {getIcon()}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{n.title}</h4>
                      {!n.read && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-600 text-white uppercase">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2">
                      <span>{new Date(n.timestamp).toLocaleString()}</span>
                      {n.linkedIssueId && (
                        <>
                          <span>·</span>
                          <span className="font-mono text-blue-700 font-bold">Ticket: {n.linkedIssueId}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {n.linkedIssueId && (
                    <button
                      type="button"
                      onClick={() => onSelectIssueId(n.linkedIssueId!)}
                      className="btn btn-primary py-1 px-2.5 text-xs font-bold inline-flex items-center gap-1"
                    >
                      <span>Open Ticket</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}

                  {!n.read && (
                    <button
                      type="button"
                      onClick={() => onMarkRead(n.id)}
                      className="text-xs text-slate-400 hover:text-slate-700 px-2 py-1"
                      title="Mark as read"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
