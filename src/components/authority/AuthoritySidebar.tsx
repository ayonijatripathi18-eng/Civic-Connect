import React, { useState } from 'react';
import { AuthorityUser, AuthorityIssueStatus } from '../../types/authority';
import {
  Landmark,
  LayoutDashboard,
  Inbox,
  MapPin,
  BarChart3,
  Users,
  Bell,
  UserCheck,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Building2
} from 'lucide-react';

export type AuthorityNavPage =
  | 'dashboard'
  | 'issues'
  | 'map'
  | 'analytics'
  | 'citizens'
  | 'notifications'
  | 'profile'
  | 'settings';

interface AuthoritySidebarProps {
  currentUser: AuthorityUser;
  currentPage: AuthorityNavPage;
  currentStatusFilter?: AuthorityIssueStatus | 'All';
  unreadNotifsCount: number;
  onNavigate: (page: AuthorityNavPage, statusFilter?: AuthorityIssueStatus | 'All') => void;
  onLogout: () => void;
  onSwitchToCitizen: () => void;
}

export const AuthoritySidebar: React.FC<AuthoritySidebarProps> = ({
  currentUser,
  currentPage,
  currentStatusFilter = 'All',
  unreadNotifsCount,
  onNavigate,
  onLogout,
  onSwitchToCitizen
}) => {
  const [issuesMenuOpen, setIssuesMenuOpen] = useState(true);

  const issueSubFilters: Array<{ label: string; filter: AuthorityIssueStatus | 'All' }> = [
    { label: 'All Issues', filter: 'All' },
    { label: 'New / Unreviewed', filter: 'Reported' },
    { label: 'Under Review', filter: 'Under Review' },
    { label: 'Assigned', filter: 'Assigned' },
    { label: 'In Progress', filter: 'In Progress' },
    { label: 'Resolved', filter: 'Resolved' },
    { label: 'Rejected', filter: 'Rejected' }
  ];

  return (
    <aside className="w-72 bg-white text-slate-700 flex flex-col h-screen sticky top-0 border-r border-slate-200 select-none z-30 shadow-xs">
      {/* BRAND HEADER — MATCHES INITIAL WEBSITE */}
      <div className="p-5 border-b border-slate-200 bg-white">
        <div
          className="brand"
          onClick={() => onNavigate('dashboard')}
          title="CIVIC-CONNECT Authority Operations"
        >
          <span className="brand-mark">
            <Landmark className="w-5 h-5 text-white" />
          </span>
          <div>
            <div className="text-lg font-extrabold tracking-tight text-[#102a43] leading-none">
              CIVIC-CONNECT
            </div>
            <div className="text-[10px] font-bold text-[#1769aa] tracking-widest uppercase mt-1">
              Authority Portal
            </div>
          </div>
        </div>

        {/* LOGGED IN OFFICER MINI BADGE */}
        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#102a43] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            {currentUser.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-[#102a43] truncate">{currentUser.name}</div>
            <div className="text-[11px] text-[#64748b] truncate">{currentUser.designation}</div>
          </div>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#eaf3fb] text-[#1769aa] border border-[#c8e1f5] shrink-0">
            {currentUser.role === 'SUPER_ADMIN' ? 'ADMIN' : 'OFFICER'}
          </span>
        </div>
      </div>

      {/* NAVIGATION LINKS */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 text-xs font-semibold custom-scrollbar">
        {/* DASHBOARD */}
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
            currentPage === 'dashboard'
              ? 'bg-[#eaf3fb] text-[#1769aa] font-bold shadow-xs'
              : 'text-[#52667d] hover:bg-slate-50 hover:text-[#102a43]'
          }`}
        >
          <LayoutDashboard className={`w-4 h-4 shrink-0 ${currentPage === 'dashboard' ? 'text-[#1769aa]' : 'text-slate-500'}`} />
          <span className="text-sm">Dashboard</span>
        </button>

        {/* ISSUES MANAGEMENT & SUBMENUS */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => {
              setIssuesMenuOpen(!issuesMenuOpen);
              if (currentPage !== 'issues') onNavigate('issues', 'All');
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left ${
              currentPage === 'issues'
                ? 'bg-slate-100/80 text-[#102a43] font-bold'
                : 'text-[#52667d] hover:bg-slate-50 hover:text-[#102a43]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Inbox className={`w-4 h-4 shrink-0 ${currentPage === 'issues' ? 'text-[#1769aa]' : 'text-slate-500'}`} />
              <span className="text-sm">Issue Tickets</span>
            </div>
            {issuesMenuOpen ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {issuesMenuOpen && (
            <div className="pl-6 pr-1 py-1 space-y-0.5 mt-0.5 border-l-2 border-slate-200 ml-4">
              {issueSubFilters.map((sub) => {
                const isActive = currentPage === 'issues' && currentStatusFilter === sub.filter;
                return (
                  <button
                    key={sub.filter}
                    type="button"
                    onClick={() => onNavigate('issues', sub.filter)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors text-xs ${
                      isActive
                        ? 'bg-[#eaf3fb] text-[#1769aa] font-bold'
                        : 'text-[#64748b] hover:text-[#102a43] hover:bg-slate-50'
                    }`}
                  >
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ISSUE MAP */}
        <button
          type="button"
          onClick={() => onNavigate('map')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
            currentPage === 'map'
              ? 'bg-[#eaf3fb] text-[#1769aa] font-bold shadow-xs'
              : 'text-[#52667d] hover:bg-slate-50 hover:text-[#102a43]'
          }`}
        >
          <MapPin className={`w-4 h-4 shrink-0 ${currentPage === 'map' ? 'text-[#1769aa]' : 'text-slate-500'}`} />
          <span className="text-sm">Municipal GIS Map</span>
        </button>

        {/* ANALYTICS */}
        <button
          type="button"
          onClick={() => onNavigate('analytics')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
            currentPage === 'analytics'
              ? 'bg-[#eaf3fb] text-[#1769aa] font-bold shadow-xs'
              : 'text-[#52667d] hover:bg-slate-50 hover:text-[#102a43]'
          }`}
        >
          <BarChart3 className={`w-4 h-4 shrink-0 ${currentPage === 'analytics' ? 'text-[#1769aa]' : 'text-slate-500'}`} />
          <span className="text-sm">Analytics & SLA</span>
        </button>

        {/* CITIZENS DIRECTORY */}
        <button
          type="button"
          onClick={() => onNavigate('citizens')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
            currentPage === 'citizens'
              ? 'bg-[#eaf3fb] text-[#1769aa] font-bold shadow-xs'
              : 'text-[#52667d] hover:bg-slate-50 hover:text-[#102a43]'
          }`}
        >
          <Users className={`w-4 h-4 shrink-0 ${currentPage === 'citizens' ? 'text-[#1769aa]' : 'text-slate-500'}`} />
          <span className="text-sm">Citizens Directory</span>
        </button>

        {/* NOTIFICATIONS */}
        <button
          type="button"
          onClick={() => onNavigate('notifications')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left ${
            currentPage === 'notifications'
              ? 'bg-[#eaf3fb] text-[#1769aa] font-bold shadow-xs'
              : 'text-[#52667d] hover:bg-slate-50 hover:text-[#102a43]'
          }`}
        >
          <div className="flex items-center gap-3">
            <Bell className={`w-4 h-4 shrink-0 ${currentPage === 'notifications' ? 'text-[#1769aa]' : 'text-slate-500'}`} />
            <span className="text-sm">Alerts & Dispatches</span>
          </div>
          {unreadNotifsCount > 0 && (
            <span className="bg-[#dc3545] text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full">
              {unreadNotifsCount}
            </span>
          )}
        </button>

        <div className="pt-3 pb-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1">
            Administration
          </div>

          {/* AUTHORITY PROFILE */}
          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-left ${
              currentPage === 'profile'
                ? 'bg-[#eaf3fb] text-[#1769aa] font-bold'
                : 'text-[#52667d] hover:bg-slate-50 hover:text-[#102a43]'
            }`}
          >
            <UserCheck className={`w-4 h-4 shrink-0 ${currentPage === 'profile' ? 'text-[#1769aa]' : 'text-slate-500'}`} />
            <span className="text-sm">Officer Profile</span>
          </button>

          {/* SETTINGS */}
          <button
            type="button"
            onClick={() => onNavigate('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-left ${
              currentPage === 'settings'
                ? 'bg-[#eaf3fb] text-[#1769aa] font-bold'
                : 'text-[#52667d] hover:bg-slate-50 hover:text-[#102a43]'
            }`}
          >
            <Settings className={`w-4 h-4 shrink-0 ${currentPage === 'settings' ? 'text-[#1769aa]' : 'text-slate-500'}`} />
            <span className="text-sm">Portal Settings</span>
          </button>
        </div>
      </nav>

      {/* FOOTER SWITCH & LOGOUT */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/60 space-y-2">
        <button
          type="button"
          onClick={onSwitchToCitizen}
          className="btn btn-secondary w-full text-xs font-semibold py-2 px-3 flex items-center justify-between"
          title="Switch to Public Citizen Portal"
        >
          <span className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#1769aa]" />
            <span>Citizen Portal</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors text-xs font-semibold"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Portal</span>
        </button>
      </div>
    </aside>
  );
};
