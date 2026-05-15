import { Request, Response } from 'express';
import * as sessionService from '../services/sessionService';
import * as authService from '../services/authService';
import { google } from 'googleapis';

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

    // console.log('SESSION: ',user)
    if (session.tokenExpiresAt < new Date()) {
      console.log('Token expired, refreshing');
      const newTokens = await refreshAccessToken(session.refreshToken);

      if (!newTokens.access_token || !newTokens.expiry_date) {
        return res.status(500).json({ error: 'Error updateing tokens.' });
      }
      sessionService.updateSession(sessionId, new Date(newTokens.expiry_date), newTokens.access_token);

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
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

const refreshAccessToken = async (refreshToken: string) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const { credentials } = await oauth2Client.refreshAccessToken();

  return credentials;
};
