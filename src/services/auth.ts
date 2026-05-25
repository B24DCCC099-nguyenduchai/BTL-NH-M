import api from './api';
import type { User, LoginResponse } from '../types';

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  role: 'student' | 'lecturer';
}

export const authService = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { email, password }).then((r) => r.data),

  register: (data: RegisterPayload) =>
    api.post<LoginResponse>('/auth/register', data).then((r) => r.data),

  getMe: () =>
    api.get<User>('/auth/me').then((r) => r.data),

  logout: () =>
    api.post('/auth/logout').catch(() => {}),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/auth/change-password', { currentPassword, newPassword }).then((r) => r.data),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }).then((r) => r.data),
};
