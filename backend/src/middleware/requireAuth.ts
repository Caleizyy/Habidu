import { Request, Response, NextFunction } from 'express';
import * as sessionService from '../services/sessionService';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const sessionId = req.cookies?.session;
  if (!sessionId) return res.status(401).json({ error: 'Unauthorized' });

  const session = await sessionService.getSessionById(sessionId);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  res.locals.sub = session.sub;
  next();
};
