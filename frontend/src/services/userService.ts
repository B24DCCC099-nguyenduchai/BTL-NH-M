import api from './api';
import type { User } from '../types';

export const userService = {
  getProfile: async (username: string): Promise<User> => {
    const res = await api.get<User>(`/users/${username}`);
    return res.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const res = await api.put<User>('/users/profile', data);
    return res.data;
  },

  uploadAvatar: async (file: File): Promise<{ avatar: string }> => {
    const form = new FormData();
    form.append('avatar', file);
    const res = await api.post<{ avatar: string }>('/users/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  updateSettings: async (settings: { darkMode?: boolean; notifications?: boolean }): Promise<User> => {
    const res = await api.put<User>('/users/settings', settings);
    return res.data;
  },
};
