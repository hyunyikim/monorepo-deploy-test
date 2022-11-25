import axios, {Axios, AxiosRequestConfig, AxiosResponse} from 'axios';

import {useLoginStore, useMessageDialog} from '@/stores';
import {openParantModal} from '@/utils';

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

const nonAuthInstance = axios.create({
	baseURL: API_URL,
});

const authInstance: CustomAxios = axios.create({
	baseURL: API_URL,
});

let token = useLoginStore.getState().token;
useLoginStore.subscribe((state) => {
	token = state.token;
});

authInstance.interceptors.request.use(
	(config: AxiosRequestConfig) => {
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

// const onOpen = useMessageDialog.getState().onOpen;

authInstance.interceptors.response.use(
	(response: AxiosResponse) => {
		return response?.data as unknown;
	},
	(error) => {
		// 공통 예외 처리
		// onOpen('네트워크 에러');

		// 부모창으로 에러 모달 띄움
		openParantModal({
			title: '알림',
			content: `<div style="min-width: 300px;font-size: 14px;font-weight: 500;">네트워크 에러</div>`,
		});
		return Promise.reject(error);
	}
);

export {nonAuthInstance, authInstance as instance};
