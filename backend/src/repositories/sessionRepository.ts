import { Session } from '../models/session';
import { CreateSessionBody } from '../types';

export function create(data: CreateSessionBody) {
  return Session.create(data);
}

export function getSessionById(id: string) {
  return Session.findOne({ sessionId: id });
}

export async function updateSession(id: string, expiryDate: Date, accessToken: string) {
  return await Session.findByIdAndUpdate(
    id,
    {
      accessToken: accessToken,
      expiresAt: new Date(expiryDate),
    },
    { new: true }
  );
}
