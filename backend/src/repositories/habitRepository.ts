import { Habit } from '../models/habit';
import { CreateHabitBody, HabitQueryFilter } from '../types';

export async function create(data: CreateHabitBody) {
  return Habit.create(data);
}

export async function find(filter: HabitQueryFilter) {
  return Habit.find(filter);
}
