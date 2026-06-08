import { Request, Response } from 'express';
import * as userService from '../services/userService';
import * as authService from '../services/authService';

export const findUsers = async (req: Request<object, object, object, { email: string }>, res: Response) => {
  try {
    if (!req.query.email) {
      return res.status(400).json({ error: 'Email query parameter is required' });
    }

    const user = await authService.getBySub(res.locals.sub);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    const users = await userService.searchUsers(req.query.email, user._id);
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};
