import type { UserRole } from '../types';

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Vừa xong';
  if (m < 60) return `${m} phút trước`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} giờ trước`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} ngày trước`;
  return new Date(dateStr).toLocaleDateString('vi-VN');
}

export const roleLabel: Record<UserRole, string> = {
  student: 'Sinh viên',
  lecturer: 'Giảng viên',
  admin: 'Quản trị viên',
};

export const roleColor: Record<UserRole, string> = {
  student: '#4f8cff',
  lecturer: '#7b61ff',
  admin: '#ef4444',
};

export function getInitial(username: string): string {
  return username?.[0]?.toUpperCase() ?? '?';
}

export function getAvatarBg(username: string): string {
  const colors = ['#4f8cff', '#7b61ff', '#4de2e2', '#f59e0b', '#22c55e', '#ef4444'];
  return colors[(username?.charCodeAt(0) ?? 0) % colors.length];
}
