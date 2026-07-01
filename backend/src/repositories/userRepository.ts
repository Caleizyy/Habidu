import { Types } from 'mongoose';
import { User } from '../models/user';
import { CreateUserBody } from '../types';

export function getBySub(sub: string) {
  return User.findOne({ sub });
}

export function getById(id: string) {
  return User.findById(id);
}

export function create(data: CreateUserBody) {
  return User.create(data);
}

export function getByEmail(email: string) {
  return User.findOne({ email });
}

export function searchByEmail(email: string, excludedUserIds: Types.ObjectId[]) {
  return User.find({
    email: { $regex: email, $options: 'i' },
    _id: { $nin: excludedUserIds },
  }).collation({ locale: 'en', strength: 2 });
}
