import React from 'react';
import create from 'zustand';

type CloseButtonValueType = '확인' | '취소' | '닫기';

interface OnOpenParamType {
	title: string;
	message?: string | React.ReactElement;
	showBottomCloseButton?: boolean;
	disableClickBackground?: boolean;
	useCloseIcon?: boolean;
	closeButtonValue?: CloseButtonValueType;
	buttons?: React.ReactElement;
	sendCloseModalControlToParent?: boolean;
	onCloseFunc?: () => void;
}

interface MessageDialogState {
	open: boolean;
	disableClickBackground: boolean;
	useCloseIcon: boolean;
	title: string | null;
	message: string | React.ReactElement | null;
	showBottomCloseButton: boolean;
	closeButtonValue: CloseButtonValueType;
	buttons: React.ReactElement | null;
	sendCloseModalControlToParent: boolean;
	onCloseFunc: (() => void) | null;
	onOpen: (value: string | OnOpenParamType) => void;
	onClose: () => void;
	setOnCloseFunc: (func: () => void) => void;
	setMessage: (value: string) => void;
	initMessageDialog: () => void;
}

interface GlobalLoadingState {
	isLoading: boolean;
	showCircularProgress: boolean;
	setIsLoading: (value: boolean, showCircularProgress?: boolean) => void;
}

export const useGlobalLoading = create<GlobalLoadingState>((set, get) => ({
	isLoading: false,
	showCircularProgress: true,
	setIsLoading: (value: boolean, showCircularProgress?: boolean) => {
		set(() => ({
			isLoading: value,
			showCircularProgress:
				typeof showCircularProgress === 'undefined' ? true : false,
		}));
	},
}));

export const useMessageDialog = create<MessageDialogState>((set, get) => ({
	open: false,
	title: '알림',
	message: null,
	showBottomCloseButton: false,
	closeButtonValue: '확인',
	buttons: null,
	onCloseFunc: null,
	disableClickBackground: false,
	useCloseIcon: true,
	sendCloseModalControlToParent: true,
	onOpen: (value: string | OnOpenParamType) => {
		// 메시지만 바뀜
		if (typeof value === 'string') {
			set(() => ({
				message: value,
				open: true,
			}));
			return;
		}

		// 메시지 외 다른 데이터도 바뀜
		set(() => ({
			title: value?.title,
			message: value?.message ?? null,
			showBottomCloseButton: value?.showBottomCloseButton ?? false,
			closeButtonValue: value?.closeButtonValue ?? '확인',
			buttons: value?.buttons ?? null,
			disableClickBackground: value?.disableClickBackground,
			useCloseIcon: value?.useCloseIcon,
			open: true,
			onCloseFunc: value?.onCloseFunc ?? null,
			sendCloseModalControlToParent:
				value?.sendCloseModalControlToParent ?? true,
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
			showBottomCloseButton: false,
			closeButtonValue: '확인',
			buttons: null,
			disableClickBackground: false,
			useCloseIcon: true,
			sendCloseModalControlToParent: true,
		})),
	setOnCloseFunc: (func: () => void) => {
		set(() => ({
			onCloseFunc: func,
		}));
	},
}));
