import {format} from 'date-fns';
import loadImage from 'image-promise';

import {DATE_FORMAT} from '@/data';

export const sortObjectByKey = (value: object) => {
	return Object.keys(value)
		.sort()
		.reduce((obj, key) => ((obj[key] = value[key]), obj), {});
};

type MinUnit = 'MINUTE' | 'HOUR' | 'DAY' | 'MONTH' | 'YEAR';

export const getDateByUnit = (value: Date) => {
	const gapMin = Math.ceil(
		(new Date().getTime() - value.getTime()) / (1000 * 60)
	);

	let dateStr = '';
	if (gapMin < 60) {
		dateStr = `${gapMin} 분전`;
	} else if (gapMin < 60 * 24) {
		dateStr = `${Math.ceil(gapMin / 60)} 시간전`;
	} else if (gapMin < 60 * 24 * 31) {
		dateStr = `${Math.ceil(gapMin / 60 / 24)} 일전`;
	} else if (gapMin < 60 * 24 * 365) {
		dateStr = `${Math.ceil(gapMin / 60 / 24 / 31)} 개월전`;
	} else {
		dateStr = `${Math.ceil(gapMin / 60 / 24 / 365)} 년전`;
	}
};

export const getDateByUnitHour = (value: Date) => {
	const gapMin = Math.ceil(
		(new Date().getTime() - value.getTime()) / (1000 * 60)
	);
	// if (gapMin < 60) {
	// 	return `${gapMin} 분전`;
	// }
	if (gapMin < 60 * 24) {
		return `${Math.ceil(gapMin / 60)} 시간전`;
	}
	return format(value, DATE_FORMAT);
};

export const delay = (ms: number) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve('');
		}, ms);
	});
};

export const textLineChangeHelper = (_text: string) => {
	if (_text.includes('\n')) {
		return _text.split('\n');
	}

	return [_text];
};

/**
 * http, https 프로토콜이 붙지 않은 url인지 체크
 */
export const linkFormChecker = (_text: string) => {
	const urlRegExp = RegExp(
		/^([a-zA-Z0-9]+([-.]{1}[a-zA-Z0-9]+)*\.)([a-zA-Z]{2,6})(:[0-9]+)?(\/\S*)?/
	);

	return urlRegExp.test(String(_text));
};


export const dashboardDateStack = () => {
	const day = 24;
	const hour = 60;
	const min = 60;
	const ms = 1000;
	const todayTimeStamp = new Date().getTime() - hour * min * ms;
	const yesterdayTimeStamp = new Date().getTime() - day * hour * min * ms;
	const previousWeekTimeStamp =
		new Date().getTime() - 7 * day * hour * min * ms;
	const previousMonthTimeStamp =
		new Date().getTime() - 28 * day * hour * min * ms;

	const today = new Date(todayTimeStamp).toISOString().split('T', 1)[0];
	const yesterday = new Date(yesterdayTimeStamp)
		.toISOString()
		.split('T', 1)[0];
	const previousWeek = new Date(previousWeekTimeStamp)
		.toISOString()
		.split('T', 1)[0];
	const previousMonth = new Date(previousMonthTimeStamp)
		.toISOString()
		.split('T', 1)[0];

	return {
		today,
		todayTimeStamp,
		previousWeek,
		previousWeekTimeStamp,
		previousMonth,
		previousMonthTimeStamp,
	};

/**
 * 이미지 체크
 * @param _url
 * @returns {Promise<boolean>}
 */
export const isValidWebImage = async (_url: string) => {
	try {
		const result = await loadImage(_url);
		return !!result;
	} catch (error) {
		return false;
	}
};

/**
 * 마지막 글자 받침 유무 찾기
 */
export const isEndWithConsonant = (_str: string) => {
	const finalCharCode = _str.charCodeAt(_str.length - 1);
	// 0 = 받침 없음, 그 외 = 받침 있음
	const finalConsonantCode = (finalCharCode - 44032) % 28;
	return finalConsonantCode !== 0;

};
