import { client } from './client';
import type { Profile } from '../types/index';

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api';
const PROFILE_BASE_URL = `${API_BASE_URL}/profile`;

export const profileApi = {
  getProfile: async (userId?: string) => {
    const url = userId ? `${PROFILE_BASE_URL}/${userId}` : `${PROFILE_BASE_URL}/me`;
    const res = await client.get<Profile>(url);
    return res.data;
  },

  updateProfile: async (data: { name: string; bio?: string }) => {
    const res = await client.patch<Profile>(`${PROFILE_BASE_URL}/me`, data);
    return res.data;
  },
};
