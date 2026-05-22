import axios from '@/utils/axios';

export const getPosts = () =>
  axios.get('/forum/posts');

export const getPostById = (id: string) =>
  axios.get(`/forum/posts/${id}`);

export const createPost = (payload: any) =>
  axios.post('/forum/posts', payload);

export const getComments = (postId: string) =>
  axios.get(`/forum/posts/${postId}/comments`);

export const createComment = (
  postId: string,
  payload: any,
) =>
  axios.post(
    `/forum/posts/${postId}/comments`,
    payload,
  );

export const votePost = (
  postId: string,
  direction: 'up' | 'down',
) =>
  axios.post(`/forum/posts/${postId}/vote`, {
    direction,
  });

export const voteComment = (
  commentId: string,
  direction: 'up' | 'down',
) =>
  axios.post(`/forum/comments/${commentId}/vote`, {
    direction,
  });

export const searchPosts = (query: string) =>
  axios.get('/forum/search', {
    params: { q: query },
  });