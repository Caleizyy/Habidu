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
