export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user/login',
        name: 'Đăng nhập',
        component: './Auth/Login',
      },
      {
        path: '/user/register',
        name: 'Đăng ký',
        component: './Auth/Register',
      },
      {
        path: '/user/forgot-password',
        name: 'Quên mật khẩu',
        component: './Auth/ForgotPassword',
      },
      {
        path: '/user/reset-password',
        name: 'Đặt lại mật khẩu',
        component: './Auth/ResetPassword',
      },
      {
        path: '/user',
        redirect: '/user/login',
      },
    ],
  },

  {
    path: '/',
    exact: true,
    component: './Home',
  },

  {
    path: '/forum',
    name: 'Diễn đàn',
    icon: 'HomeOutlined',
    routes: [
      {
        path: '/forum',
        exact: true,
        name: 'Trang chủ',
        component: './Forum/ThreadList',
      },
      {
        path: '/forum/ask',
        name: 'Đặt câu hỏi',
        component: './Forum/AskQuestion',
      },
      {
        path: '/forum/question/:id',
        name: 'Chi tiết bài viết',
        component: './Forum/ThreadDetail',
        hideInMenu: true,
      },
      {
        path: '/forum/search',
        name: 'Tìm kiếm',
        component: './Forum/Search',
        hideInMenu: true,
      },
      {
        path: '/forum/tags',
        name: 'Tags',
        component: './Forum/Tags',
      },
      {
        path: '/forum/subjects',
        name: 'Môn học',
        component: './Forum/Subjects',
      },
    ],
  },

  {
    path: '/notifications',
    name: 'Thông báo',
    component: './Notifications',
  },

  {
    path: '/profile',
    name: 'Hồ sơ',
    component: './Profile',
  },

  {
    path: '/admin',
    name: 'Admin',
    icon: 'DashboardOutlined',
    routes: [
      {
        path: '/admin',
        redirect: '/admin/dashboard',
      },
      {
        path: '/admin/dashboard',
        name: 'Dashboard',
        component: './Admin/Dashboard',
      },
      {
        path: '/admin/users',
        name: 'Người dùng',
        component: './Admin/UserManagement',
      },
      {
        path: '/admin/posts',
        name: 'Bài viết',
        component: './Admin/PostManagement',
      },
      {
        path: '/admin/tags',
        name: 'Tags',
        component: './Admin/TagManagement',
      },
      {
        path: '/admin/analytics',
        name: 'Analytics',
        component: './Admin/Analytics',
      },
    ],
  },

  {
    path: '/403',
    component: './exception/403',
    layout: false,
  },
  {
    path: '/404',
    component: './exception/404',
    layout: false,
  },
  {
    component: './exception/404',
  },
];