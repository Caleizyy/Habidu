import { Habit, HabitLog } from '@/types/habit';
import { normalizeDateString } from '@/utils/habitHelpers';

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api';

export async function fetchHabits(): Promise<Habit[]> {
  const response = await fetch(`${API_BASE_URL}/habits`);
  if (!response.ok) throw new Error('Failed to fetch habits');
  return response.json();
}

export async function fetchLogsForHabit(habitId: string, from?: string, to?: string): Promise<HabitLog[]> {
  const params = new URLSearchParams();
  if (from) params.append('from', from);
  if (to) params.append('to', to);
  const url = `${API_BASE_URL}/habits/${habitId}/logs${params.toString() ? '?' + params.toString() : ''}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch logs');
  const logs = await response.json();
  // Normalize dates from ISO format to YYYY-MM-DD
  return logs.map((log: HabitLog) => ({
    ...log,
    date: normalizeDateString(log.date),
  }));
}

export async function createLog(habitId: string, date: string, value: number): Promise<HabitLog> {
  const response = await fetch(`${API_BASE_URL}/habits/${habitId}/logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, value }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create log');
  }
  const log = await response.json();
  // Normalize date in response
  return {
    ...log,
    date: normalizeDateString(log.date),
  };
}

export async function upsertLog(habitId: string, date: string, value: number): Promise<HabitLog> {
  const response = await fetch(`${API_BASE_URL}/habits/${habitId}/logs`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, value }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upsert log');
  }
  const log = await response.json();
  // Normalize date in response
  return {
    ...log,
    date: normalizeDateString(log.date),
  };
}

export async function updateLog(habitId: string, logId: string, value: number): Promise<HabitLog> {
  const response = await fetch(`${API_BASE_URL}/habits/${habitId}/logs/${logId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value }),
  });
  if (!response.ok) throw new Error('Failed to update log');
  const log = await response.json();
  // Normalize date in response
  return {
    ...log,
    date: normalizeDateString(log.date),
  };
}

export async function deleteLog(habitId: string, logId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/habits/${habitId}/logs/${logId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to delete log');
}

export async function createHabit(habit: {
  name: string;
  frequency: string;
  difficulty: string;
  category: string;
  targetValue: number;
  targetUnit: string;
  notes?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/habits`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(habit),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create habit');
  }
  const data = await response.json();
  return data;
}
