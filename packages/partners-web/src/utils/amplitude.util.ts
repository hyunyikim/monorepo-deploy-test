import {useEffect} from 'react';

import amplitude from 'amplitude-js';

export const initAmplitudeTracking = () => {
	try {
		amplitude.getInstance().init(AMPLITUDE_API_KEY, null, {
			includeUtm: true,
			includeReferrer: true,
		});
	} catch (e) {
		alert(e);
		console.log(e);
	}
};

export const sendAmplitudeLog = (
	event: string,
	props?: Record<string, string>
) => {
	try {
		amplitude.getInstance().logEvent(event, props);
	} catch (e) {
		// console.log(e);
	}
};

// 페이지 진입시 앰플리튜드 요청
export const usePageView = (event: string, desc: string) => {
	useEffect(() => {
		sendAmplitudeLog(event, {
			pv_title: desc,
		});
	}, []);
};
