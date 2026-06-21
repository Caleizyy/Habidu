import * as sessionRepo from '../repositories/sessionRepository';
import { CreateSessionBody } from '../types';

export function upsert(data: CreateSessionBody) {
  return sessionRepo.upsert(data);
}

export function getSessionById(id: string) {
  return sessionRepo.getSessionById(id);
}

export function updateSession(id: string, expiryDate: Date) {
  return sessionRepo.updateSession(id, expiryDate);
}

export function deleteBySessionId(id: string) {
  return sessionRepo.deleteBySessionId(id);
}
