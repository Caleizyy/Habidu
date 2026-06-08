import { Request, Response } from 'express';
import * as friendService from '../services/friendService';
import * as authService from '../services/authService';
import { CreateFriendRequestBody } from '../types';

export const sendFriendRequest = async (req: Request<unknown, unknown, CreateFriendRequestBody>, res: Response) => {
  try {
    const { recipientEmail } = req.body;
    if (!recipientEmail) {
      return res.status(400).json({ error: 'Recipient email is required' });
    }

    const requester = await authService.getBySub(res.locals.sub);
    if (!requester) {
      return res.status(401).json({ error: 'User not found' });
    }
    await friendService.sendRequest(requester._id, recipientEmail);
    return res.status(201).json({ message: 'Friend request sent successfully' });
  } catch (error) {
    console.error('Error sending friend request:', error);
    return res.status(500).json({ error: 'Failed to send friend request' });
  }
};

export const getFriends = async (req: Request, res: Response) => {
  try {
    const user = await authService.getBySub(res.locals.sub);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const friends = await friendService.getFriends(user._id);
    return res.status(200).json(friends);
  } catch (error) {
    console.error('Error fetching friends:', error);
    return res.status(500).json({ error: 'Failed to fetch friends' });
  }
};
