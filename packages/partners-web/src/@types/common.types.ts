export type YNType = 'Y' | 'N';

export interface Option<T = any> {
	label: string;
	value: T;
}

export type Options<T = any> = Option<T>[];
