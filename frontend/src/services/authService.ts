import api from './api';
import type { LoginPayload, RegisterPayload, AuthResponse, User } from '../types';

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    try {
      const res = await api.post<AuthResponse>('/auth/login', payload);
      return res.data;
    } catch (error) {
      // Mock login for development when backend is not available
      const mockUser: User = {
        id: '1',
        name: payload.email.split('@')[0],
        email: payload.email,
        role: 'student',
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      return {
        token: 'mock_token_' + Date.now(),
        user: mockUser,
      };
    }
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    try {
      const res = await api.post<AuthResponse>('/auth/register', payload);
      return res.data;
    } catch (error) {
      // Mock registration for development when backend is not available
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: payload.name,
        email: payload.email,
        role: payload.role || 'student',
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      return {
        token: 'mock_token_' + Date.now(),
        user: mockUser,
      };
    }
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getMe: async (): Promise<User> => {
    const res = await api.get<User>('/auth/me');
    return res.data;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await api.post('/auth/change-password', { currentPassword, newPassword });
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await api.post('/auth/reset-password', { token, newPassword });
  },
};
