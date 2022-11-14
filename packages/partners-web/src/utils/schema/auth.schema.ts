import * as yup from 'yup';

import {
	emailSchemaValidation,
	businessNumberSchemaValidation,
	phoneNumberSchemaValidation,
	passwordSchemaValidation,
	termSchemaValidation,
} from '@/utils/schema';
import {
	checkBusinessNumberDuplicated,
	checkEmailDuplicated,
} from '@/api/auth.api';

export const partnershipSignInSchemaShape = {
	email: yup.string().required('이메일 주소를 입력해주세요'),
	password: yup.string().required('비밀번호를 입력해주세요'),
};

export const partnershipSignupEmailSchemaShape = yup.object().shape({
	email: emailSchemaValidation.test({
		test: async (val) => {
			const isDuplicated = await checkEmailDuplicated(val as string);
			return !isDuplicated;
		},
		message: '이미 가입된 이메일 주소입니다.',
	}),
});

export const partnershipSignUpRestSchemaShape = yup.object().shape({
	companyName: yup.string().required('회사명을 입력해주세요.'),
	businessNum: businessNumberSchemaValidation.test({
		test: async (val) => {
			const formattedValue = val?.split('-').join('');
			const isDuplicated = await checkBusinessNumberDuplicated(
				formattedValue as string
			);
			return !isDuplicated;
		},
		message: '이미 가입된 사업자등록번호입니다.',
	}),
	phoneNum: phoneNumberSchemaValidation,
	password: passwordSchemaValidation,
	passwordConfirm: yup
		.string()
		.required('비밀번호가 다릅니다.')
		.oneOf([yup.ref('password'), null], '비밀번호가 다릅니다.'),
	isAgree: termSchemaValidation,
});

export const introductionInquirySchemaShape = yup.object().shape({
	name: yup.string().required('담당자 이름을 적어주세요'),
	email: emailSchemaValidation,
	companyName: yup.string().required('회사명을 입력해주세요.'),
	phoneNum: phoneNumberSchemaValidation,
	department: yup.string(),
	content: yup.string(),
	isAgree: termSchemaValidation,
});
