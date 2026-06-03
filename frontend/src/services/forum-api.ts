import api from './api';
import type { Post } from '@/types';

export const forumAPI = {
  // Posts
  getPosts: (params?: { page?: number; limit?: number; tag?: string; sort?: string }) =>
    api.get<Post[]>('/forum/posts', { params }),
  
  getPost: (id: string | number) =>
    api.get<Post>(`/forum/posts/${id}`),
  
  createPost: (payload: Omit<Post, 'id' | 'votes' | 'commentCount' | 'views' | 'createdAt'>) =>
    api.post<Post>('/forum/posts', payload),
  
  updatePost: (id: string | number, payload: Partial<Post>) =>
    api.put<Post>(`/forum/posts/${id}`, payload),
  
  deletePost: (id: string | number) =>
    api.delete(`/forum/posts/${id}`),
  
  // Comments
  getComments: (postId: string | number, params?: { page?: number; limit?: number }) =>
    api.get(`/forum/posts/${postId}/comments`, { params }),
  
  createComment: (postId: string | number, payload: any) =>
    api.post(`/forum/posts/${postId}/comments`, payload),
  
  // Tags
  getTags: () =>
    api.get<any[]>('/forum/tags'),
  
  // Votes
  votePost: (postId: string | number, type: 'up' | 'down') =>
    api.post(`/forum/posts/${postId}/vote`, { type }),
};
