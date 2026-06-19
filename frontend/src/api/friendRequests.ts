import { client } from './client';
import type { FriendRequest } from '../types/index';

export const friendRequestsApi = {
  getRequests: () => client.get<FriendRequest[]>('/friends/requests').then((r) => r.data),
  acceptRequest: (id: string) => client.post(`/friends/${id}/accept`).then((r) => r.data),
  declineRequest: (id: string) => client.post(`/friends/${id}/decline`).then((r) => r.data),
  deleteFriend: (id: string) => client.delete(`/friends/${id}`).then((r) => r.data),
};
