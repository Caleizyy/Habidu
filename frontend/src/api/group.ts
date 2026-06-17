import { Group } from '@/types/group';

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Request failed');
  }
  return response.json();
}

export async function fetchGroups(): Promise<Group[]> {
  const response = await fetch(`${API_BASE_URL}/groups`, { credentials: 'include' });
  return handleResponse<Group[]>(response);
}

export async function fetchGroup(id: string): Promise<Group> {
  const response = await fetch(`${API_BASE_URL}/groups/${id}`, { credentials: 'include' });
  return handleResponse<Group>(response);
}

export async function createGroup(name: string): Promise<Group> {
  const response = await fetch(`${API_BASE_URL}/groups`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  return handleResponse<Group>(response);
}

export async function inviteMember(groupId: string, email: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/groups/${groupId}/invite`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Request failed');
  }
}
