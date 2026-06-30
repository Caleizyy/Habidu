import { CreateHabitBody, HabitQueryFilter, UpdateHabitBody, HabitByIdFilter } from '../types';
import * as habitRepository from '../repositories/habitRepository';
import * as groupRepository from '../repositories/groupRepository';
import { Types } from 'mongoose';

export async function create(data: CreateHabitBody) {
  // If groupId is provided, verify the creator is the group owner
  if (data.groupId) {
    const group = await groupRepository.findById(data.groupId);
    if (!group) {
      throw new Error('Group not found');
    }
    if (group.owner._id.toString() !== data.createdBy) {
      throw new Error('Only the group owner can create habits for the group');
    }
  }
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
