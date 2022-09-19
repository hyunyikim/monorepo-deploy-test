import axios, {AxiosInstance} from 'axios';

const nonAuthInstance = axios.create({
	baseURL: process.env.API_URL,
});

const authInstance: AxiosInstance = axios.create({
	baseURL: process.env.API_URL,
	// TODO: set token to header
});

authInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		// TODO: 공통 예외 처리
		return Promise.reject(error);
	}
);

export {nonAuthInstance, authInstance as instance};
