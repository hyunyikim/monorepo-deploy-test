import {format} from 'date-fns';

import {DATE_FORMAT} from '@/data';

export const sortObjectByKey = (value: object) => {
	return Object.keys(value)
		.sort()
		.reduce((obj, key) => ((obj[key] = value[key]), obj), {});
};

export const formatPhoneNum = (_phoneNum: string, _separator = '-') => {
	let pureNumber = (_phoneNum || '')
		.toString()
		.replace('+82', '')
		.replace(/[^0-9]/g, '');

	if (_phoneNum) {
		if (pureNumber.startsWith('10')) {
			pureNumber = `0${pureNumber}`;
		}

		if (pureNumber.length === 11) {
			const regEx = /(\d{3})(\d{4})(\d{4})/;

			return pureNumber.replace(
				regEx,
				`$1${_separator}$2${_separator}$3`
			);
		}

		if (pureNumber.length >= 7) {
			const regEx = /(\d{3})(\d{3})(\d)/;

			return pureNumber.replace(
				regEx,
				`$1${_separator}$2${_separator}$3`
			);
		}

		if (pureNumber.length >= 4) {
			const regEx = /(\d{3})(\d)/;

			return pureNumber.replace(regEx, `$1${_separator}$2`);
		}

		return pureNumber;
	}
	return _phoneNum;
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
