import { HabitCategory, HabitDifficulty, HabitFrequency } from '../types';

export function isValidDifficulty(value: unknown): value is HabitDifficulty {
  return Object.values(HabitDifficulty).includes(value as HabitDifficulty);
}

export function isValidFrequency(value: unknown): value is HabitFrequency {
  return Object.values(HabitFrequency).includes(value as HabitFrequency);
}

export function isValidCategory(value: unknown): value is HabitCategory {
  return Object.values(HabitCategory).includes(value as HabitCategory);
}
