import create from 'zustand';

interface MessageDialogState {
	open: boolean;
	title: string | null;
	message: string | null;
	onCloseFunc: (() => void) | null;
	onOpen: (value?: string | {title: string; message: string}) => void;
	onClose: () => void;
	setOnCloseFunc: (func: () => void) => void;
	setMessage: (value: string) => void;
	initMessageDialog: () => void;
}

export const useMessageDialog = create<MessageDialogState>((set, get) => ({
	open: false,
	title: '알림',
	message: null,
	onCloseFunc: null,
	onOpen: (value?: string | {title: string; message: string}) => {
		// 메시지만 바뀜
		if (typeof value === 'string') {
			set(() => ({
				message: value,
				open: true,
			}));
			return;
		}
		// 타이틀, 메시지 바뀜
		set(() => ({
			title: value?.title,
			message: value?.message,
			open: true,
		}));
	},
	onClose: () => {
		set(() => ({open: false}));
	},
	setMessage: (value) => set(() => ({message: value})),
	initMessageDialog: () =>
		set(() => ({
			title: '알림',
			message: null,
			onCloseFunc: null,
		})),
	setOnCloseFunc: (func: () => void) => {
		set(() => ({
			onCloseFunc: func,
		}));
	},
}));
