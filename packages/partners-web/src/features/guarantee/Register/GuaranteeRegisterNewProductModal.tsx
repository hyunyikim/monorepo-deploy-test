import {useEffect, useMemo, SetStateAction, useState, Dispatch} from 'react';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

import {ProductRegisterFormData, ImageState} from '@/@types';
import {productRegisterSchemaShape} from '@/utils/schema';
import {
	getProductRegisterInputList,
	getProductRegisterFormDataForReset,
	getProductCustomFieldValue,
} from '@/data';
import {useGetPartnershipInfo, useGetSearchBrandList} from '@/stores';

import {Stack, Typography, Box} from '@mui/material';

import {Dialog, LabeledCheckbox, Button} from '@/components';
import ProductRegisterFormInput from '@/features/product/Register/ProductRegisterFormInput';

interface Props {
	open: boolean;
	onClose: () => void;
	product: Partial<ProductRegisterFormData> | null;
	setProduct: (value: Partial<ProductRegisterFormData> | null) => void;
	images: ImageState[] | null;
	setImages: Dispatch<SetStateAction<ImageState[] | null>>;
	registerNewProduct: boolean;
	setRegisterNewProduct: (value: boolean) => void;
}

function GuaranteeRegisterNewProductModal({
	open,
	onClose,
	product,
	setProduct,
	images,
	setImages,
	registerNewProduct,
	setRegisterNewProduct,
}: Props) {
	const {data: partnershipInfo} = useGetPartnershipInfo();
	const {data: brandList} = useGetSearchBrandList();

	const [inputImages, setInputImages] = useState<ImageState[]>([]);

	const {
		watch,
		reset,
		getValues,
		control,
		handleSubmit,
		setValue,
		formState: {errors},
	} = useForm<Partial<ProductRegisterFormData>>({
		resolver: yupResolver(productRegisterSchemaShape),
	});

	useEffect(() => {
		if (!partnershipInfo) {
			return;
		}
		const {data: resetValue, images: resetImages} =
			getProductRegisterFormDataForReset(
				partnershipInfo,
				product,
				images
			);
		reset(resetValue);
		setInputImages(resetImages);
	}, [open, partnershipInfo, product, images, setImages]);

	const onSubmit = (data: Partial<ProductRegisterFormData>) => {
		const customFields = partnershipInfo?.nftCustomFields;
		setProduct({
			...data,
			price: data.price ? data.price : '',
			...(customFields && {
				customField: getProductCustomFieldValue(data, customFields),
			}),
		});
		setImages(inputImages);
		onClose();
	};

	const inputList = useMemo(() => {
		return getProductRegisterInputList(partnershipInfo, brandList);
	}, [partnershipInfo, brandList]);

	const isEditInputProduct = useMemo(() => {
		return product ? true : false;
	}, [product]);

	return (
		<Dialog
			open={open}
			onClose={onClose}
			width={400}
			padding={24}
			TitleComponent={
				<Typography fontSize={18} fontWeight="bold">
					상품정보 입력하기
				</Typography>
			}
			ActionComponent={
				<>
					<Button
						width="100%"
						variant="outlined"
						color="grey-100"
						onClick={() => {
							onClose();
							setInputImages([]);
							if (!isEditInputProduct) {
								setProduct(null);
							}
						}}
						data-tracking={`guarantee_publish_pluspopup_close_click,{'button_title': '닫기 클릭'}`}>
						취소
					</Button>
					<Button
						type="submit"
						width="100%"
						onClick={() => {
							handleSubmit(onSubmit)();
						}}>
						{isEditInputProduct ? '수정' : ' 입력완료'}
					</Button>
				</>
			}>
			<form noValidate>
				<Stack position="relative">
					<Stack
						mb="24px"
						pb="24px"
						borderBottom={(theme) =>
							`1px solid ${theme.palette.grey[100]}`
						}>
						<ProductRegisterFormInput
							inputList={inputList}
							images={inputImages}
							setImages={setInputImages}
							control={control}
							setValue={setValue}
							errors={errors}
						/>
					</Stack>
					<Box mt="26px" mb="30px">
						<LabeledCheckbox
							label="상품정보 저장하기"
							checked={registerNewProduct}
							onChange={(e, checked) => {
								setRegisterNewProduct(checked);
							}}
						/>
					</Box>
				</Stack>
			</form>
		</Dialog>
	);
}

export default GuaranteeRegisterNewProductModal;
