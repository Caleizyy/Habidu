<<<<<<< HEAD
export interface Habit {
  id: string;
  name: string;
  frequency: string;
  difficulty: string;
  category: string;
  notes?: string;
=======
export enum HabitCategory {
  Sports = 'sports',
  Health = 'health',
  Study = 'study',
  Skills = 'skills',
  Chores = 'chores',
}

export enum HabitFrequency {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
}

export enum HabitUnit {
  Minutes = 'min',
  Hours = 'hours',
  Milliliters = 'ml',
  Liters = 'liters',
  Times = 'times',
  Pages = 'pages',
  Books = 'books',
  Kilometers = 'km',
}

export interface Habit {
  _id: string;
  name: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  targetValue: number;
  targetUnit: HabitUnit;
}

export interface HabitLog {
  _id: string;
  habitId: string;
  date: string; // "YYYY-MM-DD"
  value: number;
}

export interface PeriodCell {
  label: string;
  value: number; // sum of HabitLog.value for this period
  target: number; // sum of habit.targetValue for this period
>>>>>>> 33a588d (added constants and types for frontend)
}
