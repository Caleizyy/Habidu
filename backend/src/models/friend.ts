import { Schema, model, Document } from 'mongoose';
import { FriendRequestStatus } from '../types';

export interface IFriend extends Document {
  recipientId: Schema.Types.ObjectId;
  senderId: Schema.Types.ObjectId;
  status: FriendRequestStatus;
}

const FriendSchema = new Schema<IFriend>(
  {
    recipientId: { type: Schema.Types.ObjectId, required: true },
    senderId: { type: Schema.Types.ObjectId, required: true },
    status: { type: String, enum: Object.values(FriendRequestStatus), required: true },
  },
  { timestamps: true }
);

export const Friend = model<IFriend>('Friend', FriendSchema);
