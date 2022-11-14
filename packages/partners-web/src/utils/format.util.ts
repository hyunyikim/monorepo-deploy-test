import {ChangeEvent} from 'react';

type HandleChangeDataFormat = 'phoneNum' | 'businessNum';

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
	}
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

export const formatBusinessNum = (_businessNum: string, _separator = '-') => {
	const pureNumber = _businessNum?.replace(/[^0-9]/g, '');
	if (_businessNum) {
		if (pureNumber.length === 10) {
			const regEx = /(\d{3})(\d{2})(\d)/;

			return pureNumber.replace(
				regEx,
				`$1${_separator}$2${_separator}$3`
			);
		}

		if (pureNumber.length >= 6) {
			const regEx = /(\d{3})(\d{2})(\d)/;

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
	return _businessNum;
};
