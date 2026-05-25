import api from './api';
import type { User, Post, Tag, AdminStats } from '../types';

export interface UsersResponse {
  data: User[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface PostsAdminResponse {
  data: Post[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface CreateUserPayload {
  username: string;
  email: string;
  password: string;
  role: 'student' | 'lecturer' | 'admin';
}

export const adminService = {
  // Users
  getUsers: (page = 1, limit = 20, search?: string) =>
    api
      .get<UsersResponse>('/admin/users', { params: { page, limit, search } })
      .then((r) => r.data),

  getUser: (id: number) =>
    api.get<User>(`/admin/users/${id}`).then((r) => r.data),

  createUser: (data: CreateUserPayload) =>
    api.post<User>('/admin/users', data).then((r) => r.data),

  updateUser: (id: number, data: Partial<User>) =>
    api.put<User>(`/admin/users/${id}`, data).then((r) => r.data),

  deleteUser: (id: number) =>
    api.delete(`/admin/users/${id}`).then((r) => r.data),

  lockUser: (id: number) =>
    api.post(`/admin/users/${id}/lock`).then((r) => r.data),

  resetPassword: (id: number) =>
    api.post(`/admin/users/${id}/reset-password`).then((r) => r.data),

  // Posts
  getPosts: (page = 1, limit = 20, search?: string) =>
    api
      .get<PostsAdminResponse>('/admin/posts', { params: { page, limit, search } })
      .then((r) => r.data),

  deletePost: (id: number) =>
    api.delete(`/admin/posts/${id}`).then((r) => r.data),

  // Tags
  getTags: () =>
    api.get<Tag[]>('/admin/tags').then((r) => r.data),

  createTag: (data: { name: string; color: string; description?: string }) =>
    api.post<Tag>('/admin/tags', data).then((r) => r.data),

  updateTag: (id: number, data: Partial<Tag>) =>
    api.put<Tag>(`/admin/tags/${id}`, data).then((r) => r.data),

  deleteTag: (id: number) =>
    api.delete(`/admin/tags/${id}`).then((r) => r.data),

  // Stats
  getStatistics: () =>
    api.get<AdminStats>('/admin/statistics').then((r) => r.data),
};
