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

export function findPendingByInvitee(inviteeId: Types.ObjectId) {
  return GroupRequest.find({ invitee: inviteeId, status: GroupRequestStatus.Pending })
    .populate('group')
    .populate('inviter', 'firstName lastName email avatar');
}

export function acceptGroupRequest(groupId: string) {
  return GroupRequest.findByIdAndUpdate(groupId, { $set: { status: GroupRequestStatus.Accepted } });
}

export function declineGroupRequest(groupId: string) {
  return GroupRequest.findByIdAndUpdate(groupId, { $set: { status: GroupRequestStatus.Rejected } });
}

export async function findById(groupId: string) {
  return GroupRequest.findById(groupId);
}
