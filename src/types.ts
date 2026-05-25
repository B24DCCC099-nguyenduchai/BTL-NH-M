// ─── User Types ───────────────────────────────────────────────────────────────
export type UserRole = 'student' | 'lecturer' | 'admin';

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  isActive: boolean;
  darkMode?: boolean;
  createdAt: string;
}

// ─── Auth Types ───────────────────────────────────────────────────────────────
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

// ─── Tag Types ────────────────────────────────────────────────────────────────
export interface Tag {
  id: number;
  name: string;
  color?: string;
  description?: string;
  usageCount: number;
}

// ─── Post Types ───────────────────────────────────────────────────────────────
export interface PostAuthor {
  id: number;
  username: string;
  avatar?: string;
  role: UserRole;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  author: PostAuthor;
  authorId: number;
  tags: Tag[];
  votes: number;
  views: number;
  commentCount: number;
  isSaved?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostPayload {
  title: string;
  content: string;
  tags: string[];
}

// ─── Comment Types ────────────────────────────────────────────────────────────
export interface Comment {
  id: number;
  content: string;
  author: PostAuthor;
  userId: number;
  postId: number;
  votes: number;
  parentCommentId?: number | null;
  replies?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentPayload {
  content: string;
  parentCommentId?: number;
}

// ─── Pagination Types ─────────────────────────────────────────────────────────
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

// ─── Forum Filter Types ───────────────────────────────────────────────────────
export type SortOption = 'newest' | 'hot' | 'votes' | 'views';

export interface PostFilters {
  page?: number;
  limit?: number;
  keyword?: string;
  tag?: string;
  sort?: SortOption;
}

// ─── Admin Types ──────────────────────────────────────────────────────────────
export interface AdminStats {
  totalPosts: number;
  totalUsers: number;
  totalComments: number;
  totalTags: number;
  activeUsers24h: number;
  postsThisMonth: number;
  postsPerDay: { date: string; count: number }[];
  usersPerDay: { date: string; count: number }[];
}

// ─── Notification Types ───────────────────────────────────────────────────────
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}
