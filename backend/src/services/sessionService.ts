import * as sessionRepo from '../repositories/sessionRepository';
import { CreateSessionBody } from '../types';

export function create(data: CreateSessionBody) {
  return sessionRepo.create(data);
}

export function getSessionById(id: string) {
  return sessionRepo.getSessionById(id);
}

export function updateSession(id: string, expiryDate: Date, accessToken: string) {
  return sessionRepo.updateSession(id, expiryDate, accessToken);
}
