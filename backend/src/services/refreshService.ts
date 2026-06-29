import * as refreshRepo from '../repositories/refreshRepository';
import { CreateRefreshTokenBody } from '../types';

export function upsert(data: CreateRefreshTokenBody) {
  return refreshRepo.upsert(data);
}

export function getBySub(sub: string) {
  return refreshRepo.getBySub(sub);
}

export function deleteBySub(sub: string) {
  return refreshRepo.deleteBySub(sub);
}
