import api from './api';
import type { User, Post, AdminStats } from '../types';

export interface CreateUserPayload {
  name: string;
  email: string;
  password?: string;
  role: 'student' | 'lecturer' | 'admin';
  status?: 'active' | 'locked';
}

export const adminService = {
  // Users
  getUsers: () =>
    api.get<User[]>('/admin/users').then((r) => r.data),

  getUser: (id: string) =>
    api.get<User>(`/admin/users/${id}`).then((r) => r.data),

  createUser: (data: CreateUserPayload) =>
    api.post<User>('/admin/users', data).then((r) => r.data),

  updateUser: (id: string, data: Partial<CreateUserPayload>) =>
    api.put<User>(`/admin/users/${id}`, data).then((r) => r.data),

  deleteUser: (id: string) =>
    api.delete(`/admin/users/${id}`).then((r) => r.data),

  lockUser: (id: string) =>
    api.patch(`/admin/users/${id}/lock`, {}).then((r) => r.data),

  resetPassword: (id: string) =>
    api.post(`/admin/users/${id}/reset-password`, {}).then((r) => r.data),

  // Posts
  getPosts: () =>
    api.get<Post[]>('/admin/posts').then((r) => r.data),

  deletePost: (id: string) =>
    api.delete(`/admin/posts/${id}`).then((r) => r.data),

  // Stats
  getStats: () =>
    api.get<AdminStats>('/admin/stats').then((r) => r.data),
};

  updateTag: (id: number, data: Partial<Tag>) =>
    api.put<Tag>(`/admin/tags/${id}`, data).then((r) => r.data),

  deleteTag: (id: number) =>
    api.delete(`/admin/tags/${id}`).then((r) => r.data),

  // Stats
  getStatistics: () =>
    api.get<AdminStats>('/admin/statistics').then((r) => r.data),
};
