import {useEffect, useState, useRef} from 'react';
import {Outlet, useLocation} from 'react-router-dom';
import {parse} from 'qs';

import {Box} from '@mui/material';

import {TOKEN_KEY} from '@/stores';
import {sendResizedIframeChildHeight} from '@/utils';

const resizeIframeChildHeight = (
	iframeChildWrapperEle: HTMLDivElement | null
) => {
	if (iframeChildWrapperEle) {
		const height = iframeChildWrapperEle?.clientHeight || 1130;
		sendResizedIframeChildHeight(height);
	}
};
const mutationObserver = (iframeChildWrapperEle: HTMLDivElement) => {
	return new MutationObserver((mutations) => {
		mutations.forEach(function (mutation, idx) {
			// mutations가 일어날 때 첫 번째만 call
			if (idx === 0) {
				resizeIframeChildHeight(iframeChildWrapperEle);
			}
		});
	});
};

function IframeChild() {
	const location = useLocation();
	const [token, setToken] = useState<string | null>(null);

	const iframeChildWrapperRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		// 부모로부터 토큰값 받아옴
		const parsedSearch = parse(location.search, {
			ignoreQueryPrefix: true,
		});
		if (!parsedSearch.hasOwnProperty('token')) {
			return;
		}
		const tokenFromParsedSearch = (parsedSearch?.token ?? '') as string;
		if (token && tokenFromParsedSearch === token) {
			return;
		}
		setToken(tokenFromParsedSearch);
		localStorage.setItem(TOKEN_KEY, tokenFromParsedSearch);
		localStorage.setItem(
			'b2btype',
			(parsedSearch?.b2btype || '') as string
		);
		localStorage.setItem('email', (parsedSearch?.email || '') as string);
	}, [location.search, token]);

	useEffect(() => {
		let observer: MutationObserver | null = null;
		// 데이터 조회 대상이 되는 테이블
		const tables = document.getElementsByClassName('MuiTableBody-root');
		const iframeChildWrapperEle = iframeChildWrapperRef?.current;
		if (!iframeChildWrapperEle || !tables) {
			return;
		}

		document.body.style.overflowY = 'hidden';
		if (tables?.length > 0) {
			observer = mutationObserver(iframeChildWrapperEle);
			observer.observe(tables[0], {childList: true});
		}
		return () => {
			document.body.style.overflowY = 'auto';
			observer && observer.disconnect();
		};
	}, []);

	return (
		<Box id="content-wrapper" ref={iframeChildWrapperRef}>
			<Outlet />
		</Box>
	);
}

export default IframeChild;
