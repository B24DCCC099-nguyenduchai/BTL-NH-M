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
}

export const login = (payload: LoginPayload) => axios.post('/auth/login', payload);
export const register = (payload: RegisterPayload) => axios.post('/auth/register', payload);
export const getProfile = () => axios.get('/auth/me');
export const logout = () => axios.post('/auth/logout');
