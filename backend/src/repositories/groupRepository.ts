import { Types } from 'mongoose';
import { Group } from '../models/group';
import { CreateGroupBody, PopulatedGroup } from '../types';

const MEMBER_FIELDS = 'sub firstName lastName email avatar';

export async function findByMember(userId: Types.ObjectId): Promise<PopulatedGroup[]> {
  const docs = await Group.find({ members: userId })
    .populate('owner', MEMBER_FIELDS)
    .populate('members', MEMBER_FIELDS);
  return docs as unknown as PopulatedGroup[];
}

export async function findById(id: string): Promise<PopulatedGroup | null> {
  const doc = await Group.findById(id).populate('owner', MEMBER_FIELDS).populate('members', MEMBER_FIELDS);
  return doc as unknown as PopulatedGroup | null;
}

export function create(data: CreateGroupBody) {
  return Group.create(data);
}

export function addMember(groupId: string, userId: Types.ObjectId) {
  return Group.findByIdAndUpdate(groupId, { $addToSet: { members: userId } });
}

export function removeMember(groupId: string, userId: Types.ObjectId) {
  return Group.findByIdAndUpdate(groupId, { $pull: { members: userId } });
}
