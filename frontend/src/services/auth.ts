import api from './api';
import type { User, LoginResponse } from '../types';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
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
};
