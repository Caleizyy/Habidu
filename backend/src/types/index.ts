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
  targetValue: number;
  targetUnit: string;
  notes?: string;
  createdBy: string;
  groupId?: string;
}

export interface HabitQueryFilter {
  category?: HabitCategory;
  frequency?: HabitFrequency;
  createdBy?: string;
  groupId?: string;
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

export enum GroupRequestStatus {
  Pending = 'pending',
  Accepted = 'accepted',
  Rejected = 'rejected',
}

export interface CreateGroupBody {
  name: string;
  owner: Types.ObjectId;
  members: Types.ObjectId[];
}

export interface CreateGroupRequestData {
  group: Types.ObjectId;
  inviter: Types.ObjectId;
  invitee: Types.ObjectId;
  status: GroupRequestStatus;
}

export interface PopulatedUser {
  _id: Types.ObjectId;
  sub: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

export interface PopulatedGroup {
  _id: Types.ObjectId;
  name: string;
  owner: PopulatedUser;
  members: PopulatedUser[];
}

export enum NotificationReadStatus {
  Read = 'read',
  Unread = 'unread',
}

export interface Notification {
  actorRef: Types.ObjectId;
  recipientId: Types.ObjectId;
  message: string;
  status: NotificationReadStatus;
  pageRef: string;
}

export interface CreateNotificationData {
  recipientId: Types.ObjectId;
  actorRef: Types.ObjectId;
  message: string;
  pageRef: string;
  status: NotificationReadStatus;
}

export interface CreateNotificationBody {
  recipientId: Types.ObjectId;
  actorRef: Types.ObjectId;
  message: string;
  pageRef: string;
}

export interface UpdateHabitBody {
  name?: string;
  category?: HabitCategory;
  frequency?: HabitFrequency;
  difficulty?: HabitDifficulty;
  notes?: string;
  targetUnit?: string;
  targetValue?: number;
  groupId?: string;
}

export interface HabitByIdFilter {
  _id: string;
  createdBy: string;
}
