import {useEffect, useState, useCallback, useMemo} from 'react';

import {Box, Stack, Slider} from '@mui/material';
import Cropper, {Point, Area} from 'react-easy-crop';

import {INITIAL_CROP_CONFIG, CROP_AREA_ASPECT} from './cropImage';
import imgCropInfo from '@/assets/images/img_crop_info.png';
import icZoomPlus from '@/assets/icon/icon_zoom_plus.png';

import {
	FileData,
	FileDataPreview,
	CropPreviewData,
	BlobProps,
	CropConfigProps,
} from '@/@types';
import {IcClose} from '@/assets/icon';

interface CropImageProps {
	file?: FileData;
	preview?: string;
}

interface CroppedImageProps {
	image?: CropImageProps;
	config: CropConfigProps | null;
	setConfig: (value: CropConfigProps | null) => void;
}

type ValueOf<T> = T[keyof T];

type CroppedAreaDataProps = Pick<
	CropConfigProps,
	'croppedArea' | 'croppedAreaPixels'
>;

function ImageCrop({image, config, setConfig}: CroppedImageProps) {
	const [showInfo, setShowInfo] = useState<boolean>(true);

	// crop config 초기화
	useEffect(() => {
		if (config) {
			return;
		}
		setConfig(INITIAL_CROP_CONFIG);
	}, [config]);

	const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
		setConfig((pre: CropConfigProps) => ({
			...pre,
			croppedAreaPixels: croppedAreaPixels as CroppedAreaDataProps,
		}));
	};

	const onChangeConfig = (
		type: keyof CropConfigProps,
		value: ValueOf<CropConfigProps> | Point
	) => {
		setConfig((pre: CropConfigProps) => ({
			...pre,
			[type]: value,
		}));
	};

	return (
		<>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					position: 'relative',
					minHeight: '512px',
					// 크롭 영역
					'& .reactEasyCrop_Container': {
						borderRadius: '16px',
					},
					'& .reactEasyCrop_CropArea': {
						border: '2px dashed #FFF',
						borderRadius: '16px',
					},
				}}>
				{config && (
					<Cropper
						image={image?.preview as string}
						aspect={CROP_AREA_ASPECT}
						crop={config.crop as Point}
						zoom={config.zoom}
						objectFit="vertical-cover"
						showGrid={false}
						onCropChange={(value: Point) =>
							onChangeConfig('crop', value)
						}
						onZoomChange={(value: number) =>
							onChangeConfig('zoom', value)
						}
						onCropAreaChange={(value) =>
							onChangeConfig('croppedArea', value)
						}
						onInteractionStart={() => setShowInfo(false)}
						onCropComplete={onCropComplete}
					/>
				)}
				<CropInfoBox show={showInfo} setShow={setShowInfo} />
				<ZoomController config={config} setConfig={setConfig} />
			</Box>
		</>
	);
}

interface ZoomControllerProps {
	config: CropConfigProps | null;
	setConfig: (_value: CropConfigProps | null) => void;
}

const ZoomController = ({config, setConfig}: ZoomControllerProps) => {
	const zoom = useMemo(() => {
		const zoom = config?.zoom;
		return zoom ?? 1;
	}, [config]);

	const handleChangeZoom = useCallback((value?: number | number[]) => {
		setConfig((pre: CropConfigProps) => {
			const beforeZoom = pre?.zoom ?? 1;
			// value가 없는 경우 0.1 씩 zoom in
			const nowZoom = value ?? Math.floor((beforeZoom + 0.1) * 10) / 10;
			return {
				...pre,
				zoom: nowZoom > 2 ? beforeZoom : nowZoom,
			};
		});
	}, []);

	return (
		<Stack
			sx={{
				position: 'absolute',
				bottom: '14px',
				left: '14px',
			}}>
			<Box
				sx={{
					display: 'flex',
					padding: '4px 16px',
					background: 'rgba(255, 255, 255, 0.6)',
					borderRadius: '6px',
				}}>
				<Slider
					aria-label="zoom"
					value={zoom}
					step={0.1}
					min={1}
					max={2}
					onChange={(e, value) => handleChangeZoom(value)}
					sx={{
						'&.MuiSlider-root': {
							height: '1px',
							width: '116px',
							color: '#FFF',
						},
						'& .MuiSlider-rail': {
							opacity: 1,
							background: '#47474F',
							height: '2px',
						},
						'& .MuiSlider-thumb': {
							width: '14px',
							height: '14px',
						},
						'& .Mui-active, & .MuiSlider-thumb:hover, & .MuiSlider-thumb:before':
							{
								boxShadow: 'none',
							},
					}}
				/>
			</Box>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					width: '41px',
					height: '41px',
					marginTop: '6px',
					background: '#FFF',
					borderRadius: '50%',
					cursor: 'pointer',
				}}
				onClick={() => handleChangeZoom()}>
				<img src={icZoomPlus} alt="zoomPlus" />
			</Box>
		</Stack>
	);
};

interface CropInfoBoxProps {
	show: boolean;
	setShow: (_value: boolean) => void;
}

const CropInfoBox = ({show, setShow}: CropInfoBoxProps) => {
	return (
		<Box
			className={`${show ? 'show' : ''}`}
			sx={{
				display: 'flex',
				flexDirection: 'column',
				position: 'absolute',
				width: '155px',
				height: '163px',
				backgroundColor: 'rgba(0, 0, 0, 0.5)',
				borderRadius: '13px',
				padding: '20px',
				color: '#FFF',
				fontSize: '13px',
				fontWeight: 700,
				textAlign: 'center',
				'& img': {
					display: 'block',
				},
				opacity: 0,
				visibility: 'hidden',
				'&.show': {
					opacity: 1,
					visibility: 'visible',
				},
				transition: 'all .2s',
			}}>
			<IcClose
				style={{
					position: 'absolute',
					right: 0,
					top: 0,
					padding: '10px',
					cursor: 'pointer',
				}}
				onClick={() => setShow(false)}
			/>

			{/* <img
				src={icWhiteClose}
				alt="close"
				style={{
					position: 'absolute',
					right: 0,
					top: 0,
					padding: '10px',
					cursor: 'pointer',
				}}
				onClick={() => setShow(false)}
			/> */}

			<img
				src={imgCropInfo}
				alt="crop-info"
				style={{
					margin: 'auto',
				}}
			/>
			<div>이미지를 움직여 크롭될 영역을 설정하세요!</div>
		</Box>
	);
};

export default ImageCrop;
