import {useEffect, useState, useRef} from 'react';
import {Outlet, useLocation} from 'react-router-dom';
import {parse} from 'qs';

import {Box} from '@mui/material';

import {TOKEN_KEY} from '@/stores';
import {sendResizedIframeChildHeight} from '@/utils';

const MIN_HEIGHT = 550 + 10;
const resizeIframeChildHeight = (
	iframeChildWrapperEle: HTMLDivElement | null
) => {
	if (iframeChildWrapperEle) {
		let height = (iframeChildWrapperEle?.clientHeight || 1130) + 10;
		height = height < MIN_HEIGHT ? MIN_HEIGHT : height;
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
		const tokenFromParsedSearch = (parsedSearch?.token as string) ?? null;
		if (!tokenFromParsedSearch) {
			return;
		}

		setToken(tokenFromParsedSearch);
		localStorage.setItem(TOKEN_KEY, tokenFromParsedSearch);
		localStorage.setItem(
			'b2btype',
			(parsedSearch?.b2btype || '') as string
		);
		localStorage.setItem('email', (parsedSearch?.email || '') as string);
		localStorage.setItem(
			'useFieldModelNum',
			(parsedSearch?.useFieldModelNum || 'Y') as string
		);
	}, [location.search, token]);

	useEffect(() => {
		let observer: MutationObserver | null = null;
		const iframeChildWrapperEle = iframeChildWrapperRef?.current;
		if (!iframeChildWrapperEle) {
			return;
		}

		document.body.style.overflowY = 'hidden';
		observer = mutationObserver(iframeChildWrapperEle);

		observer.observe(iframeChildWrapperEle, {
			childList: true, // 자식 요소에 변화 생길 경우
			subtree: true, // 후손 요소에 변화 생길 경우
		});
		return () => {
			document.body.style.overflowY = 'auto';
			observer && observer.disconnect();
		};
	}, []);

	return (
		<Box
			id="content-wrapper"
			ref={iframeChildWrapperRef}
			sx={{
				height: '100%',
			}}>
			<Outlet />
		</Box>
	);
}

export default IframeChild;
