import { Types } from 'mongoose';
import * as userRepository from '../repositories/userRepository';
import { find, findAllPending } from '../repositories/friendRepository';

export async function searchUsers(name: string, loggedInUserId: Types.ObjectId) {
  const friends = await find(loggedInUserId);
  const pendingFriends = await findAllPending(loggedInUserId);
  const friendsIds = friends.map((friend) => friend._id);
  const pendingFriendsIds = pendingFriends.map((friend) => friend._id);
  const excludedUserIds = [...friendsIds, ...pendingFriendsIds, loggedInUserId];
  return userRepository.searchByEmail(name, excludedUserIds);
}
