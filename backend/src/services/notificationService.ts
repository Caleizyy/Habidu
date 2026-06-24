import * as NotificationRepository from '../repositories/notificationRepository';
import { Types } from 'mongoose';
import { CreateNotificationBody, NotificationReadStatus } from '../types';

export async function getNotifications(recipientId: Types.ObjectId) {
  return NotificationRepository.find(recipientId);
}

export async function markAsRead(notificationId: Types.ObjectId, userId: Types.ObjectId) {
  const notification = await NotificationRepository.findById(notificationId);
  if (!notification) {
    throw new Error('Notification not found');
  }
  if (!notification.recipientId.equals(userId)) {
    throw new Error('Unidentified user attempted to mark notification as read');
  }
  return NotificationRepository.markAsRead(notificationId);
}

export async function markAllAsRead(recipientId: Types.ObjectId) {
  return NotificationRepository.markAllAsRead(recipientId);
}

export async function createNotification(data: CreateNotificationBody) {
  return NotificationRepository.createNotification({ ...data, status: NotificationReadStatus.Unread });
}
