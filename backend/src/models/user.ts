import { Schema, model, Document } from 'mongoose';
import { UserRole } from '../types/index';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  sub: string;
  role: UserRole;
  avatar?: string;
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    sub: { type: String, required: true, unique: true },
    role: { type: String, enum: Object.values(UserRole), required: true },
    avatar: { type: String, required: false },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', UserSchema);
