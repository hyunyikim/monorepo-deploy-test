import {useCallback} from 'react';
import BrandSettingDragDropBox from './BrandSettingDragDropBox';
import ImageCrop from './ImageCrop';

import {
	FileData,
	FileDataPreview,
	CropPreviewData,
	BlobProps,
	CropConfigProps,
} from '@/@types';

import {useMessageDialog} from '@/stores';

interface CropImageProps {
	file?: FileData;
	preview?: string;
	base64String: string;
}

interface BrandSettingSelectImageProps {
	cropImage: CropImageProps | null;
	setCropImage: (_value: CropImageProps) => void;
	cropConfig: CropConfigProps | null;
	setCropConfig?: (value: CropImageProps | null) => void;
	setMoveToAfterModalClose?: (_bool: boolean) => void;
}

const MEGA_PER_BYTE = 1048576;
const FILE_SIZE_LIMIT = MEGA_PER_BYTE * 2; // 2mb로 파일 업로드 제한
function BrandSettingSelectImage({
	cropImage,
	setCropImage,
	cropConfig,
	setCropConfig,
	setMoveToAfterModalClose,
}: BrandSettingSelectImageProps) {
	const onMessageDialogOpen = useMessageDialog((state) => state.onOpen);

	const handleFile = useCallback((e: React.FormEvent<HTMLInputElement>) => {
		const files = (e.currentTarget as HTMLInputElement).files as FileList;
		const currentFile = files[0];

		if (!currentFile) {
			return;
		}

		if (currentFile.size > FILE_SIZE_LIMIT) {
			setMoveToAfterModalClose(false);
			onMessageDialogOpen({
				title: '최대 파일 크기 2MB 미만의 파일을 업로드해주세요.',
				showBottomCloseButton: true,
				closeButtonValue: '확인',
			});
			return;
		}
		const reader = new FileReader();
		reader.onloadend = () => {
			const base64String: string = reader.result as string;
			setCropImage({
				file: currentFile as FileData,
				preview: reader.result as string,
				base64String: base64String,
			});
		};
		reader.readAsDataURL(currentFile);
	}, []);

	return (
		<>
			{cropImage?.preview ? (
				<ImageCrop
					image={cropImage}
					config={cropConfig}
					setConfig={setCropConfig}
				/>
			) : (
				<BrandSettingDragDropBox
					accept=".jpg, .jpeg, .png"
					width="auto"
					// height='375px'
					handleFile={handleFile}
				/>
			)}
		</>
	);
}

export default BrandSettingSelectImage;
