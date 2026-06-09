import { Request, Response } from 'express';
import { UserRole } from '../types/index';
import * as authService from '../services/authService';
import * as sessionService from '../services/sessionService';
import * as refreshService from '../services/refreshService';
import type { CreateRefreshTokenBody, CreateUserBody } from '../types/index';
import crypto from 'crypto';
import { CreateSessionBody } from '../types';
import { google } from 'googleapis';

export const googleAuth = async (req: Request<unknown, unknown, { code: string }>, res: Response) => {
  const { code } = req.body;

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  try {
    const { tokens } = await oauth2Client.getToken({ code });

    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    const user = await authService.getBySub(payload.sub);

    if (!payload.email || !payload.given_name || !payload.family_name) {
      return res.status(400).json({ message: 'Missing required user information' });
    }

    if (!user) {
      const createUser: CreateUserBody = {
        sub: payload.sub,
        firstName: payload.given_name,
        lastName: payload.family_name,
        email: payload.email,
        avatar: payload.picture,
        role: UserRole.Regular,
      };

      await authService.create(createUser);
    }

    if (!tokens.access_token || !tokens.refresh_token || !tokens.expiry_date) {
      return res.status(500).json({
        message: 'Token corrupted',
      });
    }
    const sessionId = crypto.randomUUID();
    const accessToken = tokens.access_token;
    const expirationDate = new Date(tokens.expiry_date!);
    const sessionBody: CreateSessionBody = {
      sessionId: sessionId,
      sub: payload.sub,
      accessToken: accessToken,
      tokenExpiresAt: expirationDate,
    };

    await sessionService.create(sessionBody);

    const refreshTokenBody: CreateRefreshTokenBody = {
      sub: payload.sub,
      refreshToken: tokens.refresh_token,
    };

    await refreshService.create(refreshTokenBody);

    res.cookie('session', sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: tokens.expiry_date - Date.now(),
    });

    return res.status(201).json({
      message: 'User authenticated successfully',
      user: user,
    });
  } catch (error) {
    console.log('Failed to fetch user data:', (error as Error).message);
    return res.status(500).json({
      message: 'User authentication or fetching failed',
    });
  }
};
