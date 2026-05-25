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

export interface Tag {
  id: number;
  name: string;
  color: string;
  usageCount: number;
  description?: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  author: Pick<User, 'id' | 'username' | 'avatar' | 'role'>;
  tags: Tag[];
  votes: number;
  views: number;
  commentCount: number;
  userVote?: number; // 1 | -1 | 0
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  content: string;
  postId: number;
  author: Pick<User, 'id' | 'username' | 'avatar' | 'role'>;
  votes: number;
  parentCommentId?: number | null;
  replies?: Comment[];
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PostsResponse {
  data: Post[];
  pagination: Pagination;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AdminStats {
  totalPosts: number;
  totalUsers: number;
  totalComments: number;
  totalTags: number;
  activeUsers24h: number;
  postsThisMonth: number;
  postsPerDay: { date: string; count: number }[];
  usersPerDay: { date: string; count: number }[];
  topTags: { name: string; count: number; color: string }[];
}
