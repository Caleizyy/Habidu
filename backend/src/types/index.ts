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
