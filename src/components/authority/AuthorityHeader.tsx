import React, { useState } from 'react';
import { AuthorityUser, AuthorityNotification } from '../../types/authority';
import {
  Bell,
  Search,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Menu,
  X
} from 'lucide-react';

interface AuthorityHeaderProps {
  currentUser: AuthorityUser;
  title: string;
  subtitle?: string;
  notifications: AuthorityNotification[];
  onNotificationClick: (notif: AuthorityNotification) => void;
  onViewAllNotifications: () => void;
  onSwitchToCitizen: () => void;
  onToggleMobileSidebar?: () => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export const AuthorityHeader: React.FC<AuthorityHeaderProps> = ({
  currentUser,
  title,
  subtitle,
  notifications,
  onNotificationClick,
  onViewAllNotifications,
  onSwitchToCitizen,
  onToggleMobileSidebar,
  searchQuery,
  onSearchChange
}) => {
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const unreadList = notifications.filter((n) => !n.read);
  const unreadCount = unreadList.length;

  return (
    <header className="pt-6 sm:pt-7 pb-5 sm:pb-6 px-6 sm:px-8 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* LEFT: HAMBURGER & PROMINENT TITLE */}
      <div className="flex items-center min-w-0 pr-4">
        {onToggleMobileSidebar && (
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="md:hidden mr-4 p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}

        <div className="min-w-0 py-0.5">
          <h1 className="text-2xl sm:text-[28px] font-black text-[#102a43] tracking-tight leading-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-[13px] text-[#64748b] font-medium mt-1 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* RIGHT: SEARCH, NOTIFICATIONS & ACTIONS */}
      <div className="flex items-center gap-3 shrink-0">
        {/* OPTIONAL SEARCH BAR */}
        {onSearchChange !== undefined && (
          <div className="hidden lg:flex items-center relative w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search tickets, IDs..."
              value={searchQuery || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:border-[#1769aa] outline-none transition-all"
            />
          </div>
        )}

        {/* NOTIFICATION BELL & DROPDOWN */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="w-10 h-10 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#dc3545] text-white font-extrabold text-[10px] rounded-full flex items-center justify-center ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-3.5 bg-[#102a43] text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-300" />
                  <span className="font-bold text-xs uppercase tracking-wider">
                    Administrative Alerts ({unreadCount} new)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifDropdownOpen(false)}
                  className="text-slate-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No active notifications.
                  </div>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        onNotificationClick(n);
                        setNotifDropdownOpen(false);
                      }}
                      className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                        !n.read ? 'bg-[#eaf3fb]/50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 shrink-0">
                          {n.priority === 'Critical' ? (
                            <AlertTriangle className="w-4 h-4 text-[#dc3545]" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-[#1769aa]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-xs font-bold text-[#102a43] leading-snug">
                              {n.title}
                            </span>
                            {!n.read && (
                              <span className="w-2 h-2 rounded-full bg-[#1769aa] shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">
                            {n.message}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {new Date(n.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={() => {
                    onViewAllNotifications();
                    setNotifDropdownOpen(false);
                  }}
                  className="text-xs font-bold text-[#1769aa] hover:underline"
                >
                  View All Notifications Roster &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SWITCH TO CITIZEN PORTAL */}
        <button
          type="button"
          onClick={onSwitchToCitizen}
          className="btn btn-secondary text-xs font-semibold py-2 px-3 sm:px-3.5 flex items-center gap-1.5"
          title="Return to Public Citizen Portal"
        >
          <Building2 className="w-3.5 h-3.5 text-[#1769aa]" />
          <span className="hidden sm:inline">Citizen Portal</span>
        </button>

        {/* OFFICER AVATAR BADGE */}
        <div
          className="w-10 h-10 rounded-xl bg-[#102a43] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs"
          title={`${currentUser.name} • ${currentUser.designation}`}
        >
          {currentUser.name.charAt(0)}
        </div>
      </div>
    </header>
  );
};
