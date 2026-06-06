import * as habitLogRepository from '../repositories/habitLogRepository';
import { CreateHabitLogBody } from '../types';

export function create(data: CreateHabitLogBody) {
  return habitLogRepository.create(data);
}

export function findByHabitId(habitId: string, from?: Date, to?: Date) {
  return habitLogRepository.findByHabitId(habitId, from, to);
}

export function findOne(habitId: string, date: Date) {
  return habitLogRepository.findOne(habitId, date);
}

export function update(id: string, value: number) {
  return habitLogRepository.update(id, value);
}

export function remove(id: string) {
  return habitLogRepository.remove(id);
}

export function upsert(habitId: string, date: string, value: number) {
  return habitLogRepository.upsert(habitId, date, value);
}
