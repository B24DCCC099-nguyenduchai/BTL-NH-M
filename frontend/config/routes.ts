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
				path: '/user',
				redirect: '/user/login',
			},
		],
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
		],
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
		],
	},

	{
		path: '/',
		redirect: '/forum',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
