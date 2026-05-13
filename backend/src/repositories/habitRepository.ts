import { Habit } from '../models/habit';
import { CreateHabitBody, HabitCategory, HabitFrequency } from '../types';

export async function createHabit(data: CreateHabitBody) {
  return Habit.create(data);
}

export async function getHabitsByCategory(category: HabitCategory) {
  return Habit.find({ category });
}

export async function getHabitsByFrequency(frequency: HabitFrequency) {
  return Habit.find({ frequency });
}
