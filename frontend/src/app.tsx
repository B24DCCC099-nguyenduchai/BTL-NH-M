import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { notification } from 'antd';
import 'moment/locale/vi';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { getIntl, getLocale, history } from 'umi';
import type { RequestOptionsInit, ResponseError } from 'umi-request';
import ErrorBoundary from './components/ErrorBoundary';
import NotAccessible from './pages/exception/403';
import NotFoundContent from './pages/exception/404';
import type { IInitialState } from './services/base/typing';
import { getProfile } from '@/services/authApi';
import './styles/global.less';

/** loading */
export const initialStateConfig = {
  loading: <></>,
};

export async function getInitialState(): Promise<IInitialState> {
  const token = localStorage.getItem('token');

  if (!token) {
    return {
      currentUser: null,
      permissionLoading: false,
      settings: {
        navTheme: 'light',
        layout: 'mix',
        contentWidth: 'Fluid',
        fixedHeader: true,
        fixSiderbar: true,
      },
      authorizedPermissions: [],
    };
  }

  try {
    const response = await getProfile();

    return {
      currentUser: response.data,
      permissionLoading: false,
      settings: {
        navTheme: 'light',
        layout: 'mix',
        contentWidth: 'Fluid',
        fixedHeader: true,
        fixSiderbar: true,
      },
      authorizedPermissions: [],
    };
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    return {
      currentUser: null,
      permissionLoading: false,
      settings: {
        navTheme: 'light',
        layout: 'mix',
        contentWidth: 'Fluid',
        fixedHeader: true,
        fixSiderbar: true,
      },
      authorizedPermissions: [],
    };
  }
}

const authHeaderInterceptor = (url: string, options: RequestOptionsInit) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return {
      url,
      options,
    };
  }

  return {
    url,
    options: {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    },
  };
};

/**
 * @see https://beta-pro.ant.design/docs/request-cn
 */
export const request: RequestConfig = {
  errorHandler: (error: ResponseError) => {
    const { messages } = getIntl(getLocale());
    const { response } = error;

    if (response && response.status) {
      const { status, statusText, url } = response;
      const requestErrorMessage = messages['app.request.error'];
      const errorMessage = `${requestErrorMessage} ${status}: ${url}`;
      const errorDescription = messages[`app.request.${status}`] || statusText;

      notification.error({
        message: errorMessage,
        description: errorDescription,
      });

      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        if (!window.location.pathname.startsWith('/user')) {
          history.push('/user/login');
        }
      }
    }

    if (!response) {
      notification.error({
        description: 'Yêu cầu gặp lỗi',
        message: 'Bạn hãy thử lại sau',
      });
    }

    throw error;
  },
  requestInterceptors: [authHeaderInterceptor],
};

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    unAccessible: <NotAccessible />,
    noFound: <NotFoundContent />,
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,

    onPageChange: () => {
      const { pathname } = history.location;
      const token = localStorage.getItem('token');
      const role = initialState?.currentUser?.role;

      const publicPaths = [
        '/',
        '/user/login',
        '/user/register',
        '/user/forgot-password',
        '/user/reset-password',
        '/403',
        '/404',
      ];

      if (!token && !publicPaths.includes(pathname)) {
        history.replace('/user/login');
        return;
      }

      if (token && pathname.startsWith('/user')) {
        history.replace('/forum');
        return;
      }

      if (token && pathname === '/') {
        history.replace('/forum');
        return;
      }

      if (pathname.startsWith('/admin') && role !== 'admin') {
        history.replace('/403');
      }
    },

    menuItemRender: (item: any, dom: any) => (
      <a
        className="not-underline"
        key={item?.path}
        href={item?.path}
        onClick={(e) => {
          e.preventDefault();
          history.push(item?.path ?? '/');
        }}
        style={{ display: 'block' }}
      >
        {dom}
      </a>
    ),

    childrenRender: (dom) => (
      <ErrorBoundary>
        {dom}
      </ErrorBoundary>
    ),

    menuHeaderRender: undefined,
    ...initialState?.settings,
  };
};