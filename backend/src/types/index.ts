import { Types } from 'mongoose';

export enum UserRole {
  Admin = 'admin',
  Regular = 'regular',
}
export interface CreateUserBody {
  firstName: string;
  lastName: string;
  email: string;
  sub: string;
  role: UserRole;
  avatar?: string;
}
export interface CreateSessionBody {
  sessionId: string;
  sub: string;
  accessToken: string;
  tokenExpiresAt: Date;
}
export interface CreateRefreshTokenBody {
  sub: string;
  refreshToken: string;
}

export interface CreateFriendRequestBody {
  recipientEmail: string;
}

export interface CreateFriendRequestData {
  recipientId: Types.ObjectId;
  requesterId: Types.ObjectId;
  status: FriendRequestStatus;
}

export enum HabitCategory {
  Sports = 'Sports',
  Health = 'Health',
  Study = 'Study',
  Skills = 'Skills',
  Chores = 'Chores',
}

export enum HabitDifficulty {
  Trivial = 'Trivial',
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

export enum HabitFrequency {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
}

export enum FriendRequestStatus {
  Pending = 'pending',
  Accepted = 'accepted',
  Rejected = 'rejected',
  Blocked = 'blocked',
}

export interface CreateHabitBody {
  name: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  difficulty: HabitDifficulty;
  // Target value for the habit (e.g., 30 minutes, 5 km, 2 times)
  targetValue: number;
  // Custom unit string (e.g., 'min', 'km', 'liters', 'pages', etc.)
  targetUnit: string;
  notes?: string;
  createdBy: string;
}

export interface HabitQueryFilter {
  category?: HabitCategory;
  frequency?: HabitFrequency;
  createdBy?: string;
}

export interface CreateHabitLogBody {
  habitId: string;
  date: string;
  value: number;
}

export interface User {
  name: string;
  email: string;
  avatar?: string;
}
