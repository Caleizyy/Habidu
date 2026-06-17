import { Types } from 'mongoose';
import { Group } from '../models/group';
import { CreateGroupBody } from '../types';

const MEMBER_FIELDS = 'sub firstName lastName email avatar';

export function findByMember(userId: Types.ObjectId) {
  return Group.find({ members: userId }).populate('owner', MEMBER_FIELDS).populate('members', MEMBER_FIELDS);
}

export function findById(id: string) {
  return Group.findById(id).populate('owner', MEMBER_FIELDS).populate('members', MEMBER_FIELDS);
}

export function create(data: CreateGroupBody) {
  return Group.create(data);
}
