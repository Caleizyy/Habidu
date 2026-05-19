import { RefreshToken } from '../models/refreshToken';
import { CreateRefreshTokenBody } from '../types';

export async function create(data: CreateRefreshTokenBody) {
  return RefreshToken.create(data);
}

export function getBySub(sub: string) {
  return RefreshToken.findOne({ sub: sub });
}
