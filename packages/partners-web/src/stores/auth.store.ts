import create from 'zustand';

export const TOKEN_KEY = 'token';

interface LoginState {
	token: string | null;
	setLogin: (token: string) => void;
	setLogout: () => void;
}

export const useLoginStore = create<LoginState>((set, get) => ({
	token: localStorage.getItem(TOKEN_KEY),
	setLogin: (token: string) => set(() => ({token})),
	setLogout: () =>
		set(() => ({
			token: null,
		})),
}));
