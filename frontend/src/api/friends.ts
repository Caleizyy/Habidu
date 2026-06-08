import { client } from './client';
import type { User } from '../types/index';

export const friendsApi = {
  getFriends: () => client.get<User[]>('/friends').then((r) => r.data),
  getRequestSearch: (query: string) =>
    client
      .get<User[]>(`/user/search?email=${encodeURIComponent(query)}`, { withCredentials: true })
      .then((r) => r.data),
  sendFriendRequest: (recipientEmail: string) =>
    client.post('/friends/requests', { recipientEmail }, { withCredentials: true }).then((r) => r.data),
};
