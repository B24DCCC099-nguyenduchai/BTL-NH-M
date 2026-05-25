import api from './api';
import type {
  Post, Comment, Tag,
  CreatePostPayload, CreateCommentPayload,
  PaginatedResponse, PostFilters,
} from '../types';

export const forumService = {
  // ── Posts ──────────────────────────────────────────────────────────────────
  getPosts: async (filters: PostFilters = {}): Promise<PaginatedResponse<Post>> => {
    const res = await api.get<PaginatedResponse<Post>>('/forum/posts', { params: filters });
    return res.data;
  },

  getPost: async (id: number): Promise<Post> => {
    const res = await api.get<Post>(`/forum/posts/${id}`);
    return res.data;
  },

  createPost: async (payload: CreatePostPayload): Promise<Post> => {
    const res = await api.post<Post>('/forum/posts', payload);
    return res.data;
  },

  updatePost: async (id: number, payload: Partial<CreatePostPayload>): Promise<Post> => {
    const res = await api.put<Post>(`/forum/posts/${id}`, payload);
    return res.data;
  },

  deletePost: async (id: number): Promise<void> => {
    await api.delete(`/forum/posts/${id}`);
  },

  votePost: async (id: number, voteType: 1 | -1): Promise<{ votes: number }> => {
    const res = await api.post<{ votes: number }>(`/forum/posts/${id}/vote`, { voteType });
    return res.data;
  },

  savePost: async (id: number): Promise<{ saved: boolean }> => {
    const res = await api.post<{ saved: boolean }>(`/forum/posts/${id}/save`);
    return res.data;
  },

  getSavedPosts: async (): Promise<Post[]> => {
    const res = await api.get<Post[]>('/forum/saved-posts');
    return res.data;
  },

  // ── Comments ───────────────────────────────────────────────────────────────
  getComments: async (postId: number): Promise<Comment[]> => {
    const res = await api.get<Comment[]>(`/forum/posts/${postId}/comments`);
    return res.data;
  },

  createComment: async (postId: number, payload: CreateCommentPayload): Promise<Comment> => {
    const res = await api.post<Comment>(`/forum/posts/${postId}/comments`, payload);
    return res.data;
  },

  replyComment: async (postId: number, parentCommentId: number, payload: CreateCommentPayload): Promise<Comment> => {
    const res = await api.post<Comment>(`/forum/posts/${postId}/comments/${parentCommentId}/reply`, payload);
    return res.data;
  },

  deleteComment: async (id: number): Promise<void> => {
    await api.delete(`/forum/comments/${id}`);
  },

  voteComment: async (id: number, voteType: 1 | -1): Promise<{ votes: number }> => {
    const res = await api.post<{ votes: number }>(`/forum/comments/${id}/vote`, { voteType });
    return res.data;
  },

  // ── Tags ───────────────────────────────────────────────────────────────────
  getTags: async (): Promise<Tag[]> => {
    const res = await api.get<Tag[]>('/forum/tags');
    return res.data;
  },

  getTopTags: async (limit = 10): Promise<Tag[]> => {
    const res = await api.get<Tag[]>('/forum/tags/top', { params: { limit } });
    return res.data;
  },
};
