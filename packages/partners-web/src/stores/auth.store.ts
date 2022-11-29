import create from 'zustand';

export const TOKEN_KEY = 'token';

interface LoginState {
	token: string | null;
	setLogin: (token: string) => void;
	setLogout: () => void;
}

export const useLoginStore = create<LoginState>((set, get) => ({
	// TODO: iframe 전체 옮긴 후  localStorage에 저장하는 것으로 변경
	// token: localStorage.getItem(TOKEN_KEY),
	token: null,
	setLogin: (token: string) =>
		set(() => {
			// localStorage.setItem(TOKEN_KEY, token);
			return {token};
		}),
	setLogout: () => {
		// localStorage.removeItem(TOKEN_KEY);
		set(() => ({
			token: null,
		}));
	},
}));
