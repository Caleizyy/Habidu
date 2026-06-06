import { z } from 'zod';

export const googleAuthSchema = z.object({
  code: z.string().min(1, 'Authorization code is required'),
});

export type GoogleAuthRequest = z.infer<typeof googleAuthSchema>;

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type RefreshTokenRequest = z.infer<typeof refreshTokenSchema>;

export const logoutSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required').optional(),
});

export type LogoutRequest = z.infer<typeof logoutSchema>;
