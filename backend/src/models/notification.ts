import { Types, Schema, model, Document } from 'mongoose';
import { NotificationReadStatus } from '../types';

export interface INotification extends Document {
  actorRef: Types.ObjectId;
  recipientId: Types.ObjectId;
  message: string;
  status: NotificationReadStatus;
  pageRef: string;
}

const NotificationSchema = new Schema<INotification>(
  {
    actorRef: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    status: { type: String, enum: Object.values(NotificationReadStatus), required: true },
    pageRef: { type: String, required: true },
  },
  { timestamps: true }
);

export const NotificationModel = model<INotification>('Notification', NotificationSchema);
