import { RefreshToken } from '../models/refreshToken';
import { CreateRefreshTokenBody } from '../types';

export function upsert(data: CreateRefreshTokenBody) {
  return RefreshToken.updateOne({ sub: data.sub }, { $set: data }, { upsert: true });
}

export function getBySub(sub: string) {
  return RefreshToken.findOne({ sub });
}

export function deleteBySub(sub: string) {
  return RefreshToken.deleteOne({ sub });
}
