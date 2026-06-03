// ─── User Types ───────────────────────────────────────────────────────────────
export type UserRole = 'student' | 'lecturer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  status: 'active' | 'locked';
  createdAt: string;
}

// ─── Auth Types ───────────────────────────────────────────────────────────────
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status?: 'active' | 'locked';
}

export interface CreatePostPayload {
  title: string;
  content: string;
  tags?: string[];
}

export interface CreateCommentPayload {
  content: string;
  parentCommentId?: string | null;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// ─── Tag Types ────────────────────────────────────────────────────────────────
export interface Tag {
  id: string;
  name: string;
  color?: string;
  description?: string;
  usageCount?: number;
}

// ─── Post Types ───────────────────────────────────────────────────────────────
export interface PostAuthor {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  role: UserRole;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: PostAuthor;
  authorId: string;
  tags: Tag[];
  votes: number;
  views?: number;
  commentCount?: number;
  createdAt: string;
  updatedAt?: string;
}

// ─── Comment Types ────────────────────────────────────────────────────────────
export interface Comment {
  id: string;
  content: string;
  author: PostAuthor;
  userId: string;
  postId: string;
  votes: number;
  parentCommentId?: string | null;
  replies?: Comment[];
  createdAt: string;
  updatedAt?: string;
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
