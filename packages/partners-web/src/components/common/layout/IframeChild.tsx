import {useEffect, useRef} from 'react';
import {Outlet, useLocation, useNavigate} from 'react-router-dom';
import {parse, stringify} from 'qs';

import {Box} from '@mui/material';

import {useLoginStore} from '@/stores';

interface Props {
	children?: React.ReactElement;
}

function IframeChild({children}: Props) {
	const location = useLocation();
	const navigate = useNavigate();

	const setLogin = useLoginStore((state) => state.setLogin);
	const setLogout = useLoginStore((state) => state.setLogout);

	const iframeChildWrapperRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const {search, pathname} = location;

		// 부모로부터 토큰값 받아옴
		const parsedSearch = parse(search, {
			ignoreQueryPrefix: true,
		});

		if (parsedSearch.hasOwnProperty('iframe-parent-state')) {
			const iframeParentState = parsedSearch['iframe-parent-state'];
			const restSearch: Record<string, any> = {};
			Object.keys(parsedSearch)
				.filter((key) => key !== 'iframe-parent-state')
				.forEach((key: string) => {
					restSearch[key] = parsedSearch[key];
				});
			// 부모로부터 iframe url search로 넘어온 state를 location search로 변환해줌
			navigate(
				`${pathname}?${stringify({
					...restSearch,
				})}`,
				{
					replace: true,
					state: JSON.parse(iframeParentState as string),
				}
			);
		}

		// 쿼리스트링에 토큰이 넘어오는 경우에만 체크
		const searchHasToken = parsedSearch.hasOwnProperty('token');
		if (!searchHasToken) {
			return;
		}

		const tokenFromParsedSearch = (parsedSearch?.token as string) ?? null;
		if (!tokenFromParsedSearch) {
			setLogout();
			return;
		}
		setLogin(tokenFromParsedSearch);
	}, [location]);

	// 부모 iframe으로 전달 받은 state 값이 있다면 location state로 변환해준 후 렌더링
	if (location?.search.includes('iframe-parent-state')) {
		return <></>;
	}

	return (
		<Box
			id="content-wrapper"
			ref={iframeChildWrapperRef}
			sx={{
				height: '100%',
				padding: {
					xs: '16px',
					md: '0',
				},
			}}>
			{children ? children : <Outlet />}
		</Box>
	);
}

export default IframeChild;
