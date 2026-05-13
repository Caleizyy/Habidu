import { CreateHabitBody, HabitCategory, HabitFrequency } from '../types';
import * as habitRepository from '../repositories/habitRepository';

export function getByCategory(category: HabitCategory) {
  return habitRepository.getHabitsByCategory(category);
}

export function getByFrequency(frequency: HabitFrequency) {
  return habitRepository.getHabitsByFrequency(frequency);
}

export function create(data: CreateHabitBody) {
  return habitRepository.createHabit(data);
}
