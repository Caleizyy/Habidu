import { Schema, model, Document, Types } from 'mongoose';
import { GroupRequestStatus } from '../types';

export interface IGroupRequest extends Document {
  group: Types.ObjectId;
  inviter: Types.ObjectId;
  invitee: Types.ObjectId;
  status: GroupRequestStatus;
}

const GroupRequestSchema = new Schema<IGroupRequest>(
  {
    group: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
    inviter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    invitee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: Object.values(GroupRequestStatus),
      default: GroupRequestStatus.Pending,
    },
  },
  { timestamps: true }
);

export const GroupRequest = model<IGroupRequest>('GroupRequest', GroupRequestSchema);
