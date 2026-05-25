import { useState, useEffect, useCallback } from 'react';
import { history } from 'umi';
import { authService } from '../services/authService';
import type { User, LoginPayload, RegisterPayload } from '../types';
import { addToast } from '../utils/toast';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem('forum_token');
    if (!token) { setLoading(false); return; }
    authService.getMe()
      .then((u) => setUser(u))
      .catch(() => localStorage.removeItem('forum_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const data = await authService.login(payload);
    localStorage.setItem('forum_token', data.token);
    setUser(data.user);
    addToast('Đăng nhập thành công! 🎉', 'success');
    history.push('/');
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const data = await authService.register(payload);
    localStorage.setItem('forum_token', data.token);
    setUser(data.user);
    addToast('Tạo tài khoản thành công! Chào mừng bạn 🎉', 'success');
    history.push('/');
  }, []);

  const logout = useCallback(() => {
    authService.logout().catch(() => {});
    localStorage.removeItem('forum_token');
    setUser(null);
    history.push('/auth/login');
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  return {
    user,
    loading,
    isLoggedIn: !!user,
    isAdmin: user?.role === 'admin',
    isLecturer: user?.role === 'lecturer',
    login,
    register,
    logout,
    updateUser,
  };
}
