import {useCallback, Dispatch, SetStateAction} from 'react';

import {Button} from '@/components';
import {Box, Stack, Typography} from '@mui/material';

import {ProductRegisterFormData, ImageState} from '@/@types';

import {IcEmptyImage, IcPlus, IcPencil} from '@/assets/icon';

import {useMessageDialog} from '@/stores';

interface Props {
	product: Partial<ProductRegisterFormData> | null;
	setProduct: (value: Partial<ProductRegisterFormData> | null) => void;
	productImages: ImageState[];
	setProductImages: Dispatch<SetStateAction<ImageState[]>>;
	onNewProductModalOpen: () => void;
	onSelectProductModalOpen: () => void;
}

function GuaranteeRegisterProduct({
	product,
	setProduct,
	productImages,
	setProductImages,
	onNewProductModalOpen,
	onSelectProductModalOpen,
}: Props) {
	const handleDeleteSelectedProduct = useCallback(() => {
		setProduct(null);
		setProductImages([]);
	}, [setProduct, setProductImages]);

	const handleEditSelectedProduct = useCallback(() => {
		onNewProductModalOpen();
	}, [onNewProductModalOpen]);

	const onMessageDialogOpen = useMessageDialog((state) => state.onOpen);

	const checkProductLengthOverload = () => {
		if (product) {
			onMessageDialogOpen({
				title: '상품은 하나만 입력할 수 있습니다.',
				showBottomCloseButton: true,
			});
			return true;
		}
		return false;
	};

	return (
		<>
			<Stack
				p="32px"
				border={(theme) => `1px solid ${theme.palette.grey[100]}`}
				borderRadius="8px">
				<Typography fontSize={18} fontWeight="bold" mb="32px">
					상품 정보를 입력하세요
				</Typography>
				<Stack
					flexDirection="row"
					mb={product ? '32px' : 0}
					columnGap="8px">
					<Button
						color="blue-50"
						sx={{
							width: '100%',
							'& .MuiButton-startIcon': {
								marginRight: '4px',
							},
						}}
						startIcon={<IcPlus />}
						onClick={() => {
							if (!checkProductLengthOverload()) {
								onSelectProductModalOpen();
							}
						}}
						data-tracking={`guarantee_publish_plus_click,{'button_title': '상품추가 버튼 클릭'}`}>
						상품추가
					</Button>
					<Button
						color="blue-50"
						sx={{
							width: '100%',
							'& .MuiButton-startIcon': {
								marginRight: ' ',
							},
						}}
						startIcon={<IcPencil />}
						onClick={() => {
							if (!checkProductLengthOverload()) {
								onNewProductModalOpen();
							}
						}}
						data-tracking={`guarantee_publish_pluspopup_directinput_click,{'button_title': '직접입력 클릭'}`}>
						직접입력
					</Button>
				</Stack>
				{product && (
					<SelectedProduct
						data={product}
						image={
							productImages && productImages?.length > 0
								? productImages[0]
								: null
						}
						onEditProduct={handleEditSelectedProduct}
						onDeleteProduct={handleDeleteSelectedProduct}
					/>
				)}
			</Stack>
		</>
	);
}

const SelectedProduct = ({
	data,
	image,
	onEditProduct,
	onDeleteProduct,
}: {
	data: Partial<ProductRegisterFormData>;
	image: ImageState | null;
	onEditProduct: () => void;
	onDeleteProduct: () => void;
}) => {
	return (
		<Stack
			flexDirection="row"
			justifyContent="space-between"
			alignItems="center">
			<Stack flexDirection="row" alignItems="center">
				<ProductImage src={image?.preview || null} />
				<Stack flexDirection="column" ml="13px">
					<Typography
						fontSize={13}
						lineHeight="13px"
						color="grey.400">
						{data.brandName}
					</Typography>
					<Typography fontSize={14} lineHeight="14px" my="6px">
						{data.name}
					</Typography>
					<Typography
						fontSize={14}
						lineHeight="14px"
						color="grey.600">
						{data?.price
							? `${Number(data?.price).toLocaleString()}원`
							: '-'}
					</Typography>
				</Stack>
			</Stack>
			<Stack flexDirection="row">
				{/* 신규로 등록한 상품 */}
				{!data?.idx && (
					<Button variant="text" onClick={onEditProduct}>
						수정
					</Button>
				)}
				<Button variant="text" onClick={onDeleteProduct}>
					삭제
				</Button>
			</Stack>
		</Stack>
	);
};

const ProductImage = ({src}: {src?: string | null}) => {
	return src ? (
		<Box
			sx={{
				width: '60px',
				height: '60px',
				backgroundColor: 'grey.10',
				border: (theme) => `1px solid ${theme.palette.grey[100]}`,
			}}>
			<img
				src={src}
				style={{
					width: '100%',
					height: '100%',
				}}
			/>
		</Box>
	) : (
		<Box
			className="flex-center"
			sx={{
				width: '60px',
				height: '60px',
				backgroundColor: 'grey.10',
				border: (theme) => `1px solid ${theme.palette.grey[100]}`,
			}}>
			<IcEmptyImage />
		</Box>
	);
};

export default GuaranteeRegisterProduct;
