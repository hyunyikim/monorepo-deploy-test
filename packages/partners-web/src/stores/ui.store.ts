import React from 'react';
import create from 'zustand';

interface OnOpenParamType {
	title: string;
	message?: string;
	showBottomCloseButton?: boolean;
	closeButtonValue?: '확인' | '취소';
	buttons?: React.ReactElement;
	onCloseFunc?: () => void;
}

interface MessageDialogState {
	open: boolean;
	title: string | null;
	message: string | null;
	showBottomCloseButton: boolean;
	closeButtonValue: '확인' | '취소';
	buttons: React.ReactElement | null;
	onCloseFunc: (() => void) | null;
	onOpen: (value: string | OnOpenParamType) => void;
	onClose: () => void;
	setOnCloseFunc: (func: () => void) => void;
	setMessage: (value: string) => void;
	initMessageDialog: () => void;
}

export const useMessageDialog = create<MessageDialogState>((set, get) => ({
	open: false,
	title: '알림',
	message: null,
	showBottomCloseButton: false,
	closeButtonValue: '확인',
	buttons: null,
	onCloseFunc: null,
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
			open: true,
			onCloseFunc: value?.onCloseFunc ?? null,
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
		})),
	setOnCloseFunc: (func: () => void) => {
		set(() => ({
			onCloseFunc: func,
		}));
	},
}));
