import { client } from './client';
import type { Profile } from '../types/index';

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api';
const PROFILE_URL = `${API_BASE_URL}/profile/me`;

export const profileApi = {
  getProfile: async () => {
    const res = await client.get<Profile>(PROFILE_URL);
    return res.data;
  },

  updateProfile: async (data: { name: string; bio?: string }) => {
    const res = await client.patch<Profile>(PROFILE_URL, data);
    return res.data;
  },
};
