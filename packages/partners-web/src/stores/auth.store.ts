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
	// TODO: 현재 모노레포로 전체 이관 후 토큰 local storage에 저장하도록 수정
	// token: localStorage.getItem(TOKEN_KEY),
	// 구독 여부 확인
	isLogin: () => {
		return get().token ? true : false;
	},
	token: null,
	setLogin: (token: string) =>
		set(() => {
			// localStorage.setItem(TOKEN_KEY, token);
			// localStorage.setItem(
			// 	LAST_TIME_LOGIN_KEY,
			// 	String(new Date().getTime())
			// );
			return {token};
		}),
	setLogout: () => {
		set(() => {
			// localStorage.removeItem(TOKEN_KEY);
			return {
				token: null,
			};
		});
	},
}));
