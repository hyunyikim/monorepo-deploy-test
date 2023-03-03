import React, {ChangeEvent} from 'react';

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

export const formatCommaNum = (value: string | number) => {
	// const pureNumber = Number(value.split(',').join(''));
	let pureNumber;
	if (typeof value === 'number') {
		const stringNum = String(value);
		pureNumber = Number(stringNum.split(',').join(''));
	} else {
		pureNumber = Number(value.split(',').join(''));
	}

	if (isNaN(pureNumber)) {
		return '';
	}
	return pureNumber.toLocaleString();
};

export const formatDateString = (_str: string, _separator = '-') => {
	const pureNumber = (_str || '')
		.toString()
		.replace(/[^0-9]/g, '')
		.substring(0, 8);

	if (pureNumber.length === 8) {
		const regEx = /(\d{4})(\d{2})(\d{2})/g;

		return pureNumber.replace(regEx, `$1${_separator}$2${_separator}$3`);
	}

	if (pureNumber.length === 7) {
		const regEx = /(\d{4})(\d{2})(\d{1})/g;

		return pureNumber.replace(regEx, `$1${_separator}$2${_separator}$3`);
	}

	if (pureNumber.length === 6) {
		const regEx = /(\d{4})(\d{2})/;

		return pureNumber.replace(regEx, `$1${_separator}$2`);
	}

	if (pureNumber.length === 5) {
		const regEx = /(\d{4})(\d{1})/;

		return pureNumber.replace(regEx, `$1${_separator}$2`);
	}

	return pureNumber;
};

export const onChangeOnlyNumber = (
	e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
	const value = e?.target?.value;
	if (!value) {
		return;
	}
	e.target.value = value.replace(/[^0-9]/g, '') || '';
};

/**
 * 정규식 검증
 *
 * @param value
 * @param type
 * @returns {boolean|boolean}
 */
export const validateRegExp = (value: string, type: string) => {
	if (value && type) {
		const letterCheck = RegExp(/[ㄱ-ㅎ]/);
		const birthCheck = RegExp(/^[0-9]{8}$/);
		const dateCheck = RegExp(
			/(?:19|20)\d\d(?:0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])/
		);
		const userIdCheck = RegExp(/^[A-Za-z0-9_-]{5,20}$/);
		const passwordCheck = RegExp(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^*()-_=+\\|[]{};:'",.<>\/?]).{8,16}$/
		);
		const emailCheck = RegExp(
			/^[A-Za-z0-9_.-]+@[A-Za-z0-9-]+\.[A-Za-z0-9-]+/
		);
		const phoneNumberCheck = RegExp(/^01[0179][0-9]{7,8}$/);
		const urlCheck = RegExp(
			/^(http(s?):\/\/)([a-zA-Z0-9]+([-.]{1}[a-zA-Z0-9]+)*\.)([a-zA-Z]{2,6})(:[0-9]+)?(\/\S*)?/
		);

		switch (type) {
			case 'birth':
				return birthCheck.test(value);
			case 'letter':
				return letterCheck.test(value);
			case 'date':
				return dateCheck.test(value.toString().replace(/[^0-9]/g, ''));
			case 'userId':
				return userIdCheck.test(value);
			case 'password':
				return passwordCheck.test(value);
			case 'email':
				return emailCheck.test(value);
			case 'phone':
				return phoneNumberCheck.test(
					value.toString().replace(/[^0-9]/g, '')
				);
			case 'url':
				return urlCheck.test(value);
			default:
				return false;
		}
	}
	return false;
};
