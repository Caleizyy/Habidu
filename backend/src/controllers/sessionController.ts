import { Request, Response } from 'express';
import * as sessionService from '../services/sessionService';
import * as authService from '../services/authService';
import * as refreshService from '../services/refreshService';
import { COOKIE_OPTIONS } from '../utils/cookieOptions';

export const logout = async (req: Request, res: Response) => {
  const sessionId = req.cookies?.session;
  res.clearCookie('session', COOKIE_OPTIONS);

  try {
    if (!sessionId) {
      return res.status(200).json({ message: 'Logged out' });
    }

    const session = await sessionService.getSessionById(sessionId);
    if (!session) {
      return res.status(200).json({ message: 'Logged out' });
    }

    await Promise.all([sessionService.deleteBySessionId(sessionId), refreshService.deleteBySub(session.sub)]);

    return res.status(200).json({ message: 'Logged out' });
  } catch (error) {
    console.error('Error during logout:', error);
    return res.status(500).json({ error: 'Logout failed' });
  }
};

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
        ...COOKIE_OPTIONS,
        maxAge: newTokens.expiry_date - Date.now(),
      });
    }

    return res.json({
      sub: session.sub,
      email: user.email,
      name: user.firstName + ' ' + user.lastName,
      avatar: user.avatar,
      bio: user.bio,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};
