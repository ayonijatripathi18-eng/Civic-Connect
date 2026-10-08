import React, { useState, useEffect } from 'react';
import {
  AuthorityUser,
  AuthorityIssue,
  AuthorityIssueStatus,
  AuthorityNotification,
  AssignmentData,
  ResolutionData
} from '../../types/authority';
import { authorityAuthService } from '../../services/authorityAuthService';
import { authorityIssueService } from '../../services/authorityIssueService';
import { authorityNotificationService } from '../../services/authorityNotificationService';
import { AuthoritySidebar, AuthorityNavPage } from './AuthoritySidebar';
import { AuthorityHeader } from './AuthorityHeader';
import { AuthorityDashboardView } from './AuthorityDashboardView';
import { IssueFilters, FilterState } from './IssueFilters';
import { IssueTable } from './IssueTable';
import { IssueDetailView } from './IssueDetailView';
import { AuthorityMap } from './AuthorityMap';
import { AuthorityAnalyticsView } from './AuthorityAnalyticsView';
import { AuthorityCitizensView } from './AuthorityCitizensView';
import { AuthorityNotificationsView } from './AuthorityNotificationsView';
import { AuthorityProfileView } from './AuthorityProfileView';
import { AuthoritySettingsView } from './AuthoritySettingsView';
import { AuthorityLoginView } from './AuthorityLoginView';

interface AuthorityPortalProps {
  onSwitchToCitizen: () => void;
}

export const AuthorityPortal: React.FC<AuthorityPortalProps> = ({ onSwitchToCitizen }) => {
  // Authentication session
  const [currentUser, setCurrentUser] = useState<AuthorityUser | null>(() => {
    return authorityAuthService.validateSession();
  });

  // Portal active view & selected issue
  const [currentPage, setCurrentPage] = useState<AuthorityNavPage>('dashboard');
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  // Issues data & loading
  const [issues, setIssues] = useState<AuthorityIssue[]>([]);
  const [loadingIssues, setLoadingIssues] = useState(true);

  // Notifications
  const [notifications, setNotifications] = useState<AuthorityNotification[]>([]);

  // Mobile drawer
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Filters State for Issues Page
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'All',
    priority: 'All',
    status: 'All',
    ward: 'All',
    department: 'All',
    assignedOfficer: 'All',
    onlyOverdue: false,
    sortBy: 'date_desc'
  });

  // Routing helper
  const navigateTo = (
    page: AuthorityNavPage,
    issueId: string | null = null,
    statusFilter?: AuthorityIssueStatus | 'All'
  ) => {
    setCurrentPage(page);
    setSelectedIssueId(issueId);
    if (statusFilter) {
      setFilters((prev) => ({ ...prev, status: statusFilter }));
    }
    if (issueId) {
      window.location.hash = `authority/issues/${issueId}`;
    } else {
      window.location.hash = `authority/${page}`;
    }
  };

  // Sync hash on mount and hashchange
  useEffect(() => {
    if (!currentUser) {
      if (!window.location.hash.startsWith('#authority/login')) {
        window.location.hash = 'authority/login';
      }
      return;
    }

    const handleHash = () => {
      const raw = window.location.hash.replace(/^#\/?/, '');
      if (raw.startsWith('authority/')) {
        const parts = raw.split('/');
        const section = parts[1] as AuthorityNavPage;
        const subId = parts[2];

        if (section === ('login' as any)) {
          window.location.hash = 'authority/dashboard';
          return;
        }

        const validPages: AuthorityNavPage[] = [
          'dashboard',
          'issues',
          'map',
          'analytics',
          'citizens',
          'notifications',
          'profile',
          'settings'
        ];

        if (validPages.includes(section)) {
          setCurrentPage(section);
          if (section === 'issues' && subId) {
            setSelectedIssueId(subId);
          } else {
            setSelectedIssueId(null);
          }
        }
      } else if (raw === 'authority') {
        window.location.hash = 'authority/dashboard';
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [currentUser]);

  // Load issues and notifications on auth
  const loadData = async () => {
    setLoadingIssues(true);
    try {
      const [fetchedIssues, fetchedNotifs] = await Promise.all([
        authorityIssueService.getIssues(),
        authorityNotificationService.getNotifications()
      ]);
      setIssues(fetchedIssues);
      setNotifications(fetchedNotifs);
    } catch (err) {
      console.error('Error fetching authority datasets', err);
    } finally {
      setLoadingIssues(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  // Handlers for Issue Console
  const handleUpdateStatus = async (issueId: string, status: AuthorityIssueStatus) => {
    if (!currentUser) return;
    const updated = await authorityIssueService.updateStatus(
      issueId,
      status,
      currentUser.name,
      currentUser.role
    );
    setIssues((prev) => prev.map((i) => (i.id === issueId ? updated : i)));
  };

  const handleAssignIssue = async (issueId: string, assignment: AssignmentData) => {
    if (!currentUser) return;
    const updated = await authorityIssueService.assignIssue(issueId, assignment, currentUser.name);
    setIssues((prev) => prev.map((i) => (i.id === issueId ? updated : i)));
  };

  const handleAddNote = async (issueId: string, content: string) => {
    if (!currentUser) return;
    const updated = await authorityIssueService.addInternalNote(issueId, content, {
      name: currentUser.name,
      designation: currentUser.designation,
      id: currentUser.authorityId
    });
    setIssues((prev) => prev.map((i) => (i.id === issueId ? updated : i)));
  };

  const handleAddCitizenUpdate = async (
    issueId: string,
    title: string,
    message: string,
    triggerStatus?: AuthorityIssueStatus
  ) => {
    if (!currentUser) return;
    const updated = await authorityIssueService.addCitizenUpdate(
      issueId,
      title,
      message,
      currentUser.name,
      triggerStatus
    );
    setIssues((prev) => prev.map((i) => (i.id === issueId ? updated : i)));
  };

  const handleResolveIssue = async (issueId: string, resolution: ResolutionData) => {
    const updated = await authorityIssueService.resolveIssue(issueId, resolution);
    setIssues((prev) => prev.map((i) => (i.id === issueId ? updated : i)));
  };

  const handleMarkNotificationRead = async (id: string) => {
    const updated = await authorityNotificationService.markAsRead(id);
    setNotifications(updated);
  };

  const handleMarkAllNotificationsRead = async () => {
    const updated = await authorityNotificationService.markAllAsRead();
    setNotifications(updated);
  };

  const handleLogout = () => {
    authorityAuthService.logout();
    setCurrentUser(null);
    if (window.location.hash.startsWith('#authority')) {
      window.location.hash = 'authority/login';
    }
  };

  // If unauthenticated: Render dedicated Authority Login
  if (!currentUser) {
    return (
      <AuthorityLoginView
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setCurrentPage('dashboard');
        }}
        onSwitchToCitizen={onSwitchToCitizen}
      />
    );
  }

  // Wards list for filter
  const wards = Array.from(new Set(issues.map((i) => i.ward))).filter(Boolean);

  // Apply filters to issues list
  const filteredIssues = issues
    .filter((issue) => {
      const q = filters.search.toLowerCase();
      const matchSearch =
        !q ||
        issue.id.toLowerCase().includes(q) ||
        issue.title.toLowerCase().includes(q) ||
        issue.location.toLowerCase().includes(q) ||
        issue.department.toLowerCase().includes(q);

      const matchCat = filters.category === 'All' || issue.category === filters.category;
      const matchPri = filters.priority === 'All' || issue.priority === filters.priority;
      const matchStat = filters.status === 'All' || issue.status === filters.status;
      const matchWard = filters.ward === 'All' || issue.ward === filters.ward;
      const matchDept = filters.department === 'All' || issue.department === filters.department;
      const matchOverdue = !filters.onlyOverdue || (issue.isOverdue && issue.status !== 'Resolved');

      return matchSearch && matchCat && matchPri && matchStat && matchWard && matchDept && matchOverdue;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'date_desc') {
        return new Date(b.dateReported).getTime() - new Date(a.dateReported).getTime();
      }
      if (filters.sortBy === 'date_asc') {
        return new Date(a.dateReported).getTime() - new Date(b.dateReported).getTime();
      }
      if (filters.sortBy === 'priority_desc') {
        const priWeights: Record<string, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
        return (priWeights[b.priority] || 0) - (priWeights[a.priority] || 0);
      }
      if (filters.sortBy === 'cluster_desc') {
        const countA = a.cluster ? a.cluster.clusterCount : 1;
        const countB = b.cluster ? b.cluster.clusterCount : 1;
        return countB - countA;
      }
      return 0;
    });

  // Selected Issue for Detail View
  const selectedIssue = selectedIssueId ? issues.find((i) => i.id === selectedIssueId) : null;

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  // Header Title based on page (clean, uncluttered, no raw entities)
  const getPageHeaderInfo = () => {
    if (selectedIssue) {
      return {
        title: `Ticket ${selectedIssue.id}`,
        subtitle: `${selectedIssue.category} · ${selectedIssue.location}`
      };
    }
    switch (currentPage) {
      case 'dashboard':
        return {
          title: 'Municipal Dashboard',
          subtitle: `${currentUser.jurisdiction} · Operations Center`
        };
      case 'issues':
        return {
          title: 'Issue Tickets Roster',
          subtitle: `${filteredIssues.length} Complaints Dispatched`
        };
      case 'map':
        return {
          title: 'Municipal GIS Map',
          subtitle: 'Active Civic Incidents'
        };
      case 'analytics':
        return {
          title: 'Analytics & SLA',
          subtitle: 'Resolution & Ward Throughput'
        };
      case 'citizens':
        return {
          title: 'Citizens Directory',
          subtitle: 'Jurisdiction Reporting Profiles'
        };
      case 'notifications':
        return {
          title: 'Dispatch Alerts',
          subtitle: `${unreadNotifsCount} Pending System Notices`
        };
      case 'profile':
        return {
          title: 'Officer Profile',
          subtitle: currentUser.designation
        };
      case 'settings':
        return {
          title: 'Portal Settings',
          subtitle: 'Operational Preferences'
        };
      default:
        return { title: 'Authority Portal', subtitle: '' };
    }
  };

  const headerInfo = getPageHeaderInfo();

  return (
    <div className="min-h-screen bg-[#f6f8fa] text-[#172b4d] flex flex-col md:flex-row antialiased">
      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:block shrink-0">
        <AuthoritySidebar
          currentUser={currentUser}
          currentPage={currentPage}
          currentStatusFilter={filters.status}
          unreadNotifsCount={unreadNotifsCount}
          onNavigate={(page, statusFilter) => navigateTo(page, null, statusFilter)}
          onLogout={handleLogout}
          onSwitchToCitizen={onSwitchToCitizen}
        />
      </div>

      {/* MOBILE DRAWER — MATCHES INITIAL WEBSITE'S LIGHT CLEAN THEME */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="w-72 bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
            <AuthoritySidebar
              currentUser={currentUser}
              currentPage={currentPage}
              currentStatusFilter={filters.status}
              unreadNotifsCount={unreadNotifsCount}
              onNavigate={(page, statusFilter) => {
                setMobileSidebarOpen(false);
                navigateTo(page, null, statusFilter);
              }}
              onLogout={() => {
                setMobileSidebarOpen(false);
                handleLogout();
              }}
              onSwitchToCitizen={() => {
                setMobileSidebarOpen(false);
                onSwitchToCitizen();
              }}
            />
          </div>
          <div
            className="flex-1 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close Navigation"
          />
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <AuthorityHeader
          currentUser={currentUser}
          title={headerInfo.title}
          subtitle={headerInfo.subtitle}
          notifications={notifications}
          onNotificationClick={(notif) => {
            if (notif.linkedIssueId) {
              navigateTo('issues', notif.linkedIssueId);
            } else {
              navigateTo('notifications');
            }
          }}
          onViewAllNotifications={() => navigateTo('notifications')}
          onSwitchToCitizen={onSwitchToCitizen}
          onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
          searchQuery={currentPage === 'issues' && !selectedIssue ? filters.search : undefined}
          onSearchChange={
            currentPage === 'issues' && !selectedIssue
              ? (val) => setFilters((prev) => ({ ...prev, search: val }))
              : undefined
          }
        />

        {/* INNER PAGE BODY */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* IF AN ISSUE DETAIL IS SELECTED, SHOW DETAIL VIEW */}
          {selectedIssue ? (
            <IssueDetailView
              issue={selectedIssue}
              currentUser={currentUser}
              onBack={() => navigateTo('issues')}
              onUpdateStatus={(newStatus) => handleUpdateStatus(selectedIssue.id, newStatus)}
              onAssign={(assignment) => handleAssignIssue(selectedIssue.id, assignment)}
              onAddNote={(content) => handleAddNote(selectedIssue.id, content)}
              onAddCitizenUpdate={(title, message, triggerStatus) =>
                handleAddCitizenUpdate(selectedIssue.id, title, message, triggerStatus)
              }
              onResolve={(resolution) => handleResolveIssue(selectedIssue.id, resolution)}
            />
          ) : (
            <>
              {currentPage === 'dashboard' && (
                <AuthorityDashboardView
                  issues={issues}
                  onSelectIssue={(issue) => navigateTo('issues', issue.id)}
                  onNavigateToIssues={(statusFilter) => navigateTo('issues', null, statusFilter)}
                />
              )}

              {currentPage === 'issues' && (
                <div>
                  <IssueFilters
                    filters={filters}
                    onChange={setFilters}
                    onReset={() =>
                      setFilters({
                        search: '',
                        category: 'All',
                        priority: 'All',
                        status: 'All',
                        ward: 'All',
                        department: 'All',
                        assignedOfficer: 'All',
                        onlyOverdue: false,
                        sortBy: 'date_desc'
                      })
                    }
                    wards={wards}
                  />

                  <IssueTable
                    issues={filteredIssues}
                    onSelectIssue={(issue) => navigateTo('issues', issue.id)}
                    isLoading={loadingIssues}
                  />
                </div>
              )}

              {currentPage === 'map' && (
                <AuthorityMap
                  issues={issues}
                  onSelectIssue={(issue) => navigateTo('issues', issue.id)}
                />
              )}

              {currentPage === 'analytics' && <AuthorityAnalyticsView />}

              {currentPage === 'citizens' && (
                <AuthorityCitizensView
                  onSelectIssueId={(issueId) => navigateTo('issues', issueId)}
                />
              )}

              {currentPage === 'notifications' && (
                <AuthorityNotificationsView
                  notifications={notifications}
                  onMarkRead={handleMarkNotificationRead}
                  onMarkAllRead={handleMarkAllNotificationsRead}
                  onSelectIssueId={(issueId) => navigateTo('issues', issueId)}
                />
              )}

              {currentPage === 'profile' && <AuthorityProfileView currentUser={currentUser} />}

              {currentPage === 'settings' && <AuthoritySettingsView />}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AuthorityPortal;
