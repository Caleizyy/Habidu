import { FriendRequestStatus, PopulatedUser } from '../types';
import * as friendRepository from '../repositories/friendRepository';
import * as userRepository from '../repositories/userRepository';
import { Types } from 'mongoose';

export async function sendRequest(requesterId: Types.ObjectId, recipientEmail: string) {
  const recipient = await userRepository.getByEmail(recipientEmail);
  if (!recipient) {
    throw new Error('Recipient not found');
  }
  if (requesterId.equals(recipient._id)) {
    throw new Error('Cannot send friend request to yourself');
  }
  const reverseRequest = await friendRepository.findPending(recipient._id, requesterId);
  if (reverseRequest) {
    return await friendRepository.acceptRequest(reverseRequest._id);
  }
  const existingRequest = await friendRepository.findPending(requesterId, recipient._id);
  if (existingRequest) {
    throw new Error('A pending friend request already exists from the requester to the recipient');
  }
  const status = FriendRequestStatus.Pending;
  return friendRepository.create({ recipientId: recipient._id, requesterId, status });
}

export async function getFriends(userId: Types.ObjectId) {
  const friends = await friendRepository.find(userId);

  return friends.map((friend) => {
    const otherUser = (friend.requesterId._id.equals(userId)
      ? friend.recipientId
      : friend.requesterId) as unknown as PopulatedUser;

    return {
      _id: otherUser._id,
      firstName: otherUser.firstName,
      lastName: otherUser.lastName,
      email: otherUser.email,
      avatar: otherUser.avatar,
      friendRequestId: friend._id,
    };
  });
}

export async function findRequest(userId: Types.ObjectId) {
  return friendRepository.findRequests(userId);
}

export async function acceptRequest(requestId: Types.ObjectId, userId: Types.ObjectId) {
  const request = await friendRepository.findById(requestId);
  if (!request) {
    throw new Error('Friend request not found');
  }
  if (!request.recipientId.equals(userId)) {
    throw new Error('Unidentified user attempted to accept friend request');
  }
  return friendRepository.acceptRequest(requestId);
}

export async function declineRequest(requestId: Types.ObjectId, userId: Types.ObjectId) {
  const request = await friendRepository.findById(requestId);
  if (!request) {
    throw new Error('Friend request not found');
  }
  if (!request.recipientId.equals(userId)) {
    throw new Error('Unidentified user attempted to decline friend request');
  }
  return friendRepository.declineRequest(requestId);
}

export async function removeFriend(requestId: Types.ObjectId, userId: Types.ObjectId) {
  const request = await friendRepository.findById(requestId);
  if (!request) {
    throw new Error('Friend request not found');
  }
  if (!request.recipientId.equals(userId) && !request.requesterId.equals(userId)) {
    throw new Error('Unidentified user attempted to modify friendship status');
  }
  return friendRepository.removeFriend(requestId);
}
