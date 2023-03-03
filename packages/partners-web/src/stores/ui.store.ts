import {AxiosError} from 'axios';
import React from 'react';
import create from 'zustand';

import {ERROR_MESSAGE, ERROR_TITLE} from '@/data';
import {CloseButtonValueType, OnOpenParamType} from '@/@types';
interface MessageDialogState {
	open: boolean;
	disableClickBackground: boolean;
	disableScroll: boolean;
	useCloseIcon: boolean;
	title: string | null;
	message: string | React.ReactElement | null;
	showBottomCloseButton: boolean;
	closeButtonValue: CloseButtonValueType;
	buttons: React.ReactElement | null;
	onCloseFunc: (() => void) | null;
	onOpen: (value: string | OnOpenParamType) => void;
	onOpenError: (error?: {
		e: unknown;
		title?: string;
		message?: string;
	}) => void;
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
	disableScroll: false,
	useCloseIcon: true,
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
			disableScroll: value?.disableScroll,
			useCloseIcon: value?.useCloseIcon,
			open: true,
			onCloseFunc: value?.onCloseFunc ?? null,
		}));
	},
	onOpenError: (error?: {e: unknown; title?: string; message?: string}) => {
		let errorTitle = ERROR_TITLE;
		let errorMessage = ERROR_MESSAGE;

		if (!error) {
			get().onOpen({
				title: errorTitle,
				message: errorMessage,
				showBottomCloseButton: true,
				closeButtonValue: '확인',
			});
			return;
		}

		const {e, title, message} = error;
		if (e instanceof Error && e?.message) {
			errorTitle = e?.message;
		}
		if (e instanceof AxiosError && e.response?.data?.message) {
			errorTitle = title || e.response?.data?.message;
			errorMessage = message || errorMessage;
		}
		get().onOpen({
			title: errorTitle,
			message: errorMessage,
			showBottomCloseButton: true,
			closeButtonValue: '확인',
		});
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
			disableScroll: false,
			useCloseIcon: true,
		})),
	setOnCloseFunc: (func: () => void) => {
		set(() => ({
			onCloseFunc: func,
		}));
	},
}));

interface SidebarControl {
	isOpen: boolean;
	setOpen: (value: boolean) => void;
}

export const useSidebarControlStore = create<SidebarControl>((set, get) => ({
	isOpen: true,
	setOpen: (value: boolean) => set(() => ({isOpen: value})),
}));
