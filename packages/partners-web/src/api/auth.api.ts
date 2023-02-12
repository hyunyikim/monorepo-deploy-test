import {
	SignInRequestRequestParam,
	SignInResponse,
	SignoutType,
	SignUpResponse,
} from '@/@types';
import {nonAuthInstance, instance} from '@/api';

export const signIn = async (params: SignInRequestRequestParam) => {
	return await nonAuthInstance.post<SignInResponse>(
		'/v1/admin/partnerships/sign-in',
		params
	);
};

// 비밀번호 초기화
export const resetPassword = async (email: string) => {
	return await nonAuthInstance.patch(
		'/v1/admin/partnerships/password/reset',
		{
			email,
		}
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

// 프로필 설정 - 패스워드 수정
export const changePassword = async (params: {
	curPassword: string;
	newPassword: string;
}) => {
	return await instance.patch('/v1/admin/partnerships/password', params);
};

// 프로필 설정 - 기본정보 수정
export const changeProfileInfo = async (params: FormData) => {
	return await instance.patch('/v1/admin/partnerships', params);
};

/* 회원탈퇴 요청 */
export const requestSignout = async (params: SignoutType) => {
	return await instance.patch('/v1/admin/partnerships/withdraw', params);
};

/* 회원탈퇴 철회 요청 */
export const cancleRequestSignout = async (
	params: Pick<SignoutType, 'password'>
) => {
	return await instance.patch(
		'v1/admin/partnerships/withdraw/cancel',
		params
	);
};
