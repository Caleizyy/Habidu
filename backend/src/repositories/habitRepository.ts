import { Habit } from '../models/habit';
import { CreateHabitBody, HabitQueryFilter, UpdateHabitBody, HabitByIdFilter } from '../types';

export async function create(data: CreateHabitBody) {
  return Habit.create(data);
}

export async function find(filter: HabitQueryFilter) {
  return Habit.find(filter);
}

export async function findById(filter: HabitByIdFilter) {
  return Habit.find(filter);
}

export async function updateById(_id: string, data: UpdateHabitBody) {
  return Habit.updateOne({ _id }, { $set: data });
}

export async function deleteById(_id: string) {
  return Habit.deleteOne({ _id });
}
