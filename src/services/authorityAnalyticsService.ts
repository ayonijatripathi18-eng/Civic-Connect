import { AuthorityNotification, AuthorityAnalyticsSummary } from '../types/authority';
import { MOCK_NOTIFICATIONS, MOCK_ANALYTICS_DATA, MOCK_CITIZENS_DIRECTORY } from '../data/authorityMockData';

/**
 * CIVIC-CONNECT Authority Notification Service
 * Targets future GET /api/authority/notifications & PATCH /api/authority/notifications/:id/read
 */
const NOTIF_KEY = 'civic_authority_notifications_store';

function loadNotifications(): AuthorityNotification[] {
  try {
    const raw = localStorage.getItem(NOTIF_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return MOCK_NOTIFICATIONS;
}

export const authorityNotificationService = {
  async getNotifications(): Promise<AuthorityNotification[]> {
    await new Promise((r) => setTimeout(r, 120));
    return loadNotifications();
  },

  async markAsRead(id: string): Promise<AuthorityNotification[]> {
    const list = loadNotifications();
    const updated = list.map((n) => (n.id === id ? { ...n, read: true } : n));
    try {
      localStorage.setItem(NOTIF_KEY, JSON.stringify(updated));
    } catch (e) { /* ignore */ }
    return updated;
  },

  async markAllAsRead(): Promise<AuthorityNotification[]> {
    const list = loadNotifications();
    const updated = list.map((n) => ({ ...n, read: true }));
    try {
      localStorage.setItem(NOTIF_KEY, JSON.stringify(updated));
    } catch (e) { /* ignore */ }
    return updated;
  }
};

/**
 * CIVIC-CONNECT Authority Analytics Service
 * Targets future GET /api/authority/analytics
 */
export const authorityAnalyticsService = {
  async getAnalytics(): Promise<AuthorityAnalyticsSummary> {
    await new Promise((r) => setTimeout(r, 200));
    return MOCK_ANALYTICS_DATA;
  },

  async getCitizensDirectory() {
    await new Promise((r) => setTimeout(r, 150));
    return MOCK_CITIZENS_DIRECTORY;
  }
};
