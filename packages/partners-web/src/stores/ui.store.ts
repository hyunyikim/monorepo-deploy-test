import create from 'zustand';

interface MessageDialogState {
	open: boolean;
	message: string | null;
	onOpen: (value?: string) => void;
	onClose: () => void;
	setMessage: (value: string) => void;
}

export const useMessageDialog = create<MessageDialogState>((set, get) => ({
	open: false,
	message: null,
	onOpen: (value?: string) =>
		set(() => ({
			message: value,
			open: true,
		})),
	onClose: () => set(() => ({open: false, message: null})),
	setMessage: (value) => set(() => ({message: value})),
}));
