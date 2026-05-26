import { Request, Response } from 'express';
import * as sessionService from '../services/sessionService';
import * as authService from '../services/authService';
import * as refreshService from '../services/refreshService';

export const sessionCheck = async (req: Request, res: Response) => {
  try {
    const sessionId = req.cookies?.session;

    if (!sessionId) {
      return res.status(401).json({ error: 'No session' });
    }

    const session = await sessionService.getSessionById(sessionId);
    if (!session) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    const user = await authService.getBySub(session.sub);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (session.tokenExpiresAt < new Date()) {
      const refreshToken = await refreshService.getBySub(session.sub);
      if (!refreshToken) {
        return res.status(401).json({ error: 'No refresh token found' });
      }

      const newTokens = await authService.refreshAccessToken(refreshToken.refreshToken);

      if (!newTokens.access_token || !newTokens.expiry_date) {
        return res.status(500).json({ error: 'Error updating tokens.' });
      }

      try {
        await sessionService.updateSession(sessionId, new Date(newTokens.expiry_date));
      } catch (error) {
        return res.status(500).json({ error: 'Error updating session:', details: error });
      }

      res.cookie('session', sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: (newTokens.expiry_date - Date.now()) / 1000,
      });
    }

    return res.json({
      sub: session.sub,
      email: user.email,
      name: user.firstName + ' ' + user.lastName,
      avatar: user.picture,
      bio: user.bio,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};
