import create from 'zustand';

export const TOKEN_KEY = 'token';

interface LoginState {
	token: string | null;
	isLogin: boolean;
	setLogin: (token: string) => void;
	setLogout: () => void;
}

export const useLoginStore = create<LoginState>((set, get) => ({
	token: localStorage.getItem(TOKEN_KEY),
	// TODO: token에 의존적인 selector 기능 있나 체크
	isLogin: localStorage.getItem(TOKEN_KEY) ? true : false,
	setLogin: (token) => set(() => ({token, isLogin: true})),
	setLogout: () =>
		set(() => ({
			token: null,
			isLogin: false,
			// TODO: partnership data resets
		})),
}));
