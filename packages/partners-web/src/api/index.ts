import axios, {Axios, AxiosRequestConfig, AxiosResponse} from 'axios';

import {useLoginStore} from '@/stores';

interface CustomAxios extends Axios {
	get<T = any, R = T, D = any>(
		url: string,
		config?: AxiosRequestConfig<D>
	): Promise<R>;
	post<T = any, R = T, D = any>(
		url: string,
		data?: D,
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
	patch<T = any, R = T, D = any>(
		url: string,
		data?: D,
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

authInstance.interceptors.response.use(
	(response: AxiosResponse) => {
		return response?.data as unknown;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export {nonAuthInstance, authInstance as instance};
