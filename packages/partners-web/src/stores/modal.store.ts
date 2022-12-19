import {ReactNode} from 'react';
import create from 'zustand';

type alignType = 'left' | 'center';

type ModalOpt = {
	id: string;
	isOpen: boolean;
	title?: string;
	subtitle?: string;
	children?: ReactNode;
	buttonTitle?: string;
	width?: string;
	align?: alignType;
	titleAlign?: alignType;
	customisedButton?: React.ReactElement | null;
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
	titleAlign?: alignType;
	customisedButton?: React.ReactElement | null;
	maxWidth?: string;
	onClickButton?: (
		e: React.MouseEventHandler<HTMLButtonElement> | undefined
	) => void;
	setIsOpen?: (openState: boolean) => void;
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
	titleAlign: 'left',
	customisedButton: null,
	setIsOpen: (openState: boolean) => {
		set((state) => ({...state, isOpen: openState}));
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
			titleAlign: 'left',
			customisedButton: null,
		}));
	},
}));
