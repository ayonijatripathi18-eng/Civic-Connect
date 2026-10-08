import { AuthorityNotification } from '../types/authority';
import { MOCK_NOTIFICATIONS } from '../data/authorityMockData';

/**
 * CIVIC-CONNECT Authority Notification Service (Frontend Layer)
 * 
 * Simulates backend push alerts & dispatches:
 * - GET   /api/authority/notifications
 * - PATCH /api/authority/notifications/:id/read
 * - POST  /api/authority/notifications/mark-all-read
 */

const STORAGE_KEY = 'civic_authority_notifications_store';

function loadNotificationsStore(): AuthorityNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Error reading authority notifications store', e);
  }
  return MOCK_NOTIFICATIONS;
}

function saveNotificationsStore(items: AuthorityNotification[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('Error writing authority notifications store', e);
  }
}

export const authorityNotificationService = {
  async getNotifications(): Promise<AuthorityNotification[]> {
    await new Promise((r) => setTimeout(r, 150));
    return loadNotificationsStore();
  },

  async markAsRead(id: string): Promise<AuthorityNotification[]> {
    await new Promise((r) => setTimeout(r, 100));
    const items = loadNotificationsStore();
    const updated = items.map((n) => (n.id === id ? { ...n, read: true } : n));
    saveNotificationsStore(updated);
    return updated;
  },

  async markAllAsRead(): Promise<AuthorityNotification[]> {
    await new Promise((r) => setTimeout(r, 100));
    const items = loadNotificationsStore();
    const updated = items.map((n) => ({ ...n, read: true }));
    saveNotificationsStore(updated);
    return updated;
  },

  async addNotification(
    data: Omit<AuthorityNotification, 'id' | 'timestamp' | 'read'>
  ): Promise<AuthorityNotification[]> {
    const items = loadNotificationsStore();
    const newNotif: AuthorityNotification = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      read: false,
      ...data
    };
    const updated = [newNotif, ...items];
    saveNotificationsStore(updated);
    return updated;
  }
};
