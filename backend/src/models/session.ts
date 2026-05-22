import { Schema, model, Document } from 'mongoose';

export interface ISession extends Document {
  sessionId: string;
  sub: string;
  accessToken: string;
  tokenExpiresAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    sessionId: { type: String, required: true, unique: true },
    sub: { type: String, required: true, unique: true },
    accessToken: { type: String, required: true, unique: true },
    tokenExpiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: true }
);

export const Session = model<ISession>('Session', SessionSchema);
