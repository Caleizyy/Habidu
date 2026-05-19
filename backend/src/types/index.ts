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
  picture?: string;
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

export enum HabitCategory {
  Sports = 'sports',
  Health = 'health',
  Study = 'study',
  Skills = 'skills',
  Chores = 'chores',
}

export enum HabitDifficulty {
  Trivial = 'trivial',
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
}

export enum HabitFrequency {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
}

export interface CreateHabitBody {
  name: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  difficulty: HabitDifficulty;
  notes?: string;
}

export interface HabitQueryFilter {
  category?: HabitCategory;
  frequency?: HabitFrequency;
}
