export const timeAgo = (dateStr: string): string => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  
  if (m < 1) return 'Vừa xong';
  if (m < 60) return `${m} phút trước`;
  
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} giờ trước`;
  
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} ngày trước`;
  
  return new Date(dateStr).toLocaleDateString('vi-VN');
};

export const roleLabel: Record<string, string> = {
  student: 'Sinh viên',
  lecturer: 'Giảng viên',
  admin: 'Quản trị viên',
};

export const roleColor: Record<string, string> = {
  student: '#4F8CFF',
  lecturer: '#7B61FF',
  admin: '#FF6B6B',
};

export const defaultColors = ['#4F8CFF', '#7B61FF', '#4DE2E2', '#FF6B6B', '#22C55E', '#F59E0B'];

export const getAvatarColor = (username: string): string => {
  return defaultColors[(username?.charCodeAt(0) || 0) % defaultColors.length];
};
