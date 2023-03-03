import {useEffect, useState} from 'react';

import {Box, Stack, Typography} from '@mui/material';

import style from '@/assets/styles/style.module.scss';
import {IcWarningTriangle} from '@/assets/icon';
import {isValidWebImage} from '@/utils';
import {useOpen} from '@/utils/hooks';

import {
	Dialog,
	InputComponent,
	Button,
	ImagePopup,
	ImageModal,
} from '@/components';
interface Props {
	modalData: any;
	open: boolean;
	onClose: () => void;
	onSave: (rowIdx: number, columnKey: string, value: any) => void;
}

function ExcelUploadProductImageModal({
	modalData,
	open,
	onClose,
	onSave,
}: Props) {
	const [link, setLink] = useState<string | null>(null);
	const [isError, setIsError] = useState(false);
	const {
		open: openImageModal,
		onOpen: onOpenImageModal,
		onClose: onCloseImageModal,
	} = useOpen({});

	useEffect(() => {
		setLink(modalData?.link || '');
	}, [modalData?.link]);

	useEffect(() => {
		(async () => {
			if (!link) {
				setIsError(false);
				return;
			}
			const isValid = await isValidWebImage(link);
			setIsError(!isValid);
		})();
	}, [link]);

	const handleProductImageSave = () => {
		onSave(modalData.rowIdx, modalData.columnKey, link);
		onClose();
	};

	return (
		<>
			<Dialog
				open={open}
				onClose={onClose}
				TitleComponent={
					<Typography fontSize={24} fontWeight={700}>
						상품 이미지
					</Typography>
				}
				showCloseButton={true}
				useBackgroundClickClose={true}
				width={800}>
				<Stack
					flexDirection="row"
					sx={{
						width: '100%',
						marginBottom: '16px',
					}}>
					{isError ? (
						<Box
							flexDirection="column"
							className="flex-center"
							sx={{
								width: '200px',
								height: '200px',
								minWidth: '200px',
								minHeight: '200px',
								border: (theme) =>
									`1px solid ${theme.palette.red.main}`,
								borderRadius: '8px',
							}}
							mr="20px">
							<IcWarningTriangle
								color={style.vircleRed500}
								width={40}
								height={40}
							/>
							<Typography
								variant="body3"
								color="red.main"
								mt="4px">
								이미지 링크 오류
							</Typography>
						</Box>
					) : (
						<ImagePopup
							image={link || ''}
							alt={'상품 이미지'}
							style={{
								margin: 0,
								marginRight: '20px',
								width: '200px',
								height: '200px',
								minWidth: '200px',
								minHeight: '200px',
							}}
							onClick={onOpenImageModal}
						/>
					)}
					<Stack
						sx={{
							width: '100%',
						}}>
						<Typography variant="body3" fontWeight="bold" mb="8px">
							상품 이미지 URL
						</Typography>
						<Stack
							flexDirection="row"
							sx={{
								width: '100%',
							}}>
							<Stack
								flexDirection="column"
								sx={{
									width: '100%',
								}}>
								<InputComponent
									sx={{
										minWidth: '340px',
									}}
									value={link}
									onChange={(e) => setLink(e.target.value)}
									error={isError}
								/>
								{isError && (
									<Typography
										variant="caption1"
										color="red.main">
										등록한 이미지 링크를 정상적으로 표시하지
										못하고 있어요. <br />
										새로운 이미지 URL를 입력해주세요.
									</Typography>
								)}
							</Stack>
							<Button
								variant="contained"
								width={140}
								height={48}
								sx={{
									marginLeft: '16px',
								}}
								disabled={isError}
								onClick={handleProductImageSave}>
								저장하기
							</Button>
						</Stack>
					</Stack>
				</Stack>
			</Dialog>
			{link && (
				<ImageModal
					imgSrc={link}
					imgAlt="상품 이미지"
					open={openImageModal}
					onClose={onCloseImageModal}
				/>
			)}
		</>
	);
}

export default ExcelUploadProductImageModal;
