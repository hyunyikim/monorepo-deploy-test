import {useEffect, useRef} from 'react';
import {Outlet, useLocation} from 'react-router-dom';
import {parse} from 'qs';

import {Box} from '@mui/material';

import {TOKEN_KEY, useLoginStore} from '@/stores';

interface Props {
	children?: React.ReactElement;
}

function IframeChild({children}: Props) {
	const location = useLocation();
	const setLogin = useLoginStore((state) => state.setLogin);
	const setLogout = useLoginStore((state) => state.setLogout);

	const iframeChildWrapperRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		// 부모로부터 토큰값 받아옴
		const parsedSearch = parse(location.search, {
			ignoreQueryPrefix: true,
		});

		const tokenFromParsedSearch = (parsedSearch?.token as string) ?? null;
		if (!tokenFromParsedSearch) {
			setLogout();
			return;
		}

		localStorage.setItem(TOKEN_KEY, tokenFromParsedSearch);
		setLogin(tokenFromParsedSearch);
	}, [location.search]);

	return (
		<Box
			id="content-wrapper"
			ref={iframeChildWrapperRef}
			sx={{
				height: '100%',
				padding: '40px',
			}}>
			{children ? children : <Outlet />}
		</Box>
	);
}

export default IframeChild;
