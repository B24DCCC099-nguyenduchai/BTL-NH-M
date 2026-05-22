import type { IInitialState } from './services/base/typing';

export default function access(initialState: IInitialState) {
  const currentUser = initialState?.currentUser;
  const role = currentUser?.role;

  return {
    isLoggedIn: !!currentUser,
    studentOnly: role === 'student',
    lecturerOnly: role === 'lecturer',
    adminOnly: role === 'admin',
    staffOnly: role === 'lecturer' || role === 'admin',
  };
}