import { Types, Schema, model, Document } from 'mongoose';
import { FriendRequestStatus } from '../types';

export interface IFriend extends Document {
  recipientId: Types.ObjectId;
  requesterId: Types.ObjectId;
  status: FriendRequestStatus;
}

const FriendSchema = new Schema<IFriend>(
  {
    recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    requesterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: Object.values(FriendRequestStatus), required: true },
  },
  { timestamps: true }
);

export const Friend = model<IFriend>('Friend', FriendSchema);
