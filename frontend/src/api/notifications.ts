import { client } from './client';
import { AppNotification } from '@/types';

export const notificationsApi = {
  getNotification: () => client.get<AppNotification[]>('/notifications').then((r) => r.data),
  markAsRead: (id: string) => client.patch<AppNotification[]>(`/notifications/${id}/markAsRead`).then((r) => r.data),
  markAllAsRead: () => client.patch<AppNotification[]>('/notifications/markAllAsRead').then((r) => r.data),
};
