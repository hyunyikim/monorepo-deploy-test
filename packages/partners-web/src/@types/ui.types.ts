export type ColorType =
	| 'primary'
	| 'primary-50'
	| 'grey-100'
	| 'grey-50'
	| 'green'
	| 'red'
	| 'black';

export type CloseButtonValueType = '확인' | '취소' | '닫기' | '아니오';
export interface OnOpenParamType {
	title: string;
	message?: string | React.ReactElement;
	showBottomCloseButton?: boolean;
	disableClickBackground?: boolean;
	disableScroll?: boolean;
	useCloseIcon?: boolean;
	closeButtonValue?: CloseButtonValueType;
	buttons?: React.ReactElement;
	sendCloseModalControlToParent?: boolean;
	onCloseFunc?: () => void;
}
