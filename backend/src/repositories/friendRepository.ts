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

export async function findRequests(userId: Types.ObjectId) {
  return Friend.find({
    recipientId: userId,
    status: FriendRequestStatus.Pending,
  })
    .populate('requesterId', 'firstName lastName email avatar')
    .populate('recipientId', 'firstName lastName email avatar');
}

export async function acceptRequest(requestId: Types.ObjectId) {
  return Friend.findByIdAndUpdate(requestId, { $set: { status: FriendRequestStatus.Accepted } });
}

export async function declineRequest(requestId: Types.ObjectId) {
  return Friend.findByIdAndUpdate(requestId, { $set: { status: FriendRequestStatus.Rejected } });
}

export async function removeFriend(requestId: Types.ObjectId) {
  return Friend.findByIdAndDelete(requestId);
}

export async function findById(requestId: Types.ObjectId) {
  return Friend.findById(requestId);
}
