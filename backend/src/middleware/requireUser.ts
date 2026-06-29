import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';

export const requireUser = async (req: Request, res: Response, next: NextFunction) => {
  const user = await authService.getBySub(res.locals.sub);
  if (!user) return res.status(401).json({ error: 'User not found' });
  res.locals.user = user;
  next();
};
