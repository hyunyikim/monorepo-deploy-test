import {Outlet} from 'react-router-dom';

import {MessageDialog} from '@/components';

/**
 * 모든 라우터에 공통으로 삽입되는 컴포넌트
 */
function RouterWrapper() {
	return (
		<>
			<Outlet />
			<MessageDialog />
		</>
	);
}

export default RouterWrapper;
