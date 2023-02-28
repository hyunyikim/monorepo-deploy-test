import {
	LAST_TIME_LOGIN_KEY,
	useGetPartnershipInfo,
	useLoginStore,
} from '@/stores';
import React, {useCallback, useEffect} from 'react';
import {Navigate, useLocation, useNavigate} from 'react-router-dom';

function CheckAuth({children}: {children: React.ReactElement}) {
	return (
		<CheckLogin>
			<CheckSignedOut>
				<CheckLastTimeLogin>{children}</CheckLastTimeLogin>
			</CheckSignedOut>
		</CheckLogin>
	);
}

/**
 * 로그인 여부 체크
 */
const CheckLogin = ({children}: {children: React.ReactElement}) => {
	const isLogin = useLoginStore((state) => state.isLogin)();
	if (isLogin) {
		return children;
	}
	return <Navigate to="/" />;
};

/**
 * 탈퇴 요청 체크
 */
const CheckSignedOut = ({children}: {children: React.ReactElement}) => {
	const {pathname} = useLocation();
	const navigate = useNavigate();
	const {data: partnershipData} = useGetPartnershipInfo();

	useEffect(() => {
		const hasLeft = partnershipData?.isLeaved;
		if (hasLeft === 'Y') {
			navigate('/signedout', {
				replace: true,
			});
			return;
		}
	}, [partnershipData, pathname]);
	return children;
};

/**
 * 로그인 시간 체크
 */
const CheckLastTimeLogin = ({children}: {children: React.ReactElement}) => {
	const setLogout = useLoginStore((state) => state.setLogout);
	const currentTime = new Date().getTime();
	const lastTimeLoggedIn = localStorage.getItem(LAST_TIME_LOGIN_KEY);

	const renewLastTime = useCallback(() => {
		localStorage.setItem('lastTime', String(currentTime));
	}, []);

	// 자동로그아웃이 추가되기전에 이미 로그인된 사용자들 로그아웃
	if (!lastTimeLoggedIn) {
		setLogout();
		return <Navigate to="/auth/login" />;
	}

	const timeDifference = currentTime - Number(lastTimeLoggedIn);
	const ms = 1000;
	const min = 60;
	const hour = 60;
	const sixHour = 6;

	// 페이지 이동없이 페이지에 머문 시간이 6시간 넘었으면, 로그아웃
	const isOver6Hour = timeDifference / ms / min / hour >= sixHour;
	if (isOver6Hour) {
		setLogout();
		alert('장시간 로그인되어서 로그아웃 되었습니다. 다시 로그인 해주세요');
		return <Navigate to="/auth/login" />;
	}

	// 페이지 이동시 6시간 만료가 안되었다면, last time 값 갱신
	renewLastTime();
	return children;
};

export default CheckAuth;
