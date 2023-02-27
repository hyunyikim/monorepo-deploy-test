import {Options} from './common.types';

/**
 * 엑셀 양식 생성 및 필드 생성에서 함께 쓰이는 타입
 */
export interface ExcelField<T> {
	key: keyof T | string;
	required: boolean;
}

export interface ExcelInput {
	type: string;
	name: string;
	required?: boolean;
	width?: number;
	maxLength?: number;
	parser?: (value: any) => any;
	renderer?: (value: any) => any;
	validator?: (value: any) => any;
	options?: Options<any>;
}

export interface ExcelProgress {
	fileName: string;
	loaded: number;
	total: number;
}

export type ExcelErrorType = 'required' | 'invalid' | 'format';

export type ExcelError = Map<number, Record<string, ExcelErrorType>>;
