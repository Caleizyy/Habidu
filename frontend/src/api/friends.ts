import { client } from './client';
import type { User } from '../types/index';

export const friendsApi = {
  getFriends: () => client.get<User[]>('/friends', { withCredentials: true }).then((r) => r.data),
  getRequestSearch: (query: string) =>
    client.get<User[]>(`/user/search?name=${query}`, { withCredentials: true }).then((r) => r.data),
  sendFriendRequest: (email: string) =>
    client.post('/friends', { email }, { withCredentials: true }).then((r) => r.data),
};
