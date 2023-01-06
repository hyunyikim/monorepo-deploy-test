import {useCallback, useEffect, useMemo, useState} from 'react';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useNavigate} from 'react-router-dom';

import {Stack} from '@mui/material';

import {ProductDetailResponse, ProductRegisterFormData} from '@/@types';
import {productRegisterSchemaShape} from '@/utils/schema';
import {goToParentUrl} from '@/utils';

import {Button} from '@/components';
import {
	convertProductRegisterFormData,
	getProductRegisterFormDataForReset,
	getProductRegisterInputList,
} from '@/data';
import {ImageState} from '@/@types';
import {
	deleteProduct,
	editProduct,
	registerProduct,
	deleteProductImage,
} from '@/api/product.api';

import {
	useGetPartnershipInfo,
	useGetSearchBrandList,
	useGlobalLoading,
	useMessageDialog,
} from '@/stores';

import {BottomNavigation} from '@/components';
import ProductRegisterFormInput from './ProductRegisterFormInput';

interface Props {
	mode: 'register' | 'edit';
	initialData: ProductDetailResponse | null;
}

function ProductRegisterForm({mode, initialData}: Props) {
	const navigate = useNavigate();

	const {data: partnershipInfo} = useGetPartnershipInfo();
	const {data: brandList} = useGetSearchBrandList();
	const onOpenMessageDialog = useMessageDialog((state) => state.onOpen);
	const onOpenError = useMessageDialog((state) => state.onOpenError);
	const setIsLoading = useGlobalLoading((state) => state.setIsLoading);

	const {
		reset,
		control,
		handleSubmit,
		setValue,
		formState: {errors},
	} = useForm<ProductRegisterFormData>({
		resolver: yupResolver(productRegisterSchemaShape),
	});
	const [images, setImages] = useState<ImageState[]>([]);

	useEffect(() => {
		if (!partnershipInfo) {
			return;
		}
		const {data: resetValue, images: resetImages} =
			getProductRegisterFormDataForReset(partnershipInfo, initialData);
		reset(resetValue);
		setImages(resetImages);
	}, [initialData, partnershipInfo]);

	const onSubmit = (data: ProductRegisterFormData) => {
		const formData = convertProductRegisterFormData(
			data,
			images,
			partnershipInfo?.nftCustomFields
		);
		if (!formData) return;

		if (mode === 'register') {
			onOpenMessageDialog({
				title: '상품을 등록하시겠습니까?',
				showBottomCloseButton: true,
				closeButtonValue: '취소',
				buttons: (
					<>
						<Button
							color="black"
							variant="contained"
							onClick={() => handleRegister(formData)}>
							등록
						</Button>
					</>
				),
			});
			return;
		}

		const idx = initialData?.idx;
		if (idx) {
			onOpenMessageDialog({
				title: '상품을 수정하시겠습니까?',
				showBottomCloseButton: true,
				closeButtonValue: '취소',
				buttons: (
					<>
						<Button
							color="black"
							variant="contained"
							onClick={() => handleEdit(idx, formData, images)}>
							수정
						</Button>
					</>
				),
			});
		}
	};

	const handleRegister = useCallback(
		async (formData: FormData) => {
			try {
				setIsLoading(true);
				await registerProduct(formData);
				onOpenMessageDialog({
					title: '상품이 등록되었습니다.',
					showBottomCloseButton: true,
					onCloseFunc: () => {
						goToParentUrl('/b2b/product');
					},
				});
			} catch (e: any) {
				onOpenError();
			} finally {
				setIsLoading(false);
			}
		},
		[navigate, setIsLoading, setIsLoading]
	);

	const handleEdit = useCallback(
		async (idx: number, formData: FormData, images: ImageState[]) => {
			try {
				try {
					// 이미지 삭제 되었을 경우, 이미지 삭제 api 호출
					if (images?.length < 1) {
						await deleteProductImage(idx);
					}
				} catch (e) {}
				await editProduct(idx, formData);
				onOpenMessageDialog({
					title: '상품이 수정되었습니다.',
					showBottomCloseButton: true,
					onCloseFunc: () => {
						goToParentUrl('/b2b/product');
					},
				});
			} catch (e: any) {
				onOpenError();
			}
		},
		[navigate]
	);

	const handleDelete = useCallback((idx: number) => {
		onOpenMessageDialog({
			title: '상품을 삭제하시겠습니까?',
			showBottomCloseButton: true,
			buttons: (
				<>
					<Button
						color="black"
						onClick={() => {
							(async () => {
								try {
									await deleteProduct(idx);
									onOpenMessageDialog({
										title: '상품이 삭제되었습니다.',
										showBottomCloseButton: true,
										onCloseFunc: () => {
											goToParentUrl('/b2b/product');
										},
									});
								} catch (e: any) {
									onOpenError();
								}
							})();
						}}>
						삭제
					</Button>
				</>
			),
		});
	}, []);

	const inputList = useMemo(() => {
		return getProductRegisterInputList(partnershipInfo, brandList);
	}, [partnershipInfo, brandList]);

	if (!partnershipInfo) {
		return <></>;
	}

	return (
		<>
			<form noValidate onSubmit={handleSubmit(onSubmit)}>
				<Stack
					p="32px"
					mb="100px"
					border={(theme) => `1px solid ${theme.palette.grey[100]}`}
					borderRadius="8px">
					<ProductRegisterFormInput
						inputList={inputList}
						images={images}
						setImages={setImages}
						control={control}
						setValue={setValue}
						errors={errors}
					/>
				</Stack>
				<BottomNavigation>
					<Stack
						flexDirection="row"
						width="100%"
						justifyContent={
							mode === 'register' ? 'flex-end' : 'space-between'
						}>
						{mode === 'register' ? (
							<Button
								height={48}
								type="submit"
								data-tracking={`itemadmin_reregistbutton_click,{'button_title': '상품등록 완료'}`}>
								상품등록
							</Button>
						) : (
							<>
								<Button
									variant="outlined"
									height={48}
									color="grey-100"
									onClick={() => {
										initialData?.idx &&
											handleDelete(initialData?.idx);
									}}>
									삭제
								</Button>
								<Button
									height={48}
									type="submit"
									data-tracking={`itemadmin_reregisteditbutton_click,{'button_title': '상품수정 완료'}`}>
									상품수정
								</Button>
							</>
						)}
					</Stack>
				</BottomNavigation>
			</form>
		</>
	);
}

export default ProductRegisterForm;
