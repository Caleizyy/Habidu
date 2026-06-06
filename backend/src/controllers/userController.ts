import { Request, Response } from 'express';
import * as userService from '../services/userService';
import * as authService from '../services/authService';
import * as sessionService from '../services/sessionService';

export const findUsers = async (req: Request<object, object, object, { name: string }>, res: Response) => {
  try {
    if (!req.query.name) {
      return res.status(400).json({ error: 'Name query parameter is required' });
    }
    const sessionId = req.cookies?.session;
    if (!sessionId) {
      return res.status(401).json({ error: 'No session' });
    }

    const userSession = await sessionService.getSessionById(sessionId);
    if (!userSession) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    const user = await authService.getBySub(userSession.sub);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    const users = await userService.searchUsers(req.query.name, user._id);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};
