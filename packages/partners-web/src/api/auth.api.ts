import {SignInRequest, SignInResponse} from '@/@types';
import {nonAuthInstance} from '@/api';

export const signIn = async (params: SignInRequest) => {
	return await nonAuthInstance.post<SignInResponse>(
		'/v1/admin/partnerships/sign-in',
		params
	);
};
