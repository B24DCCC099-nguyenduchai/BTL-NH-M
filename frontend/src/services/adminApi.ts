import axios from '@/utils/axios';

export const getUsers = () => axios.get('/admin/users');
export const createUser = (payload: any) => axios.post('/admin/users', payload);
export const updateUser = (id: string, payload: any) => axios.put(`/admin/users/${id}`, payload);
export const deleteUser = (id: string) => axios.delete(`/admin/users/${id}`);
export const lockUser = (id: string) => axios.patch(`/admin/users/${id}/lock`);
export const resetUserPassword = (id: string) => axios.post(`/admin/users/${id}/reset-password`);
export const getAdminPosts = () => axios.get('/admin/posts');
export const getAdminPost = (id: string) => axios.get(`/forum/posts/${id}`);
export const deleteAdminPost = (id: string) => axios.delete(`/admin/posts/${id}`);
export const getStats = () => axios.get('/admin/stats');
