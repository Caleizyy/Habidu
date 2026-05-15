export interface GoogleJwtPayload {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}
export interface Oauth2Token {
  access_token: string;
  authuser?: string;
  expires_in: number;
  gis_params?: string;
  iss?: string;
  oauth_metadata?: string;
  prompt: string;
  scope: string;
  token_type: string;
}
export enum UserRole {
  Admin = 'admin',
  Regular = 'regular',
}
export interface CreateUserBody {
  firstName: string;
  lastName: string;
  email: string;
  sub: string;
  role: UserRole;
  picture?: string;
}
export interface CreateSessionBody {
  sessionId: string;
  sub: string;
  accessToken: string;
  refreshToken: string;
  tokenExpiresAt: Date;
}
