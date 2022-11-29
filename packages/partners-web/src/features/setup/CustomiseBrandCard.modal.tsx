import React, {useState, useCallback, useEffect} from 'react';

import {
	Box,
	Typography,
	Grid,
	Divider,
	DialogTitle,
	DialogContent,
	DialogActions,
	Stack,
} from '@mui/material';
import {Link} from 'react-router-dom';
import {CARD_DESIGN_GUIDE_LINK} from '@/data';
import {trackingToParent} from '@/utils';
import {IcReload} from '@/assets/icon';
import {Button} from '@/components';
import {
	FileData,
	FileDataPreview,
	CropPreviewData,
	BlobProps,
	CropConfigProps,
	CroppedAreaProps,
} from '@/@types';

import {useModalStore, useMessageDialog} from '@/stores';
import getCroppedImgBlob from './cropImage';
import BrandSettingSelectImage from './BrandSettingSelectImage';
import BrandSettingConfirm from './BrandSettingConfirm';

import Cropper, {CropperProps, Point, Area} from 'react-easy-crop';

interface ImgProps extends FileData {
	preview?: string | ArrayBuffer | null;
}

interface CropImageProps {
	file: FileData;
	preview?: string;
	base64String: string;
}

interface CustomiseCardProps {
	image?: ImgProps;
	onSelectBrandImage: (_value: CropPreviewData) => void;
	setMoveToAfterModalClose?: (_bool: boolean) => void;
	convertToBase64?: (_value: string) => void;
}

const MEGA_PER_BYTE = 1048576;
const FILE_SIZE_LIMIT = MEGA_PER_BYTE * 5; // 5mb로 파일 업로드 제한

type croppedAreaPixels =
	| {
			x: number;
			y: number;
			width: number;
			height: number;
	  }
	| null
	| undefined;

function CustomiseBrandCard({
	image,
	onSelectBrandImage,
	setMoveToAfterModalClose,
	convertToBase64,
}: CustomiseCardProps) {
	const [step, setStep] = useState<number>(1);
	const onMessageDialogOpen = useMessageDialog((state) => state.onOpen);
	const [cropImage, setCropImage] = useState<CropImageProps | null>(null); // 새로운 이미지
	const [cropConfig, setCropConfig] = useState<CropConfigProps | null>(null); // 크롭 관련 설정값
	const {isOpen, setOpen} = useModalStore((state) => state);

	// Dialog 새로 열릴 때 step 1부터 시작
	useEffect(() => {
		if (isOpen) {
			setStep(1);
		}
	}, [isOpen]);

	/**
	 * 최종 이미지 크롭
	 *
	 * 최종적으로 선택된 이미지를 크롭해 preview, file 객체로 넘겨준다.
	 */

	const handleUploadImage = async () => {
		const reader: FileReader = new FileReader();

		if (cropImage) {
			const blob: {file: Blob; base64String: string} =
				await getCroppedImgBlob(
					cropImage.preview as string,
					(cropConfig as CropConfigProps).croppedAreaPixels as Area
				);

			if (blob.size > FILE_SIZE_LIMIT) {
				if (typeof setMoveToAfterModalClose === 'function') {
					setMoveToAfterModalClose(false);
				}
				onMessageDialogOpen({
					title: '제작된 파일의 크기가 너무 큽니다. 이미지 영역을 다시 조정해주세요.',
					showBottomCloseButton: true,
					closeButtonValue: '확인',
				});
				return;
			}

			const filename: string | null = cropImage.file.name as string;
			if (typeof onSelectBrandImage === 'function') {
				onSelectBrandImage({
					preview: URL.createObjectURL(blob.file),
					file: blob.file,
					filename,
					base64String: blob.base64String,
				});
			}
		} else {
			// null로 초기화
			if (typeof onSelectBrandImage === 'function') {
				onSelectBrandImage({
					preview: null,
					file: null,
					filename: '',
					base64String: '',
				});
			}
		}
		if (typeof setOpen === 'function') {
			setOpen(false);
		}
	};

	const handleRefresh = useCallback(() => {
		trackingToParent('guaranteesetting_cardcustom_popup_reset_click', {
			button_title: '업로드한 이미지 초기화',
		});
		setStep(1);
		setCropImage(null);
		setCropConfig(null);
	}, []);

	useEffect(() => {
		if (isOpen) {
			trackingToParent('guaranteesetting_cardcustom_popupview', {
				pv_title: '브랜드 카드제작 팝업 노출',
			});
		}
	}, [isOpen]);

	const openCustomizedCardDesign = () => {
		window.open(CARD_DESIGN_GUIDE_LINK, '_blank');
	};

	return (
		<Box sx={{width: '100%'}}>
			<DialogContent>
				<Stack
					direction="row"
					sx={{
						marginBottom: '46px',
					}}>
					<Typography
						sx={{
							color: 'grey.300',
							fontSize: '14px',
							fontWeight: 500,
							margin: 0,
							marginRight: '10px',
						}}>
						가이드를 참고해 손쉽게 카드 이미지를 커스텀해보세요!
					</Typography>
					<Typography
						sx={{
							color: 'primary.main',
							fontSize: '14px',
							fontWeight: 700,
							margin: 0,
							cursor: 'pointer',
						}}
						onClick={() => {
							trackingToParent(
								'guaranteesetting_cardcustom_popup_guide_click',
								{button_title: '이미지 제작 가이드 링크로 이동'}
							);
							openCustomizedCardDesign();
						}}>
						가이드보기
					</Typography>
				</Stack>

				{step === 1 && (
					<BrandSettingSelectImage
						cropImage={cropImage}
						setCropImage={setCropImage}
						cropConfig={cropConfig}
						setCropConfig={setCropConfig}
						setMoveToAfterModalClose={setMoveToAfterModalClose}
					/>
				)}
				{step === 2 && (
					<BrandSettingConfirm
						src={cropImage?.preview}
						croppedArea={cropConfig?.croppedArea}
					/>
				)}
			</DialogContent>

			<DialogActions
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					padding: 0,
					marginTop: '40px',
				}}>
				<Button
					variant="outlined"
					startIcon={<IcReload />}
					onClick={handleRefresh}>
					초기화
				</Button>
				{step === 1 && (
					<Button
						variant="contained"
						onClick={() => {
							trackingToParent(
								'guaranteesetting_cardcustom_popup_imagecomplate_click',
								{
									button_title:
										'이미지 적용클릭 시 크롭 화면으로 이동',
								}
							);
							setStep(2);
						}}>
						이미지 적용하기
					</Button>
				)}
				{step === 2 && (
					<Stack direction="row">
						<Button
							variant="outlined"
							sx={{
								marginRight: '12px',
							}}
							onClick={() => {
								trackingToParent(
									'guaranteesetting_cardcustom_popup_back_click',
									{
										button_title:
											'완료 바로 전 화면(이미지 크롭)으로 이동',
									}
								);
								setStep(1);
							}}>
							뒤로가기
						</Button>
						<Button
							variant="contained"
							onClick={() => {
								trackingToParent(
									'guaranteesetting_cardcustom_popup_confirm_click',
									{button_title: '이미지 적용 완료'}
								);
								handleUploadImage();
							}}>
							완료
						</Button>
					</Stack>
				)}
			</DialogActions>
		</Box>
	);
}

export default CustomiseBrandCard;
