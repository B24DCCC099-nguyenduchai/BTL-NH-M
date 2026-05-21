import { useAuthActions } from '@/hooks/useAuthActions';
import { primaryColor } from '@/services/base/constant';
import axios from '@/utils/axios';
import { oidcConfig } from '@/utils/oidcConfig';
import { ConfigProvider } from 'antd';
import { useEffect, type FC } from 'react';
import { AuthProvider, useAuth } from 'react-oidc-context';

let OIDCBounderHandlers: ReturnType<typeof useAuthActions> | null = null;

const OIDCBounder_: FC = ({ children }) => {
	const auth = useAuth();
	const actions = useAuthActions();

	const handleAxios = (access_token: string) => {
		axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
	};



	// useEffect(() => {
	// 	// Nếu đang cập nhật thì bật cái này lên
	// 	// history.replace('/hold-on');
	// 	// return;

	// 	if (isUnauth || auth.isLoading) return;

	// 	// Chưa login + chưa có auth params ==> Cần redirect keycloak để lấy auth params + cookie
	// 	if (!hasAuthParams() && !auth.isAuthenticated) {
	// 		auth.signinRedirect();
	// 		return;
	// 	}

	// 	// Quá 5s nếu ko auth được thì xóa params
	// 	if (!timeout)
	// 		timeout = setTimeout(() => {
	// 			if (hasAuthParams() && !auth.isAuthenticated) redirectLocation();
	// 		}, 1000 * 5);

	// 	// Đã login => Xoá toàn bộ auth params được sử dụng để login trước đó
	// 	if (auth.isAuthenticated) {
	// 		if (hasAuthParams()) redirectLocation();
	// 		else {
	// 			if (timeout) clearTimeout(timeout);
	// 			handleLogin();
	// 		}
	// 	}
	// }, [auth.isAuthenticated, auth.isLoading]);

	useEffect(() => {
		if (auth.user?.access_token) handleAxios(auth.user.access_token);
	}, [auth.user?.access_token]);

	useEffect(() => {
		OIDCBounderHandlers = actions;
	}, [actions]);

	useEffect(() => {
		// Đổi màu real time => Hỗ trợ đổi tenant
		ConfigProvider.config({ theme: { primaryColor } });
	}, []);

	return <>{children}</>;
	// return <>{(auth.isLoading || initialState?.permissionLoading) && !isUnauth ? <LoadingPage /> : children}</>;
};

export const OIDCBounder: FC & { getActions: () => typeof OIDCBounderHandlers } = (props) => {
	return (
		<AuthProvider
			{...oidcConfig}
			redirect_uri={window.location.pathname.includes('/user') ? window.location.origin : window.location.href}
		>
			<OIDCBounder_ {...props} />
		</AuthProvider>
	);
};

OIDCBounder.getActions = () => OIDCBounderHandlers;
