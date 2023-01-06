import {useEffect} from 'react';
import amplitude from 'amplitude-js';

import {B2BType} from '@/@types';

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
	props?: Record<string, string> | string
) => {
	try {
		if (typeof props === 'string') {
			props = JSON.parse(props);
		}
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

/**
 * 트래킹 회원정보 설정
 */
export const setTrackingUser = (
	email: string,
	b2bType: B2BType,
	companyName: string
) => {
	if (email && b2bType && companyName) {
		try {
			amplitude.getInstance().setUserId(email);
			const identify = new amplitude.Identify()
				.set('type', b2bType)
				.set('name', companyName);
			amplitude.getInstance().identify(identify);
		} catch (e) {
			console.log(e);
		}
	}
};
