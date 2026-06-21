import { client } from './client';
import type { User } from '../types/index';

export const authApi = {
  loginWithGoogle: (credential: string) => client.post<User>('/auth/google', { code: credential }).then((r) => r.data),
  sessionCheck: () => client.get<User>('/session/me', { withCredentials: true }).then((r) => r.data),
  logout: () => client.delete('/session'),
};
