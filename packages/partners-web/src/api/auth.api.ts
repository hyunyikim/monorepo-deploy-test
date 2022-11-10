import {
	SignInRequestRequestParam,
	SignInResponse,
	SignUpResponse,
} from '@/@types';
import {nonAuthInstance} from '@/api';

export const signIn = async (params: SignInRequestRequestParam) => {
	return await nonAuthInstance.post<SignInResponse>(
		'/v1/admin/partnerships/sign-in',
		params
	);
};

export const checkEmailDuplicated = async (email: string) => {
	try {
		const res = await nonAuthInstance.get<boolean>(
			'/v1/admin/partnerships/email/duplication',
			{
				params: {
					email,
				},
			}
		);
		return res.data;
	} catch (e) {
		return false;
	}
};

export const checkBusinessNumberDuplicated = async (businessNo: string) => {
	try {
		const res = await nonAuthInstance.get<boolean>(
			'/v1/admin/partnerships/businessNo/duplication',
			{
				params: {
					businessNo,
				},
			}
		);
		return res.data;
	} catch (e) {
		return false;
	}
};

export const signUp = async (params: FormData) => {
	return await nonAuthInstance.post<SignUpResponse>(
		'/v1/admin/partnerships/sign-up',
		params
	);
};

export const sendEmailVerification = async (email: string) => {
	return await nonAuthInstance.post('/v1/admin/partnerships/email/confirm', {
		email,
	});
};
