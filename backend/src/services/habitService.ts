import { CreateHabitBody, HabitQueryFilter } from '../types';
import * as habitRepository from '../repositories/habitRepository';

export function create(data: CreateHabitBody) {
  return habitRepository.create(data);
}

export function find(filter: HabitQueryFilter) {
  return habitRepository.find(filter);
}
