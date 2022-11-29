import {useCallback, useEffect, useState} from 'react';
import {useForm, useWatch} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useNavigate} from 'react-router-dom';

import {Stack} from '@mui/material';

import {
	GauranteeDetailResponse,
	GuaranteeImageResponse,
	GuaranteeRegisterFormData,
	GuaranteeRegisterProductFormData,
	ProductRegisterFormData,
	GuaranteeRequestState,
	ImageState,
} from '@/@types';
import {guaranteeRegisterSchemaShape} from '@/utils/schema';
import {goToParentUrl, handleChangeDataFormat} from '@/utils';
import {
	convertProductRegisterFormData,
	guaranteeRegisterInputList as inputList,
} from '@/data';
import {
	registerGuarantee,
	deleteGuarantee,
	deleteGuaranteeImage,
} from '@/api/guarantee.api';
import {sendAmplitudeLog} from '@/utils';
import {
	useGetPartnershipInfo,
	useMessageDialog,
	useGuaranteePreviewStore,
} from '@/stores';
import {registerProduct} from '@/api/product.api';
import {useChildModalOpen} from '@/utils/hooks';

import {Button, InputWithLabel, Loading, BottomNavigation} from '@/components';
import GuaranteeRegisterProduct from '@/features/guarantee/Register/GuaranteeRegisterProduct';
import GuaranteeRegisterNewProductModal from '@/features/guarantee/Register/GuaranteeRegisterNewProductModal';
import GuaranteeRegisterSelectProductModal from '@/features/guarantee/Register/GuaranteeRegisterSelectProductModal';

interface Props {
	initialData: GauranteeDetailResponse | null;
}

function GuaranteeRegisterForm({initialData}: Props) {
	const navigate = useNavigate();
	const setGuaranteePreviewData = useGuaranteePreviewStore(
		(state) => state.setData
	);

	const {data: partnershipInfo} = useGetPartnershipInfo();
	const onOpenMessageDialog = useMessageDialog((state) => state.onOpen);
	const {
		open: newProductModalOpen,
		onOpen: onNewProductModalOpen,
		onClose: onNewProductModalClose,
	} = useChildModalOpen({});
	const {
		open: selectProductModalOpen,
		onOpen: onSelectProductModalOpen,
		onClose: onSelectProductModalClose,
	} = useChildModalOpen({});

	const {
		watch,
		reset,
		getValues,
		control,
		handleSubmit,
		setValue,
		formState: {errors},
	} = useForm<GuaranteeRegisterFormData | GuaranteeRegisterProductFormData>({
		resolver: yupResolver(guaranteeRegisterSchemaShape),
	});

	// 상품
	const [products, setProducts] = useState<
		Partial<ProductRegisterFormData>[] | null
	>(null);
	const [productImages, setProductImages] = useState<ImageState[]>([]);
	const [registerNewProduct, setRegisterNewProduct] =
		useState<boolean>(false);

	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (!partnershipInfo) {
			return;
		}
		if (initialData) {
			const {data} = initialData;
			const {
				// 개런티
				nft_req_idx,
				nft_req_state,
				orderer_nm,
				orderer_tel,
				order_platform_nm,
				order_dt,
				ref_order_id,
				brand_idx,
				brand_nm,
				brand_nm_en,
				// 상품
				productIdx,
				pro_nm,
				price,
				cate_cd,
				cate_cd_text,
				warranty_dt,
				model_num,
				custom_field,
				product_img,
			} = data;

			reset({
				nft_req_idx,
				nft_req_state: nft_req_state as Extract<
					GuaranteeRequestState,
					'1' | '2'
				>,
				orderer_nm,
				orderer_tel,
				order_dt,
				platform_nm: order_platform_nm,
				ref_order_id,
				productIdx,
			});
			setProducts([
				{
					idx: productIdx || '',
					name: pro_nm || '',
					categoryCode: cate_cd || '',
					categoryName: cate_cd_text || '',
					brandIdx: brand_idx,
					brandName: brand_nm || '',
					brandNameEn: brand_nm_en || '',
					modelNum: model_num || '',
					price: price ? String(price) : '',
					warranty: warranty_dt || '',
					customField: custom_field || {},
				},
			]);
			setProductImages([
				{
					file: null,
					preview: product_img,
				},
			]);
		}
	}, [initialData, partnershipInfo]);

	const watched = useWatch({
		control,
	});

	// 개런티카드 프리뷰 데이터 세팅
	useEffect(() => {
		const product = products && products?.length > 0 ? products[0] : {};
		const productImage =
			productImages && productImages?.length > 0 ? productImages[0] : {};
		setGuaranteePreviewData({
			...watched,
			product,
			productImage,
		});
	}, [watched, products, productImages]);

	const onSubmit = (
		data: GuaranteeRegisterFormData | GuaranteeRegisterProductFormData
	) => {
		if (!products || products?.length < 1) {
			onOpenMessageDialog({
				title: '상품을 입력해주세요.',
				showBottomCloseButton: true,
			});
			return;
		}
		const formData = new FormData();
		Object.keys(data).forEach((key: string) => {
			const value =
				data[
					key as keyof (
						| GuaranteeRegisterFormData
						| GuaranteeRegisterProductFormData
					)
				];
			if (value) {
				formData.append(key, String(value));
			}
		});
		const product = products[0];
		const customFields = partnershipInfo?.nftCustomFields;
		const customFieldObj: Record<string, string> = {};
		Object.keys(product).forEach((key: string) => {
			const value = product[key as keyof ProductRegisterFormData];
			if (customFields && customFields?.includes(key)) {
				customFieldObj[key] = String(value) || '';
				return;
			}

			// 상품 등록 파라미터와 개런티 발급시 이뤄지는 상품 등록 파라미터 맞추기
			if (!value) return;

			// 상품 작접 입력만 하고 저장 하지 않는 경우
			// 상품 관련 formData 입력
			if (!registerNewProduct && !product?.idx) {
				if (key === 'brandIdx') {
					formData.append('brand_idx', String(value));
					return;
				}
				if (key === 'name') {
					formData.append('pro_nm', String(value));
					return;
				}
				if (key === 'price') {
					formData.append('price', String(value).replace(/\,/g, ''));
					return;
				}
				if (key === 'categoryCode') {
					formData.append('cate_cd', String(value));
					return;
				}
				if (key === 'warranty') {
					formData.append('warranty_dt', String(value));
					return;
				}
				if (key === 'modelNum') {
					formData.append('model_num', String(value));
					return;
				}
			}
		});
		formData.append('custom_field', JSON.stringify(customFieldObj));

		// 상품 신규등록 아닐 떄
		if (!registerNewProduct && productImages.length > 0) {
			productImages.forEach((image) => {
				image?.file && formData.append('product_img', image.file);
			});
		}
		const registerType =
			data.nft_req_state === '1' ? 'temperary' : 'register';

		sendAmplitudeLog('guarantee_publish_complete_popupview', {
			button_title: '개런티 발급하시겠습니까 팝업 노출',
		});
		onOpenMessageDialog({
			title:
				registerType === 'register'
					? '개런티를 발급하시겠습니까?'
					: '개런티를 임시발급하시겠습니까?',
			showBottomCloseButton: true,
			closeButtonValue: '취소',
			buttons: (
				<>
					<Button
						color="black"
						variant="contained"
						onClick={() =>
							handleRegister(
								registerType,
								formData,
								registerNewProduct,
								products[0],
								productImages,
								customFields,
								initialData
							)
						}
						data-tracking={`guarantee_publish_complete_popuppublish_click,{'button_title': '개런티 발급 클릭 시 개런티 발급'}`}>
						발급
					</Button>
				</>
			),
			onCloseFunc: () => {
				// 취소 버튼 클릭
				sendAmplitudeLog(
					'guarantee_publish_complete_popupcencle_click',
					{button_title: '취소 클릭'}
				);
			},
		});
	};

	const handleProductRegister = useCallback(
		async (
			formData: FormData,
			registerNewProduct: boolean,
			product: ProductRegisterFormData,
			productImages: ImageState[],
			customFields?: string[]
		) => {
			// 상품을 따로 등록
			if (registerNewProduct) {
				const productFormData = convertProductRegisterFormData(
					product,
					productImages,
					customFields
				);
				const registeredProduct = await registerProduct(
					productFormData
				);
				formData.append('productIdx', String(registeredProduct.idx));
				return;
			}

			if (product.idx) {
				formData.append('productIdx', String(product.idx));
				return;
			}

			// 상품을 선택하지 않고 상품을 개런티와 함께 등록
			formData.append('productIdx', '0');
		},
		[]
	);

	const handleDeleteGuaranteeImage = useCallback(
		async (
			productImages: ImageState[],
			images?: GuaranteeImageResponse[] | null
		) => {
			if (
				!productImages ||
				productImages?.length < 1 ||
				!images ||
				images?.length < 1
			) {
				return;
			}

			// 새로 등록된 상품 이미지 파일이 있는지 여부 확인
			const newProductImageFile = productImages.find((item) => item.file);

			// 있다면 기존 개런티 이미지 삭제
			if (newProductImageFile) {
				images.forEach(async (image) => {
					await deleteGuaranteeImage(image.nft_req_img_idx);
				});
			}
		},
		[]
	);

	const handleRegister = useCallback(
		async (
			registerType: 'temperary' | 'register',
			formData: FormData,
			registerNewProduct: boolean,
			product: ProductRegisterFormData | Partial<ProductRegisterFormData>,
			productImages: ImageState[],
			customFields?: string[],
			initialData?: GauranteeDetailResponse | null
		) => {
			try {
				setIsSubmitting(true);
				await handleProductRegister(
					formData,
					registerNewProduct,
					product as ProductRegisterFormData,
					productImages,
					customFields
				);
				await registerGuarantee(formData);
				await handleDeleteGuaranteeImage(
					productImages,
					initialData?.images || null
				);
				onOpenMessageDialog({
					title:
						registerType === 'register'
							? '개런티가 발급되었습니다.'
							: '개런티 발급정보가 임시저장 되었습니다.',
					showBottomCloseButton: true,
					onCloseFunc: () => {
						goToParentUrl('/b2b/guarantee');
					},
				});

				if (registerType === 'register') {
					sendAmplitudeLog('guarantee_publish_complete');
				}
				if (registerType === 'temperary') {
					sendAmplitudeLog('guarantee_publish_saved');
				}
			} catch (e: any) {
				onOpenMessageDialog({
					title: '네트워크 에러',
					message: e?.response?.data || '',
					showBottomCloseButton: true,
				});
			} finally {
				setIsSubmitting(false);
			}
		},
		[navigate, isSubmitting]
	);

	const handleAddSingleProduct = useCallback(
		(value: Partial<ProductRegisterFormData> | null) => {
			setProducts(value ? [value] : null);
		},
		[products, setProducts]
	);

	const handleDeleteGuarantee = useCallback(() => {
		const idx = initialData?.data?.nft_req_idx;
		if (!idx) {
			return;
		}
		sendAmplitudeLog('guarantee_publish_delete_popupview', {
			button_title: '삭제하시겠습니까? 팝업노출',
		});
		onOpenMessageDialog({
			title: '개런티를 삭제하시겠습니까?',
			showBottomCloseButton: true,
			closeButtonValue: '취소',
			buttons: (
				<>
					<Button
						color="black"
						variant="contained"
						onClick={async () => {
							try {
								await deleteGuarantee(idx);
								onOpenMessageDialog({
									title: '개런티를 삭제했습니다',
									showBottomCloseButton: true,
									onCloseFunc: () => {
										goToParentUrl('/b2b/guarantee');
									},
								});
							} catch (e: any) {
								onOpenMessageDialog({
									title: '네트워크 에러',
									message: e?.response?.data || '',
									showBottomCloseButton: true,
								});
							} finally {
								sendAmplitudeLog('guarantee_publish_delete');
							}
						}}
						data-tracking={`guarantee_publish_delete_popupdelete_click,{'button_title': '삭제하기 클릭 시 삭제'}`}>
						삭제
					</Button>
				</>
			),
		});
	}, [initialData]);

	return (
		<>
			<form noValidate onSubmit={handleSubmit(onSubmit)}>
				<Stack
					p="32px"
					mb="60px"
					border={(theme) => `1px solid ${theme.palette.grey[100]}`}
					borderRadius="8px">
					{inputList.map((input) => {
						const {name, type, ...restInput} = input;
						if (type === 'text') {
							return (
								<InputWithLabel
									key={name}
									name={name}
									control={control}
									labelTitle={input.label}
									placeholder={input.placeholder}
									inputType={input.type}
									required={input.required}
									error={
										errors[
											name as keyof GuaranteeRegisterFormData
										]
									}
									{...restInput}
									onChange={(e) => {
										if (name === 'orderer_tel') {
											e.target.value =
												handleChangeDataFormat(
													'phoneNum',
													e
												);
										}
										if (name === 'order_dt') {
											e.target.value =
												handleChangeDataFormat(
													'date',
													e
												);
										}
									}}
								/>
							);
						}
					})}
				</Stack>
				<GuaranteeRegisterProduct
					product={
						products && products?.length > 0 ? products[0] : null
					}
					setProduct={handleAddSingleProduct}
					productImages={productImages}
					setProductImages={setProductImages}
					onNewProductModalOpen={onNewProductModalOpen}
					onSelectProductModalOpen={onSelectProductModalOpen}
				/>
				<BottomNavigation maxWidth="930px">
					<Stack
						flexDirection="row"
						width="100%"
						justifyContent="space-between">
						<Button
							variant="outlined"
							color="grey-100"
							onClick={() => {
								handleDeleteGuarantee();
							}}
							data-tracking={`guarantee_publish_delete_click,{'button_title': '삭제 클릭'}`}>
							삭제
						</Button>
						<Stack flexDirection="row" columnGap="12px">
							<Button
								variant="outlined"
								color="grey-100"
								type="submit"
								onClick={() => {
									setValue('nft_req_state', '1');
								}}
								data-tracking={`guarantee_publish_save_click,{'button_title': '임시저장'}`}>
								임시저장
							</Button>
							<Button
								type="submit"
								onClick={() => {
									setValue('nft_req_state', '2');
								}}
								data-tracking={`guarantee_publish_complete_click,{'button_title': '개런티 발급하기 클릭'}`}>
								개런티 발급
							</Button>
						</Stack>
					</Stack>
				</BottomNavigation>
			</form>
			<GuaranteeRegisterSelectProductModal
				open={selectProductModalOpen}
				onClose={onSelectProductModalClose}
				setProduct={handleAddSingleProduct}
				setImages={setProductImages}
				setRegisterNewProduct={setRegisterNewProduct}
			/>
			<GuaranteeRegisterNewProductModal
				open={newProductModalOpen}
				onClose={onNewProductModalClose}
				product={products && products?.length > 0 ? products[0] : null}
				setProduct={handleAddSingleProduct}
				images={productImages}
				setImages={setProductImages}
				registerNewProduct={registerNewProduct}
				setRegisterNewProduct={setRegisterNewProduct}
			/>
			<Loading loading={isSubmitting} />
		</>
	);
}

export default GuaranteeRegisterForm;
