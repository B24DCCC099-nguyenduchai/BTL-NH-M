import api from './api';
import type { Post, Comment, Tag } from '../types';

export interface GetPostsParams {
  page?: number;
  limit?: number;
  q?: string;
}

export interface CreatePostPayload {
  title: string;
  content: string;
  tags?: string[];
}

export interface CreateCommentPayload {
  content: string;
  parentCommentId?: string;
}

export interface SearchResult {
  data: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const forumService = {
  // Posts
  getPosts: (params: GetPostsParams = {}) =>
    api.get<Post[]>('/forum/posts', { params }).then((r) => r.data),

  getPost: (id: string) =>
    api.get<Post>(`/forum/posts/${id}`).then((r) => r.data),

  createPost: (data: CreatePostPayload) =>
    api.post<Post>('/forum/posts', data).then((r) => r.data),

  deletePost: (id: string) =>
    api.delete(`/forum/posts/${id}`).then((r) => r.data),

  votePost: (id: string, direction: 'up' | 'down') =>
    api.post(`/forum/posts/${id}/vote`, { direction }).then((r) => r.data),

  // Comments
  getComments: (postId: string) =>
    api.get<Comment[]>(`/forum/posts/${postId}/comments`).then((r) => r.data),

  createComment: (postId: string, payload: CreateCommentPayload) =>
    api.post<Comment>(`/forum/posts/${postId}/comments`, payload).then((r) => r.data),

  deleteComment: (id: string) =>
    api.delete(`/forum/comments/${id}`).then((r) => r.data),

  voteComment: (id: string, direction: 'up' | 'down') =>
    api.post(`/forum/comments/${id}/vote`, { direction }).then((r) => r.data),

  // Tags
  getTags: () =>
    api.get<Tag[]>('/forum/tags').then((r) => r.data),

  // Search
  searchPosts: (q: string = '', page: number = 1, limit: number = 10) =>
    api.get<SearchResult>('/forum/search', { params: { q, page, limit } }).then((r) => r.data),
};
