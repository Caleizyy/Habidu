import { Document, Schema, model } from 'mongoose';

export interface User extends Document {
  firstName: string;
  lastName: string;
  avatar?: string; //not sure about this one yet, string if pointing to URL, something different if we allow to choose image from our library or allowing to upload
  role: 'user' | 'admin';
  authProviders: {
    google?: { sub: string; email: string };
    facebook?: { sub: string; email: string };
  };
  settings: {
    emailNotifications: boolean;
    pushNotifications: boolean;
  };
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<User>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    avatar: { type: String },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    authProviders: {
      google: {
        sub: { type: String, unique: true, sparse: true },
        email: { type: String, lowercase: true },
      },
      facebook: {
        sub: { type: String, unique: true, sparse: true },
        email: { type: String, lowercase: true },
      },
    },
    settings: {
      emailNotifications: { type: Boolean, default: false },
      pushNotifications: { type: Boolean, default: false },
    },
    lastLoginAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const User = model<User>('User', userSchema);
