export enum HabitCategory {
  Sports = 'Sports',
  Health = 'Health',
  Study = 'Study',
  Skills = 'Skills',
  Chores = 'Chores',
}

export enum HabitFrequency {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
}

export enum HabitDifficulty {
  Trivial = 'Trivial',
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

export interface Habit {
  _id: string;
  name: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  difficulty: HabitDifficulty;
  targetValue: number;
  targetUnit: string;
  notes?: string;
}

export interface HabitLog {
  _id: string;
  habitId: string;
  date: string; // "YYYY-MM-DD"
  value: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PeriodCell {
  label: string;
  value: number; // sum of HabitLog.value for this period
  target: number; // sum of habit.targetValue for this period
}
