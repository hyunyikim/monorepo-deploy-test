import {Box, Stack, Typography} from '@mui/material';

import {CARD_SIZE} from './cropImage';
import ImgShoppingBag from '@/assets/images/img_shopping_bag.png';

import {INITIAL_CROP_CONFIG} from './cropImage';

import {
	CropConfigProps,
	CroppedAreaProps,
	croppedAreaPixelsProps,
} from '@/@types';

const defaultVircleBgUrl = `${STATIC_URL}/files/nft/bg_nft_vircle_new.png`;

function BrandSettingConfirm({
	src,
	croppedArea,
}: {
	src?: string;
	croppedArea?: croppedAreaPixelsProps | null;
}) {
	return (
		<Stack
			direction="row"
			sx={{
				display: 'flex',
				justifyContent: 'center',
				'& > .MuiBox-root:first-of-type': {
					marginRight: '30px',
				},
			}}>
			<BrandImagePreview
				src={src || defaultVircleBgUrl}
				croppedArea={croppedArea || INITIAL_CROP_CONFIG}
				showProductImage={true}
			/>
			<BrandImagePreview
				src={src || defaultVircleBgUrl}
				croppedArea={croppedArea || INITIAL_CROP_CONFIG}
			/>
		</Stack>
	);
}

interface BrandImagePreviewProps {
	src?: string;
	croppedArea: CroppedAreaProps;
	showProductImage?: boolean;
}
/**
 * 크롭된 브랜드 이미지 프리뷰 컴포넌트
 *
 * 실제로 이미지를 자르는게 아니고, 원본 이미지를 선택된 크롭 영역만큼만 보여준다.
 * (실제로 이미지를 잘라 file로 만드는건, 완료 단계)
 */
const BrandImagePreview = ({
	src,
	croppedArea,
	showProductImage = false,
}: BrandImagePreviewProps) => {
	const scale = 100 / croppedArea.width;
	const transform = {
		x: `${-croppedArea.x * scale}%`,
		y: `${-croppedArea.y * scale}%`,
		scale,
		width: 'calc(100% + 0.5px)',
		height: 'auto',
	};
	const imageStyle = {
		transform: `translate3d(${transform.x}, ${transform.y}, 0) scale3d(${transform.scale},${transform.scale},1)`,
		width: transform.width,
		height: transform.height,
	};

	return (
		<Box>
			<Box
				sx={{
					position: 'relative',
					width: CARD_SIZE.width,
					height: CARD_SIZE.height,
					overflow: 'hidden',
					borderRadius: '16px',
					isolation: 'isolate',
					'& img:first-of-type': {
						position: 'absolute',
						top: 0,
						left: 0,
						transformOrigin: 'top left',
					},
				}}>
				{/* 브랜드 이미지 */}
				<img src={src} alt="brand-card" style={imageStyle} />
				{/* 상품 이미지 박스 */}
				{showProductImage && (
					<Box
						sx={{
							background: '#FFF',
							width: '281px',
							height: '270px',
							borderRadius: '13px',
							position: 'absolute',
							bottom: '24px',
							left: '50%',
							transform: 'translateX(-50%)',
						}}>
						<img
							src={ImgShoppingBag}
							alt="shopping-bag"
							style={{
								position: 'relative',
								top: '50%',
								left: '50%',
								transform: 'translate(-50%, -50%)',
							}}
						/>
					</Box>
				)}
			</Box>
			<BrandImagePreviewDescribe showProductImage={showProductImage} />
		</Box>
	);
};

const BrandImagePreviewDescribe = ({showProductImage = false}) => {
	return (
		<Stack
			textAlign="center"
			sx={(theme) => ({
				marginTop: '24px',
				'& > .MuiTypography-span': {
					fontSize: '16px',
					fontWeight: 700,
					color: theme.palette.grey[900],
				},
				'& > .MuiTypography-root.MuiTypography-body1': {
					marginTop: '12px',
					fontSize: '14px',
					fontWeight: 500,
					color: `${theme.palette.grey[400]} !important`,
				},
			})}>
			<Typography variant="span">
				상품이미지가&nbsp;
				<Typography
					variant="span"
					sx={{
						color: showProductImage ? '#00C29F' : '#F8434E',
					}}>
					{showProductImage ? '있는 ' : '없는 '}
				</Typography>
				경우
			</Typography>
			<Typography>
				{showProductImage ? (
					<>
						상품의 이미지가 있는 경우 개런티카드 내에
						<br />
						상품의 이미지가 노출됩니다.
					</>
				) : (
					<>
						상품의 이미지가 없는 경우 개런티카드 내에
						<br />
						상품의 이미지가 노출되지 않습니다.
					</>
				)}
			</Typography>
		</Stack>
	);
};

export default BrandSettingConfirm;
