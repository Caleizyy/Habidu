import { client } from './client';
import type { Group, GroupHabitResponse } from '@/types/group';
import type { Friend } from '@/types/index';

export const fetchGroups = () => client.get<Group[]>('/groups').then((r) => r.data);

export const fetchGroup = (id: string) => client.get<Group>(`/groups/${id}`).then((r) => r.data);

export const createGroup = (name: string) => client.post<Group>('/groups', { name }).then((r) => r.data);

export const fetchInviteableFriends = (groupId: string) =>
  client.get<Friend[]>(`/groups/${groupId}/inviteable-friends`).then((r) => r.data);

export const inviteMember = (groupId: string, email: string) =>
  client.post(`/groups/${groupId}/invite`, { email }).then((r) => r.data);

export const fetchGroupHabit = (groupId: string) =>
  client.get<GroupHabitResponse | null>(`/groups/${groupId}/habit`).then((r) => r.data);

export const logGroupHabitEntry = (groupId: string, date: string, value: number) =>
  client.post(`/groups/${groupId}/log`, { date, value }).then((r) => r.data);
