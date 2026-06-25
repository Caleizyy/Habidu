import { NotificationModel } from '../models/notification';
import { NotificationReadStatus, CreateNotificationData } from '../types';
import { Types } from 'mongoose';

export async function find(recipientId: Types.ObjectId) {
  return NotificationModel.find({ recipientId, status: NotificationReadStatus.Unread })
    .limit(20)
    .sort({ createdAt: -1 })
    .populate('actorRef', 'firstName lastName avatar');
}

export async function findById(notificationId: Types.ObjectId) {
  return NotificationModel.findById(notificationId);
}

export async function markAsRead(notificationId: Types.ObjectId) {
  return NotificationModel.findByIdAndUpdate(notificationId, { $set: { status: NotificationReadStatus.Read } });
}

export async function markAllAsRead(recipientId: Types.ObjectId) {
  return NotificationModel.updateMany({ recipientId }, { $set: { status: NotificationReadStatus.Read } });
}

export async function createNotification(data: CreateNotificationData) {
  return NotificationModel.create(data);
}
