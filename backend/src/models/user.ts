import { Schema, model, Document } from 'mongoose';
import { UserRole } from '../types/index';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  name: string;
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
  { timestamps: true, toJSON: { virtuals: true } }
);

UserSchema.virtual('name').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

export const User = model<IUser>('User', UserSchema);
