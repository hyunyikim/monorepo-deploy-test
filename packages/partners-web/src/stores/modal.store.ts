import {ReactNode} from 'react';
import create from 'zustand';

type ModalOpt = {
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
	onClickButton: null,
	align: 'center',
	setOpen: (openState) => {
		set((state) => ({isOpen: openState}));
	},
	setModalOption: (opt) => {
		set((state) => ({
			...opt,
		}));
	},
}));
