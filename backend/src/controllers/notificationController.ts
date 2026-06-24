import { Request, Response } from 'express';
import { Types } from 'mongoose';
import * as notificationService from '../services/notificationService';
import * as authService from '../services/authService';

export const findNotifications = async (req: Request, res: Response) => {
  try {
    const user = await authService.getBySub(res.locals.sub);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    const notification = await notificationService.getNotifications(user._id);
    return res.status(200).json(notification);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ error: 'Failed to fetch notification' });
  }
};

export const markAsRead = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const user = await authService.getBySub(res.locals.sub);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    await notificationService.markAsRead(new Types.ObjectId(req.params.id), user._id);
    return res.status(200).json({ message: 'Notification marked as read successfully' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const user = await authService.getBySub(res.locals.sub);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    await notificationService.markAllAsRead(user._id);
    return res.status(200).json({ message: 'All notification marked as read successfully' });
  } catch (error) {
    console.error('Error marking all notification as read:', error);
    return res.status(500).json({ error: 'Failed to mark all notification as read' });
  }
};
