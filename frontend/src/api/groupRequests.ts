import { client } from './client';
import type { Group } from '@/types/group';
import type { GroupInvite } from '@/types/groupInvites';

export const groupRequestsApi = {
  fetchGroupInvites: () => client.get<GroupInvite[]>('/groups/invites').then((r) => r.data),
  acceptGroupInvite: (id: string) => client.post<GroupInvite>(`/groups/${id}/accept`).then((r) => r.data),
  declineGroupInvite: (id: string) => client.post<GroupInvite>(`/groups/${id}/decline`).then((r) => r.data),
  leaveGroup: (id: string) => client.post<Group>(`/groups/${id}/leave`).then((r) => r.data),
};
