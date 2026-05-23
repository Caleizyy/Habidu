import { google } from 'googleapis';
import * as userRepo from '../repositories/userRepository';
import { CreateUserBody } from '../types';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export function getBySub(sub: string) {
  return userRepo.getBySub(sub);
}

export function create(data: CreateUserBody) {
  return userRepo.create(data);
}

export async function refreshAccessToken(refreshToken: string) {
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const { credentials } = await oauth2Client.refreshAccessToken();

  return credentials;
}
