import { Types } from 'mongoose';
import { GroupRequest } from '../models/groupRequest';
import { CreateGroupRequestData, GroupRequestStatus } from '../types';

export function create(data: CreateGroupRequestData) {
  return GroupRequest.create(data);
}

export function findPending(groupId: Types.ObjectId, inviteeId: Types.ObjectId) {
  return GroupRequest.findOne({ group: groupId, invitee: inviteeId, status: GroupRequestStatus.Pending });
}

export function findPendingByGroup(groupId: string) {
  return GroupRequest.find({ group: groupId, status: GroupRequestStatus.Pending }).populate('invitee', 'email');
}
