import { client } from './client';
import type { User } from '../types/index';

export const friendsApi = {
  getFriends: () => client.get<User[]>('/friends', { withCredentials: true }).then((r) => r.data),
  getRequestSearch: (query: string) =>
    client.get<User[]>(`/user/search?name=${encodeURIComponent(query)}`, { withCredentials: true }).then((r) => r.data),
  sendFriendRequest: (recipientEmail: string) =>
    client.post('/friends/requests', { recipientEmail }, { withCredentials: true }).then((r) => r.data),
};
