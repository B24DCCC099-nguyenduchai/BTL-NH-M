export interface ICurrentUser {
  id?: string;
  name?: string;
  email?: string;
  role?: 'student' | 'lecturer' | 'admin' | string;
  status?: 'active' | 'locked' | string;
  avatar?: string;
  picture?: string;
  family_name?: string;
  given_name?: string;
  preferred_username?: string;
  faculty?: string;
  department?: string;
  'class'?: string;
}

export interface IInitialState {
  currentUser?: ICurrentUser | null;
  permissionLoading?: boolean;
  settings?: Record<string, any>;
  authorizedPermissions?: Array<{
    rsname?: string;
    scopes?: string[];
  }>;
}