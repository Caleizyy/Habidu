import { Request, Response } from 'express';
import { UserRole } from '../types/index';
import * as authService from '../services/authService';
import * as sessionService from '../services/sessionService';
import type { CreateUserBody } from '../types/index';
import axios from 'axios';
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
    const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });
    const user = await authService.getBySub(response.data.sub);
    if (!user) {
      const createUser: CreateUserBody = {
        sub: response.data.sub,
        firstName: response.data.given_name,
        lastName: response.data.family_name,
        email: response.data.email,
        picture: response.data.picture,
        role: UserRole.Regular,
      };

      const user = authService.create(createUser);
      console.log('User created: ', user);
    } else {
      console.log('User found: ', user);
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
      sub: response.data.sub,
      accessToken: accessToken,
      refreshToken: tokens.refresh_token,
      tokenExpiresAt: expirationDate,
    };
    const session = await sessionService.create(sessionBody);

    console.log('session: ', session);

    res.cookie('session', sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: (tokens.expiry_date - Date.now()) / 1000,
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
