import { client } from './client';

export const profileApi = {
  getProfile: async () => {
    const res = await client.get('/profile/me');
    return res.data;
  },

  updateProfile: async (data: { name: string; bio?: string }) => {
    const res = await client.patch('/profile/me', data);
    return res.data;
  },
};
