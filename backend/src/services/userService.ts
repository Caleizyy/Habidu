import { Types } from 'mongoose';
import * as userRepository from '../repositories/userRepository';
import { find, findAllPending } from '../repositories/friendRepository';

export async function searchUsers(name: string, loggedInUserId: Types.ObjectId) {
  const [friends, pendingFriends] = await Promise.all([find(loggedInUserId), findAllPending(loggedInUserId)]);
  const friendsIds = friends.map((friend) =>
    friend.requesterId.equals(loggedInUserId) ? friend.recipientId : friend.requesterId
  );
  const pendingFriendsIds = pendingFriends.map((friend) =>
    friend.requesterId.equals(loggedInUserId) ? friend.recipientId : friend.requesterId
  );
  const excludedUserIds = [...friendsIds, ...pendingFriendsIds, loggedInUserId];
  return userRepository.searchByEmail(name, excludedUserIds);
}
