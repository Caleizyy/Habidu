import { User } from '../models/user';
import { CreateUserBody } from '../types';

export function getBySub(sub: string) {
  return User.findOne({ sub: sub });
}

export function create(data: CreateUserBody) {
  return User.create(data);
}

export function getByEmail(email: string) {
  return User.findOne({ email });
}
