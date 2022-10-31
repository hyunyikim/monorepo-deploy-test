import yup from 'yup';

export const partnershipSignInSchemaShape = {
	email: yup.string().required('이메일 주소를 입력해주세요'),
	password: yup.string().required('비밀번호를 입력해주세요'),
};
