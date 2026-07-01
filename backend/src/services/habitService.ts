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
    if (group.owner.sub !== data.createdBy) {
      throw new Error('Only the group owner can create habits for the group');
    }
    const existing = await habitRepository.findByGroupId(data.groupId);
    if (existing) {
      throw new Error('This group already has a habit');
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

export async function updateById(id: string, filter: UpdateHabitBody) {
  if (filter.groupId) {
    const existing = await habitRepository.findByGroupId(filter.groupId);
    if (existing && existing._id.toString() !== id) {
      throw new Error('This group already has a habit');
    }
  }
  return habitRepository.updateById(id, filter);
}

export function deleteById(id: string) {
  return habitRepository.deleteById(id);
}
