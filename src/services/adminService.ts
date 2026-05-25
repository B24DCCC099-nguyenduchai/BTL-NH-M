import api from './api';
import type { User, Post, Tag, AdminStats, PaginatedResponse } from '../types';

export const adminService = {
  // ── Users ──────────────────────────────────────────────────────────────────
  getUsers: async (page = 1, filters: Record<string, any> = {}): Promise<PaginatedResponse<User>> => {
    const res = await api.get<PaginatedResponse<User>>('/admin/users', { params: { page, limit: 20, ...filters } });
    return res.data;
  },

  createUser: async (data: Partial<User> & { password: string }): Promise<User> => {
    const res = await api.post<User>('/admin/users', data);
    return res.data;
  },

  updateUser: async (id: number, data: Partial<User>): Promise<User> => {
    const res = await api.put<User>(`/admin/users/${id}`, data);
    return res.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  },

  lockUser: async (id: number): Promise<{ isActive: boolean }> => {
    const res = await api.post<{ isActive: boolean }>(`/admin/users/${id}/lock`);
    return res.data;
  },

  resetPassword: async (id: number): Promise<{ tempPassword: string }> => {
    const res = await api.post<{ tempPassword: string }>(`/admin/users/${id}/reset-password`);
    return res.data;
  },

  // ── Posts ──────────────────────────────────────────────────────────────────
  getPosts: async (page = 1, filters: Record<string, any> = {}): Promise<PaginatedResponse<Post>> => {
    const res = await api.get<PaginatedResponse<Post>>('/admin/posts', { params: { page, limit: 20, ...filters } });
    return res.data;
  },

  deletePost: async (id: number): Promise<void> => {
    await api.delete(`/admin/posts/${id}`);
  },

  // ── Tags ───────────────────────────────────────────────────────────────────
  createTag: async (data: Partial<Tag>): Promise<Tag> => {
    const res = await api.post<Tag>('/admin/tags', data);
    return res.data;
  },

  updateTag: async (id: number, data: Partial<Tag>): Promise<Tag> => {
    const res = await api.put<Tag>(`/admin/tags/${id}`, data);
    return res.data;
  },

  deleteTag: async (id: number): Promise<void> => {
    await api.delete(`/admin/tags/${id}`);
  },

  // ── Statistics ─────────────────────────────────────────────────────────────
  getStatistics: async (): Promise<AdminStats> => {
    const res = await api.get<AdminStats>('/admin/statistics');
    return res.data;
  },
};
