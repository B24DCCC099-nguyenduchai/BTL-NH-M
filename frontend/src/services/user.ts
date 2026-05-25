import api from './api';
import type { User, Post } from '../types';

export const userService = {
  getProfile: (username: string) =>
    api.get<User & { postCount: number; commentCount: number; votesReceived: number }>(
      `/users/${username}`
    ).then((r) => r.data),

  getUserPosts: (username: string) =>
    api.get<Post[]>(`/users/${username}/posts`).then((r) => r.data),

  updateProfile: (data: { username?: string; email?: string; bio?: string }) =>
    api.put<User>('/users/profile', data).then((r) => r.data),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api
      .post<{ avatar: string }>('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },

  updateSettings: (settings: { darkMode?: boolean; notifications?: boolean }) =>
    api.put<User>('/users/settings', settings).then((r) => r.data),
};
