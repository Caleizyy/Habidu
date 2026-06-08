import { Types } from 'mongoose';
import * as userRepository from '../repositories/userRepository';
import * as friendRepository from '../repositories/friendRepository';

export async function searchUsers(email: string, currentUserId: Types.ObjectId) {
  const [friends, pendingFriends] = await Promise.all([
    friendRepository.find(currentUserId),
    friendRepository.findAllPending(currentUserId),
  ]);
  const friendsIds = friends.map((friend) =>
    friend.requesterId.equals(currentUserId) ? friend.recipientId : friend.requesterId
  );
  const pendingFriendsIds = pendingFriends.map((friend) =>
    friend.requesterId.equals(currentUserId) ? friend.recipientId : friend.requesterId
  );
  const excludedUserIds = [...friendsIds, ...pendingFriendsIds, currentUserId];
  return userRepository.searchByEmail(email, excludedUserIds);
}
