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
  });
}
