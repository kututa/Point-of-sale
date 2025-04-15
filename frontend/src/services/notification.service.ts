import api from './api';
import { Notification, NotificationPreferences } from '../types/notification';

export const notificationService = {
  async getAll() {
    const { data } = await api.get('/notifications');
    return data;
  },

  async markAsRead(id: string) {
    await api.post(`/notifications/${id}/read`);
  },

  async markAllAsRead() {
    await api.post('/notifications/read-all');
  },

  async getPreferences() {
    const { data } = await api.get('/notifications/preferences');
    return data;
  },

  async updatePreferences(preferences: Partial<NotificationPreferences>) {
    const { data } = await api.put('/notifications/preferences', preferences);
    return data;
  },
};