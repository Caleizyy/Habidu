import { Schema, model, Document } from 'mongoose';

export interface IRefreshToken extends Document {
  sub: string;
  refreshToken: string;
}

const RefreshTokenSchema = new Schema<IRefreshToken>(
  {
    sub: { type: String, required: true, unique: true },
    refreshToken: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const RefreshToken = model<IRefreshToken>('RefreshToken', RefreshTokenSchema);
