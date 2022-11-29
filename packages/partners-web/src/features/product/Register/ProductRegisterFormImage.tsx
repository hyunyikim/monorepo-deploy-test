import {useCallback, useRef, ChangeEvent} from 'react';
import {Box, Stack, Typography} from '@mui/material';

import {useMessageDialog} from '@/stores';
import {ImageState} from '@/@types';

import {IcCamera, IcClose} from '@/assets/icon';

const PRODUCT_REGISTER_IMAGE_LENGTH_LIMIT = 1;

interface Props {
	images: ImageState[];
	setImages: (func: (value: ImageState[]) => ImageState[]) => void;
}

function ProductRegisterFormImage({images, setImages}: Props) {
	const hiddenFileInput = useRef<HTMLInputElement>(null);
	const onOpenMessageDialog = useMessageDialog((state) => state.onOpen);

	const handleFile = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const files = e.target.files;
			if (!files) {
				return;
			}
			if (
				files.length + (images?.length || 0) >
				PRODUCT_REGISTER_IMAGE_LENGTH_LIMIT
			) {
				onOpenMessageDialog({
					title: `최대 ${PRODUCT_REGISTER_IMAGE_LENGTH_LIMIT}장만 업로드할 수 있습니다.`,
					showBottomCloseButton: true,
				});
				return;
			}
			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				const reader = new FileReader();
				reader.onloadend = () => {
					setImages((prev: ImageState[]) => [
						...prev,
						{
							file,
							preview: reader.result as string,
						},
					]);
				};
				reader.readAsDataURL(file);
			}
		},
		[images]
	);

	const handleClickAddImage = useCallback(() => {
		if (hiddenFileInput?.current) {
			hiddenFileInput?.current?.click();
		}
	}, []);

	const deleteImage = useCallback((preview: string) => {
		setImages((prev) => {
			return prev.filter((item) => item.preview !== preview);
		});
	}, []);

	return (
		<Stack direction="row" columnGap="8px">
			<input
				hidden
				type="file"
				accept="image/*"
				ref={hiddenFileInput}
				onChange={handleFile}
			/>
			<Stack
				direction="column"
				className="flex-center cursor-pointer"
				onClick={() => handleClickAddImage()}
				sx={(theme) => ({
					width: '100px',
					height: '100px',
					border: `1px solid ${theme.palette.grey[100]}`,
					borderRadius: '8px',
				})}
				data-tracking={`itemadmin_imageregist_click,{'button_title': '사진 등록 버튼 클릭 시 finder 노출'}`}>
				<IcCamera />
				<Typography fontSize={14} mt="14px">
					사진 추가
				</Typography>
			</Stack>
			{images?.map((item) => (
				<ImagePreview
					key={item.preview}
					data={item}
					deleteImage={deleteImage}
				/>
			))}
		</Stack>
	);
}

const ImagePreview = ({
	data,
	deleteImage,
}: {
	data: ImageState;
	deleteImage: (preview: string) => void;
}) => {
	return data?.preview ? (
		<Box position="relative">
			<Box
				sx={(theme) => ({
					width: '100px',
					height: '100px',
					border: `1px solid ${theme.palette.grey[100]}`,
					borderRadius: '8px',
					backgroundImage: `url(${data.preview})`,
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
				})}
			/>
			<Box
				className="cursor-pointer"
				sx={{
					position: 'absolute',
					top: 0,
					right: 0,
					backgroundColor: 'grey.100',
					width: '24px',
					height: '24px',
					borderTopRightRadius: '4px',
				}}
				onClick={() => deleteImage(data.preview)}>
				{/* TODO: size 조정 */}
				<IcClose />
			</Box>
		</Box>
	) : null;
};

export default ProductRegisterFormImage;
