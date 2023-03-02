import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';

import {CustomAxios} from '@/@types';
import {useLoginStore} from '@/stores';

const nonAuthInstance = axios.create({
	baseURL: API_URL,
});

// Header token: 토큰
const authInstance: CustomAxios = axios.create({
	baseURL: API_URL,
});

// Header Authorization: Bearer 토큰
const bearerTokenInstance: CustomAxios = axios.create({
	baseURL: API_URL,
});

let token = useLoginStore.getState().token;
useLoginStore.subscribe((state) => {
	token = state.token;
});

authInstance.interceptors.request.use(
	(config: AxiosRequestConfig) => {
		if (!config.headers || !token) {
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

bearerTokenInstance.interceptors.request.use(
	(config: AxiosRequestConfig) => {
		if (!config.headers || !token) {
			throw new Error('');
		}
		config.headers.Authorization = `Bearer ${token}`;
		return config;
	},
	(error) => Promise.reject(error)
);

bearerTokenInstance.interceptors.response.use(
	(response: AxiosResponse) => {
		return response?.data as unknown;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export {nonAuthInstance, authInstance as instance, bearerTokenInstance};
