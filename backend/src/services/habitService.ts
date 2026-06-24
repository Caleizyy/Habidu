import { CreateHabitBody, HabitQueryFilter, UpdateHabitBody, HabitByIdFilter } from '../types';
import * as habitRepository from '../repositories/habitRepository';

export function create(data: CreateHabitBody) {
  return habitRepository.create(data);
}

export function find(filter: HabitQueryFilter) {
  return habitRepository.find(filter);
}

export function findById(filter: HabitByIdFilter) {
  return habitRepository.findById(filter);
}

export function updateById(id: string, filter: UpdateHabitBody) {
  return habitRepository.updateById(id, filter);
}

export function deleteById(id: string) {
  return habitRepository.deleteById(id);
}
