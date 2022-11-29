import {ReactNode, useEffect} from 'react';
import amplitude from 'amplitude-js';

import {sendAmplitudeLog} from '@/utils';

import {Container} from '@mui/material';

const handleClick = (e) => {
	const target = e.target;
	if (!target || !target?.dataset || !target?.dataset?.tracking) {
		return;
	}

	let trackingCode = target?.dataset?.tracking as string;
	trackingCode = trackingCode.replace(/'/gi, '"');

	const splittedTrackingCode = trackingCode.split(',');
	if (splittedTrackingCode?.length < 2) {
		return;
	}
	const [event, props] = splittedTrackingCode;

	// tracking 요청 보내기
	sendAmplitudeLog(event, props);
};

function AmplitudeTrackingInterceptor({children}: {children: ReactNode}) {
	useEffect(() => {
		document.addEventListener('click', handleClick);
		return () => {
			document.removeEventListener('click', handleClick);
		};
	}, []);

	return <Container>{children}</Container>;
}

export default AmplitudeTrackingInterceptor;
