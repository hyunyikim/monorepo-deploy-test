import axios, {Axios, AxiosRequestConfig, AxiosResponse} from 'axios';

import {TOKEN_KEY, useMessageDialog} from '@/stores';

interface CustomAxios extends Axios {
	get<T = any, R = T, D = any>(
		url: string,
		config?: AxiosRequestConfig<D>
	): Promise<R>;
	put<T = any, R = T, D = any>(
		url: string,
		data?: D,
		config?: AxiosRequestConfig<D>
	): Promise<R>;
	delete<T = any, R = T, D = any>(
		url: string,
		config?: AxiosRequestConfig<D>
	): Promise<R>;
}

const API_URL = process.env.API_URL as string;

const nonAuthInstance = axios.create({
	baseURL: API_URL,
});

const authInstance: CustomAxios = axios.create({
	baseURL: API_URL,
});

authInstance.interceptors.request.use(
	(config: AxiosRequestConfig) => {
		// TODO: zustand subcribe로 변경
		const token = localStorage.getItem(TOKEN_KEY);

		if (!config.headers || !token) {
			// window.location.replace('/auth/signin');
			// return;
			throw new Error('');
		}
		config.headers['token'] = token;
		return config;
	},
	(error) => Promise.reject(error)
);

const onOpen = useMessageDialog.getState().onOpen;

authInstance.interceptors.response.use(
	(response: AxiosResponse) => {
		return response?.data as unknown;
	},
	(error) => {
		// 공통 예외 처리
		onOpen('네트워크 에러');
		return Promise.reject(error);
	}
);

export {nonAuthInstance, authInstance as instance};
