import * as yup from 'yup';

import {
	phoneNumberFormat,
	businessNumberFormat,
	passwordFormat,
} from '@/utils/regex.util';

export const emailSchemaValidation = yup
	.string()
	.required('이메일 주소를 입력해주세요')
	.email('유효하지 않은 이메일 주소입니다.');
export const businessNumberSchemaValidation = yup
	.string()
	.required('사업자등록번호 10자리를 모두 입력해주세요.')
	.matches(businessNumberFormat, '사업자등록번호 형식을 확인해주세요.');
export const phoneNumberSchemaValidation = yup
	.string()
	.required('휴대전화번호 11자리를 모두 입력해주세요.')
	.matches(phoneNumberFormat, '휴대전화번호 형식을 확인해주세요.');

export const passwordSchemaValidation = yup
	.string()
	.required('비밀번호를 입력해주세요')
	.matches(
		passwordFormat,
		'비밀번호는 8자리 이상 영문, 숫자, 특수문자 조합으로 설정되어야 합니다.'
	);

export const profileSettingPasswordSchemaValidation = yup
	.string()
	.matches(passwordFormat, {
		message:
			'비밀번호는 8자리 이상 영문, 숫자, 특수문자 조합으로 설정되어야 합니다.',
		excludeEmptyString: true,
	});

export const termSchemaValidation = yup
	.boolean()
	.oneOf([true], '약관에 동의해주세요.');
