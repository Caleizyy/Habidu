import { Session } from '../models/session';
import { CreateSessionBody } from '../types';

export function upsert(data: CreateSessionBody) {
  return Session.updateOne({ sub: data.sub }, { $set: data }, { upsert: true });
}

export function getSessionById(id: string) {
  return Session.findOne({ sessionId: id });
}

export async function updateSession(id: string, expiryDate: Date) {
  return await Session.findOneAndUpdate(
    { sessionId: id },
    {
      tokenExpiresAt: new Date(expiryDate),
    },
    { new: true }
  );
}

export function deleteBySessionId(id: string) {
  return Session.deleteOne({ sessionId: id });
}
