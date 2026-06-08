import { Friend } from '../models/friend';
import { CreateFriendRequestData, FriendRequestStatus } from '../types';
import { Types } from 'mongoose';

export async function create(data: CreateFriendRequestData) {
  return Friend.create(data);
}

export async function find(userId: Types.ObjectId) {
  return Friend.find({
    $or: [{ requesterId: userId }, { recipientId: userId }],
    status: FriendRequestStatus.Accepted,
  })
    .populate('requesterId', 'firstName lastName email avatar')
    .populate('recipientId', 'firstName lastName email avatar');
}

export async function findPending(requesterId: Types.ObjectId, recipientId: Types.ObjectId) {
  return Friend.findOne({
    requesterId,
    recipientId,
    status: FriendRequestStatus.Pending,
  });
}

export async function findAllPending(userId: Types.ObjectId) {
  return Friend.find({
    $or: [{ requesterId: userId }, { recipientId: userId }],
    status: FriendRequestStatus.Pending,
  });
}
