import * as refreshRepo from '../repositories/refreshRepository';
import { CreateRefreshTokenBody } from '../types';

export function create(data: CreateRefreshTokenBody) {
  return refreshRepo.create(data);
}

export function getBySub(sub: string) {
  return refreshRepo.getBySub(sub);
}
