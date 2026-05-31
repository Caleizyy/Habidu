import { Friend } from '../models/friend';
import { CreateFriendRequestData } from '../types';

export async function create(data: CreateFriendRequestData) {
  return Friend.create(data);
}
