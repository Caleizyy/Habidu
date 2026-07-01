import { User } from '@/types/index';

export interface Group {
  _id: string;
  name: string;
  owner: string;
  members: User[];
  pendingInvites: string[];
}

export interface GroupHabitLog {
  _id: string;
  userId?: string;
  value: number;
  date: string;
}

export interface GroupHabit {
  _id: string;
  name: string;
  targetValue: number;
  targetUnit: string;
  frequency: string;
}

export interface GroupHabitResponse {
  habit: GroupHabit;
  logs: GroupHabitLog[];
}
