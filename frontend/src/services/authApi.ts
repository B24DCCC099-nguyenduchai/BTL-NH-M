import axios from '@/utils/axios';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'lecturer';
  department?: string;
  faculty?: string;
  className?: string;
  avatar?: string;
}

export const login = (payload: LoginPayload) =>
  axios.post('/auth/login', payload);

export const register = (payload: RegisterPayload) =>
  axios.post('/auth/register', {
    name: payload.name,
    email: payload.email,
    password: payload.password,
    role: payload.role,
    department: payload.department,
    faculty: payload.faculty,
    class: payload.className,
    avatar: payload.avatar,
  });

export const getProfile = () => axios.get('/auth/me');

export const logout = () => axios.post('/auth/logout');

export const forgotPassword = (payload: { email: string }) =>
  axios.post('/auth/reset-password', payload);

export const resetPassword = (payload: {
  email: string;
  newPassword: string;
  token?: string;
}) => axios.post('/auth/reset-password', payload);