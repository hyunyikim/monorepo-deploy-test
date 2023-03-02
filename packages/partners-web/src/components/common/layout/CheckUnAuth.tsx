import {Navigate, Outlet} from 'react-router-dom';

import {useLoginStore} from '@/stores';

/**
 * 로그인이 되지 않았는지 체크
 */
function CheckUnAuth() {
	const isLogin = useLoginStore((state) => state.isLogin)();
	if (!isLogin) {
		return <Outlet />;
	}
	return <Navigate to="/dashboard" />;
}

export default CheckUnAuth;
