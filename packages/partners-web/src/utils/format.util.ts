import {ChangeEvent} from 'react';

type HandleChangeDataFormat = 'phoneNum' | 'businessNum' | 'date' | 'commaNum';

export const handleChangeDataFormat = (
	type: HandleChangeDataFormat,
	e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
	const value = e?.target?.value || '';

	switch (type) {
		case 'phoneNum':
			return formatPhoneNum(value);
		case 'businessNum':
			return formatBusinessNum(value);
		case 'date':
			return formatDate(value);
		case 'commaNum':
			return formatCommaNum(value);
	}
};

export const formatPhoneNum = (phoneNum: string, separator = '-') => {
	let pureNumber = (phoneNum || '')
		.toString()
		.replace('+82', '')
		.replace(/[^0-9]/g, '');

	if (phoneNum) {
		if (pureNumber.startsWith('10')) {
			pureNumber = `0${pureNumber}`;
		}

		if (pureNumber.length === 11) {
			const regEx = /(\d{3})(\d{4})(\d{4})/;

			return pureNumber.replace(regEx, `$1${separator}$2${separator}$3`);
		}

		if (pureNumber.length >= 7) {
			const regEx = /(\d{3})(\d{3})(\d)/;

			return pureNumber.replace(regEx, `$1${separator}$2${separator}$3`);
		}

		if (pureNumber.length >= 4) {
			const regEx = /(\d{3})(\d)/;

			return pureNumber.replace(regEx, `$1${separator}$2`);
		}

		return pureNumber;
	}
	return phoneNum;
};

export const formatBusinessNum = (businessNum: string, separator = '-') => {
	const pureNumber = businessNum?.replace(/[^0-9]/g, '');
	if (businessNum) {
		if (pureNumber.length === 10) {
			const regEx = /(\d{3})(\d{2})(\d)/;

			return pureNumber.replace(regEx, `$1${separator}$2${separator}$3`);
		}

		if (pureNumber.length >= 6) {
			const regEx = /(\d{3})(\d{2})(\d)/;

			return pureNumber.replace(regEx, `$1${separator}$2${separator}$3`);
		}

		if (pureNumber.length >= 4) {
			const regEx = /(\d{3})(\d)/;

			return pureNumber.replace(regEx, `$1${separator}$2`);
		}

		return pureNumber;
	}
	return businessNum;
};

const formatDate = (value: string, separator = '-') => {
	const pureNumber = (value || '')
		.toString()
		.replace(/[^0-9]/g, '')
		.substring(0, 8);

	if (pureNumber.length === 8) {
		const regEx = /(\d{4})(\d{2})(\d{2})/g;

		return pureNumber.replace(regEx, `$1${separator}$2${separator}$3`);
	}

	if (pureNumber.length === 7) {
		const regEx = /(\d{4})(\d{2})(\d{1})/g;

		return pureNumber.replace(regEx, `$1${separator}$2${separator}$3`);
	}

	if (pureNumber.length === 6) {
		const regEx = /(\d{4})(\d{2})/;

		return pureNumber.replace(regEx, `$1${separator}$2`);
	}

	if (pureNumber.length === 5) {
		const regEx = /(\d{4})(\d{1})/;

		return pureNumber.replace(regEx, `$1${separator}$2`);
	}
	return pureNumber;
};

const formatCommaNum = (value: string) => {
	const pureNumber = Number(value.split(',').join(''));
	if (isNaN(pureNumber)) {
		return '';
	}
	return pureNumber.toLocaleString();
};
