import { CreateFriendRequestData, FriendRequestStatus } from '../types';
import * as friendRepository from '../repositories/friendRepository';
import * as userRepository from '../repositories/userRepository';
import { Types } from 'mongoose';

export async function send(requesterId: Types.ObjectId, recipientEmail: string) {
  const recipient = await userRepository.getByEmail(recipientEmail);
  if (!recipient) {
    throw new Error('Recipient not found');
  }
  const recipientId = recipient._id;
  const status = FriendRequestStatus.Pending;
  return friendRepository.create({ recipientId, requesterId, status } as CreateFriendRequestData);
}

export async function getFriends(userId: Types.ObjectId) {
  return friendRepository.find(userId);
}
