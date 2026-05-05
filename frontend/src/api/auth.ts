import { client } from './client';
import type { User } from '../types/index';

export const authApi = {
  loginWithGoogle: (credential: string) =>
    client.post<User>('/auth/google', { credential: credential }).then((r) => r.data),
};
