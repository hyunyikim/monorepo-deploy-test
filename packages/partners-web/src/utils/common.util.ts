import {format} from 'date-fns';

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
