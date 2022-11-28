export type YNType = 'Y' | 'N';

export interface Option<T = any> {
	label: string;
	value: T;
}

export type Options<T = any> = Option<T>[];

export type FileData = {
	file: File | null;
	filename?: string | null;
};

export type FileDataPreview = {
	preview: string | ArrayBuffer | null;
};

/* 이하 이미지 크롭 관련 타입 */
export interface BlobProps {
	size: number;
	type: string;
}

export type CropPreviewData = {
	preview: string | null | ArrayBuffer;
	file: File | null;
	filename?: string;
};

export interface CropConfigProps {
	crop?: {x: number; y: number};
	croppedArea?: {x: number; y: number; width: number; height: number} | null;
	croppedAreaPixels?: {
		x: number;
		y: number;
		width: number;
		height: number;
	} | null;
	zoom?: number;
}

export type CroppedAreaProps = Pick<CropConfigProps, 'croppedArea'>;
export type croppedAreaPixelsProps = Pick<CropConfigProps, 'croppedAreaPixels'>;
