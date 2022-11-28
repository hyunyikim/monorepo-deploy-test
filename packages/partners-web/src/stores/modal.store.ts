import {ReactNode} from 'react';
import create from 'zustand';

type alignType = 'left' | 'center' | 'centre';

type ModalOpt = {
	id: string;
	isOpen: boolean;
	title?: string;
	subtitle?: string;
	children?: ReactNode;
	buttonTitle?: string;
	width?: string;
	align?: alignType;
	maxWidth?: string;
	onClickButton?: (
		e: React.MouseEventHandler<HTMLButtonElement> | undefined
	) => void | null;
	setCloseAndReset?: () => void;
};

interface ModalState {
	id: string;
	isOpen: boolean;
	title?: string;
	subtitle?: string;
	children?: ReactNode;
	buttonTitle?: string;
	width?: string;
	align?: string;
	maxWidth?: string;
	onClickButton?: (
		e: React.MouseEventHandler<HTMLButtonElement> | undefined
	) => void;
	setOpen?: (openState: boolean) => void;
	setCloseAndReset?: () => void;
	setModalOption: (opt: ModalOpt) => void;
}

export const useModalStore = create<ModalState>((set) => ({
	id: '',
	isOpen: false,
	title: '',
	subtitle: '',
	children: null,
	buttonTitle: '',
	maxWidth: '',
	onClickButton: undefined,
	align: 'center',
	setOpen: (openState) => {
		set((state) => ({isOpen: openState}));
	},
	setModalOption: (opt) => {
		set((state) => ({
			...opt,
		}));
	},
	setCloseAndReset: () => {
		set(() => ({
			isOpen: false,
			id: '',
			title: '',
			subtitle: '',
			children: null,
			buttonTitle: '',
			maxWidth: '',
			align: 'center',
			onClickButton: undefined,
		}));
	},
}));
