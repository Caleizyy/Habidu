import { HabitLog } from '../models/habitLog';
import { CreateHabitLogBody } from '../types';

export async function create(data: CreateHabitLogBody) {
  return HabitLog.create({
    habitId: data.habitId,
    date: new Date(data.date),
    value: data.value,
  });
}

export async function findByHabitId(habitId: string, from?: Date, to?: Date) {
  const query: Record<string, unknown> = { habitId };

  if (from || to) {
    query.date = {};
    if (from) (query.date as Record<string, unknown>).$gte = from;
    if (to) (query.date as Record<string, unknown>).$lte = to;
  }

  return HabitLog.find(query).sort({ date: -1 });
}

export async function findOne(habitId: string, date: Date) {
  return HabitLog.findOne({
    habitId,
    date: {
      $gte: new Date(date.toISOString().split('T')[0]),
      $lt: new Date(new Date(date).setDate(date.getDate() + 1)),
    },
  });
}

export async function update(id: string, value: number) {
  return HabitLog.findByIdAndUpdate(id, { value }, { returnDocument: 'after' });
}

export async function delete_(id: string) {
  return HabitLog.findByIdAndDelete(id);
}
