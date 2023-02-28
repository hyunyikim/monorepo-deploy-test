import create from 'zustand';

export const TOKEN_KEY = 'token';
export const LAST_TIME_LOGIN_KEY = 'lastTime';

interface LoginState {
	token: string | null;
	isLogin: () => boolean;
	setLogin: (token: string) => void;
	setLogout: () => void;
}

export const useLoginStore = create<LoginState>((set, get) => ({
	token: localStorage.getItem(TOKEN_KEY),
	// 구독 여부 확인
	isLogin: () => {
		return get().token ? true : false;
	},
	setLogin: (token: string) =>
		set(() => {
			localStorage.setItem(TOKEN_KEY, token);
			localStorage.setItem(
				LAST_TIME_LOGIN_KEY,
				String(new Date().getTime())
			);
			return {token};
		}),
	setLogout: () => {
		set(() => {
			localStorage.removeItem(TOKEN_KEY);
			localStorage.removeItem(LAST_TIME_LOGIN_KEY);

			// 개런티 설정 임시저장 데이터
			const getSavedData = localStorage.getItem('hasInputDataSaved');
			if (getSavedData) {
				localStorage.removeItem('hasInputDataSaved');
				localStorage.removeItem('afterServiceInfo');
				localStorage.removeItem('authInfo');
				localStorage.removeItem('brandName');
				localStorage.removeItem('brandNameEN');
				localStorage.removeItem('customerCenterUrl');
				localStorage.removeItem('returnInfo');
				localStorage.removeItem('warrantyDate');
			}
			return {
				token: null,
			};
		});
	},
}));
