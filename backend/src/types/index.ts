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
}

export interface HabitQueryFilter {
  category?: HabitCategory;
  frequency?: HabitFrequency;
}

export interface CreateHabitLogBody {
  habitId: string;
  date: string;
  value: number;
}
