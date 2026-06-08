import { FriendRequestStatus } from '../types';
import * as friendRepository from '../repositories/friendRepository';
import * as userRepository from '../repositories/userRepository';
import { Types } from 'mongoose';

export async function send(requesterId: Types.ObjectId, recipientEmail: string) {
  const recipient = await userRepository.getByEmail(recipientEmail);
  if (!recipient) {
    throw new Error('Recipient not found');
  }
  if (requesterId.equals(recipient._id)) {
    throw new Error('Cannot send friend request to yourself');
  }
  const reverseRequest = await friendRepository.findPending(recipient._id, requesterId);
  if (reverseRequest) {
    throw new Error('A pending friend request already exists from the recipient to the requester'); // TODO: change this error to an accepted friends request in the accept friends request story
  }
  const existingRequest = await friendRepository.findPending(requesterId, recipient._id);
  if (existingRequest) {
    throw new Error('A pending friend request already exists from the requester to the recipient');
  }
  const recipientId = recipient._id;
  const status = FriendRequestStatus.Pending;
  return friendRepository.create({ recipientId, requesterId, status });
}

export async function getFriends(userId: Types.ObjectId) {
  const friends = await friendRepository.find(userId);
  return friends.map((friend) => {
    return friend.requesterId._id.equals(userId) ? friend.recipientId : friend.requesterId;
  });
}
