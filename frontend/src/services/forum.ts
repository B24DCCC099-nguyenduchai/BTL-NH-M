import api from './api';
import type { Post, PostsResponse, Comment, Tag } from '../types';

export interface GetPostsParams {
  page?: number;
  limit?: number;
  sort?: 'newest' | 'hot' | 'votes' | 'views';
  tag?: string;
  keyword?: string;
}

export interface CreatePostPayload {
  title: string;
  content: string;
  tags: string[];
}

export const forumService = {
  // Posts
  getPosts: (params: GetPostsParams = {}) =>
    api.get<PostsResponse>('/forum/posts', { params }).then((r) => r.data),

  getPost: (id: number) =>
    api.get<Post>(`/forum/posts/${id}`).then((r) => r.data),

  createPost: (data: CreatePostPayload) =>
    api.post<Post>('/forum/posts', data).then((r) => r.data),

  updatePost: (id: number, data: Partial<CreatePostPayload>) =>
    api.put<Post>(`/forum/posts/${id}`, data).then((r) => r.data),

  deletePost: (id: number) =>
    api.delete(`/forum/posts/${id}`).then((r) => r.data),

  votePost: (id: number, voteType: 1 | -1) =>
    api.post<{ votes: number; userVote: number | null }>(
      `/forum/posts/${id}/vote`,
      { voteType }
    ).then((r) => r.data),

  savePost: (id: number) =>
    api.post<{ saved: boolean }>(`/forum/posts/${id}/save`).then((r) => r.data),

  getSavedPosts: () =>
    api.get<Post[]>('/forum/saved-posts').then((r) => r.data),

  // Comments
  getComments: (postId: number) =>
    api.get<Comment[]>(`/forum/posts/${postId}/comments`).then((r) => r.data),

  createComment: (postId: number, content: string) =>
    api.post<Comment>(`/forum/posts/${postId}/comments`, { content }).then((r) => r.data),

  replyComment: (postId: number, parentCommentId: number, content: string) =>
    api
      .post<Comment>(
        `/forum/posts/${postId}/comments/${parentCommentId}/reply`,
        { content }
      )
      .then((r) => r.data),

  deleteComment: (id: number) =>
    api.delete(`/forum/comments/${id}`).then((r) => r.data),

  voteComment: (id: number, voteType: 1 | -1) =>
    api.post(`/forum/comments/${id}/vote`, { voteType }).then((r) => r.data),

  // Tags
  getTags: () =>
    api.get<Tag[]>('/forum/tags').then((r) => r.data),
};
