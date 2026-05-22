export type UserRole = 'student' | 'lecturer' | 'admin';

export interface StoredUser {
  id?: string;
  name?: string;
  email?: string;
  role?: UserRole | string;
  status?: string;
  avatar?: string;
  picture?: string;
  faculty?: string;
  department?: string;
  class?: string;
}

export const TOKEN_KEY = 'token';
export const USER_KEY = 'user';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): StoredUser | null {
  if (typeof window === 'undefined') return null;

  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function saveAuth(token: string, user: StoredUser) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export function isAdmin(): boolean {
  return getStoredUser()?.role === 'admin';
}

export function isLecturer(): boolean {
  return getStoredUser()?.role === 'lecturer';
}

export function isStudent(): boolean {
  return getStoredUser()?.role === 'student';
}

export function getHomePathByRole(role?: string): string {
  if (role === 'admin') return '/admin/dashboard';
  return '/forum';
}

export function getRoleLabel(role?: string): string {
  switch (role) {
    case 'student':
      return 'Sinh viên';
    case 'lecturer':
      return 'Giảng viên';
    case 'admin':
      return 'Quản trị viên';
    default:
      return 'Người dùng';
  }
}