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
  const { groupId, ...rest } = data;
  const update: Record<string, unknown> = { $set: rest };
  if (groupId === null) {
    update.$unset = { groupId: '' };
  } else if (groupId !== undefined) {
    (update.$set as Record<string, unknown>).groupId = groupId;
  }
  const response = await Habit.updateOne({ _id }, update);
  return response.acknowledged;
}

export async function findByGroupId(groupId: string) {
  return Habit.findOne({ groupId });
}

export async function deleteById(_id: string) {
  return Habit.deleteOne({ _id });
}
