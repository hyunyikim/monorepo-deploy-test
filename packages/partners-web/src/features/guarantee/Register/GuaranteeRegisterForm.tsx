import {useCallback, useEffect, useMemo, useState} from 'react';
import {useForm, useWatch} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useNavigate} from 'react-router-dom';
import {useQueryClient} from '@tanstack/react-query';

import {Stack} from '@mui/material';

import {
	ProductRegisterFormData,
	ImageState,
	AutocompleteInputType,
	RegisterGuaranteeRequestFormData,
	RegisterGuaranteeStatusType,
	GuaranteeDetail,
	ProductDetailResponse,
} from '@/@types';
import {guaranteeRegisterSchemaShape} from '@/utils/schema';
import {
	formatPhoneNum,
	handleChangeDataFormat,
	sendAmplitudeLog,
} from '@/utils';
import {
	checkNotOpenAlimtalkModal,
	convertProductRegisterFormData,
	convertRegisterGuaranteeRequestDataToFormData,
	guaranteeRegisterInputList as inputList,
	isPlanEnterprise,
	PAGE_MAX_WIDTH,
	PAYMENT_MESSAGE_MODAL,
} from '@/data';
import {registerGuarantee} from '@/api/guarantee-v1.api';
import {
	useGetPartnershipInfo,
	useMessageDialog,
	useGuaranteePreviewStore,
	useGlobalLoading,
	useGetStoreList,
	useLoginStore,
} from '@/stores';
import {registerProduct} from '@/api/product.api';
import {useOpen} from '@/utils/hooks';
import {useGetUserPricePlan} from '@/stores';

import {
	Button,
	InputWithLabel,
	BottomNavigation,
	LabeledAutocomplete,
} from '@/components';
import GuaranteeRegisterProduct from '@/features/guarantee/Register/GuaranteeRegisterProduct';
import GuaranteeRegisterNewProductModal from '@/features/guarantee/Register/GuaranteeRegisterNewProductModal';
import GuaranteeRegisterSelectProductModal from '@/features/guarantee/Register/GuaranteeRegisterSelectProductModal';
import GuaranteeRegisterAlimTalkNoticeModal from '@/features/guarantee/Register/GuaranteeRegisterAlimTalkNoticeModal';
import GuaranteeDeleteButton from '@/features/guarantee/Register/GuaranteeDeleteButton';

interface Props {
	initialData: GuaranteeDetail | null;
	product: ProductDetailResponse | null;
}

function GuaranteeRegisterForm({initialData, product}: Props) {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const setGuaranteePreviewData = useGuaranteePreviewStore(
		(state) => state.setData
	);

	const token = useLoginStore().token;
	const {data: userPlan} = useGetUserPricePlan();
	const {data: partnershipInfo} = useGetPartnershipInfo();
	const onOpenMessageDialog = useMessageDialog((state) => state.onOpen);
	const onCloseMessageDialog = useMessageDialog((state) => state.onClose);
	const onOpenError = useMessageDialog((state) => state.onOpenError);
	const {
		open: newProductModalOpen,
		onOpen: onNewProductModalOpen,
		onClose: onNewProductModalClose,
	} = useOpen({});
	const {
		open: selectProductModalOpen,
		onOpen: onSelectProductModalOpen,
		onClose: onSelectProductModalClose,
	} = useOpen({});
	const {
		open: alimTalkNoticeModalOpen,
		onOpen: onAlimTalkNoticeModalOpen,
		onClose: onAlimTalkNoticeModalClose,
		modalData: alimTalkModalData,
		onSetModalData: onSetAlimTalkNoticeModalData,
	} = useOpen({});
	const setIsLoading = useGlobalLoading((state) => state.setIsLoading);

	const {
		reset,
		getValues,
		control,
		handleSubmit,
		setValue,
		formState: {errors},
	} = useForm<RegisterGuaranteeRequestFormData>({
		resolver: yupResolver(guaranteeRegisterSchemaShape),
	});

	// 상품
	const [products, setProducts] = useState<
		Partial<ProductRegisterFormData>[] | null
	>(null);
	const [productImages, setProductImages] = useState<ImageState[]>([]);
	const [registerNewProduct, setRegisterNewProduct] =
		useState<boolean>(false);

	// 판매처 목록(autocomplete의 옵션값)
	const {data: storeList} = useGetStoreList();

	const isInitialRegister = useMemo(
		() => (initialData ? false : true),
		[initialData]
	);

	useEffect(() => {
		if (!partnershipInfo) {
			return;
		}

		// 최초 입력
		if (!initialData) {
			reset({
				ordererName: '',
				ordererTel: '',
				orderedAt: '',
				storeName: '',
				refOrderId: '',
			});
			return;
		}

		// 임시저장 후 재입력시
		const {
			// 개런티
			idx,
			ordererName,
			ordererTel,
			storeIdx,
			storeName,
			orderedAt,
			orderNumber,

			// 상품
			brandIdx,
			categoryCode,
			categoryName,
			partnersProductIdx,
			productName,
			price,
			warrantyDate,
			productImages,
			modelNumber,
			material,
			size,
			weight,
			customField,
			brandName,
			brandNameEn,
		} = initialData;

		reset({
			idx,
			ordererName,
			ordererTel: ordererTel ? formatPhoneNum(ordererTel) : '',
			orderedAt: orderedAt ? orderedAt.slice(0, 10) : '',
			storeName,
			storeIdx: storeIdx || '',
			refOrderId: orderNumber,
		});

		setProducts([
			{
				brandIdx: brandIdx || '',
				idx: partnersProductIdx || '',
				name: productName || '',
				categoryCode: categoryCode || '',
				categoryName: categoryName || '',
				warranty: warrantyDate || '',
				brandName: brandName || '',
				brandNameEn: brandNameEn || '',
				price: price ? price.toLocaleString() : '',
				modelNum: modelNumber || '',
				customField: customField || {},
				...(customField || {}),
			},
		]);

		if (productImages && productImages?.length > 0) {
			setProductImages([
				{
					file: productImages[0],
					preview: productImages[0],
				},
			]);
		}
	}, [initialData, partnershipInfo]);

	// 상품 상세 페이지에서 넘어온 경우, 상품을 기본으로 세팅해줌
	useEffect(() => {
		if (!product) {
			return;
		}
		const {
			idx,
			name,
			categoryCode,
			categoryName,
			brandIdx,
			brand,
			modelNum,
			price,
			warranty,
			customField,
			productImage,
		} = product;

		setProducts([
			{
				idx,
				name,
				categoryCode,
				categoryName,
				brandIdx,
				brandName: brand?.name,
				brandNameEn: brand?.englishName,
				modelNum,
				price: price ? price.toLocaleString() : '',
				warranty,
				customField,
				...(customField || {}),
			},
		]);
		if (productImage) {
			setProductImages([
				{
					file: null,
					preview: productImage,
				},
			]);
		}
	}, [product]);

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

	// TODO: 공통으로 분리
	// 플랜 사용 가능 여부 체크
	const checkPossibleUsePricePlan = useCallback(
		(nftStatus: RegisterGuaranteeStatusType) => {
			const isFreeTrial = userPlan?.pricePlan.planLevel === 0;
			const currentDate = new Date().getTime();
			const expireDate = userPlan?.planExpireDate
				? new Date(userPlan?.planExpireDate).getTime()
				: null;
			const usedAllCredit =
				userPlan &&
				userPlan?.pricePlan.planLimit - userPlan?.usedNftCount <= 0;
			const isEnterprisePlan = isPlanEnterprise(
				userPlan?.pricePlan.planType
			);

			if (nftStatus === 'request') {
				if (!isEnterprisePlan) {
					if (expireDate) {
						// 무료 플랜이 만료되었을때
						if (expireDate - currentDate < 0) {
							if (isFreeTrial) {
								onOpenMessageDialog({
									...PAYMENT_MESSAGE_MODAL.TRIAL_FINISH,
									buttons: (
										<Button
											color="black"
											onClick={() => {
												navigate(
													'/b2b/payment/subscribe'
												);
												onCloseMessageDialog();
											}}>
											플랜 업그레이드
										</Button>
									),
								});
								return false;
							}
							onOpenMessageDialog({
								...PAYMENT_MESSAGE_MODAL.PLAN_SUBSCRIBE,
								buttons: (
									<Button
										color="black"
										onClick={() => {
											navigate('/b2b/payment/subscribe');
											onCloseMessageDialog();
										}}>
										구독
									</Button>
								),
							});
							return false;
						}
					}

					if (usedAllCredit) {
						onOpenMessageDialog({
							title: '개런티 발급량이 모두 소진 되었습니다.',
							message:
								'나에게 맞는 플랜으로 업그레이드 후 개런티를 계속 발급해보세요.',
							showBottomCloseButton: true,
							closeButtonValue: '닫기',
							disableClickBackground: true,
							buttons: (
								<Button
									color="black"
									onClick={() => {
										navigate('/b2b/payment/subscribe');
										onCloseMessageDialog();
									}}>
									플랜 업그레이드
								</Button>
							),
						});
						return false;
					}
				}
			}
			return true;
		},
		[userPlan]
	);

	const onSubmit = async (data: RegisterGuaranteeRequestFormData) => {
		if (!checkPossibleUsePricePlan(data.nftStatus)) {
			return;
		}

		if (!products || products?.length < 1) {
			onOpenMessageDialog({
				title: '상품을 입력해주세요.',
				showBottomCloseButton: true,
			});
			return;
		}

		const registerStatus = data.nftStatus;

		// 임시저장은 팝업 없이 바로 저장
		if (registerStatus === 'ready') {
			handleRegister({
				registerStatus,
				registerNewProduct,
				guarantee: data,
				product: products[0],
				productImages,
				customFields: partnershipInfo?.nftCustomFields,
				initialData,
			});
			return;
		}

		// 개런티 발급 확인 플로우
		const openCheckRegisterMessageDialog = () => {
			sendAmplitudeLog('guarantee_publish_complete_popupview', {
				button_title: '개런티 발급하시겠습니까 팝업 노출',
			});
			onOpenMessageDialog({
				title: '개런티를 발급하시겠습니까?',
				showBottomCloseButton: true,
				closeButtonValue: '취소',
				buttons: (
					<>
						<Button
							color="black"
							variant="contained"
							onClick={() =>
								handleRegister({
									registerStatus,
									registerNewProduct,
									guarantee: data,
									product: products[0],
									productImages,
									customFields:
										partnershipInfo?.nftCustomFields,
									initialData,
								})
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

		// 아직 알림톡 설정 하지 않고, 다시 보지않기 클릭하지 않은 경우
		if (
			partnershipInfo?.useAlimtalkProfile === 'N' &&
			!checkNotOpenAlimtalkModal(partnershipInfo?.email)
		) {
			// 알림톡 소개 모달에서 개런티 발급 진행
			onSetAlimTalkNoticeModalData({
				func: () => {
					onAlimTalkNoticeModalClose();
					openCheckRegisterMessageDialog();
				},
			});
			onAlimTalkNoticeModalOpen();
			return;
		}

		openCheckRegisterMessageDialog();
	};

	const handleProductRegister = useCallback(
		async (
			product: ProductRegisterFormData,
			productImages: ImageState[],
			customFields?: string[]
		) => {
			const productFormData = convertProductRegisterFormData(
				product,
				productImages,
				customFields
			);
			return await registerProduct(productFormData);
		},
		[]
	);

	const handleRegister = useCallback(
		async ({
			registerStatus,
			registerNewProduct,
			guarantee,
			product,
			productImages,
			customFields,
			initialData,
		}: {
			registerStatus: RegisterGuaranteeStatusType;
			registerNewProduct: boolean;
			guarantee: RegisterGuaranteeRequestFormData;
			product: Partial<ProductRegisterFormData>;
			productImages: ImageState[];
			customFields?: string[];
			initialData?: GuaranteeDetail | null;
		}) => {
			try {
				setIsLoading(true);
				if (registerNewProduct) {
					const registeredProduct = await handleProductRegister(
						product as ProductRegisterFormData,
						productImages,
						partnershipInfo?.nftCustomFields
					);
					product = {
						...product,
						idx: registeredProduct.idx,
					};
				}
				const formData = convertRegisterGuaranteeRequestDataToFormData({
					guarantee,
					product,
					images: productImages,
					customFields,
				});
				await registerGuarantee(formData);
				onOpenMessageDialog({
					title:
						registerStatus === 'request'
							? '개런티가 발급되었습니다.'
							: '개런티 발급 정보를 임시저장했습니다.',
					showBottomCloseButton: true,
					onCloseFunc: () => {
						navigate('/b2b/guarantee');
					},
				});

				sendAmplitudeLog(
					registerStatus === 'ready'
						? 'guarantee_publish_saved'
						: 'guarantee_publish_complete',
					{
						button_title: '',
					}
				);
				queryClient.invalidateQueries({
					queryKey: ['userPricePlan'],
				});
				queryClient.invalidateQueries({
					queryKey: ['storeList', token],
				});
			} catch (e: any) {
				const code = e?.response?.data?.code;
				if (code === 'NOT_FOUND_PARTNERS_PRODUCT') {
					onOpenError({
						e,
						title: '삭제된 상품입니다.',
						message: '상품을 다시 선택하고 발급해주세요.',
					});
					return;
				}
				if (code === 'DUPLICATE_REF_ORDER') {
					onOpenError({
						e,
						title: '해당 주문번호로 이미 신청된 개런티가 존재합니다.',
						message: '주문번호를 다시 확인해주세요.',
					});
					return;
				}
				onOpenError();
			} finally {
				setIsLoading(false);
			}
		},
		[navigate, setIsLoading, token]
	);

	const handleAddSingleProduct = useCallback(
		(value: Partial<ProductRegisterFormData> | null) => {
			setProducts(value ? [value] : null);
		},
		[]
	);

	return (
		<>
			<form noValidate onSubmit={handleSubmit(onSubmit)}>
				<Stack
					p="32px"
					mb="24px"
					border={(theme) => `1px solid ${theme.palette.grey[100]}`}
					borderRadius="8px"
					sx={{
						'& > .MuiGrid-root:nth-last-of-type(1)': {
							marginBottom: '0px',
						},
					}}>
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
									type={input.type}
									required={input?.required}
									error={
										errors[
											name as keyof RegisterGuaranteeRequestFormData
										]
									}
									{...restInput}
									onChange={(e) => {
										if (name === 'ordererTel') {
											e.target.value =
												handleChangeDataFormat(
													'phoneNum',
													e
												);
										}
										if (name === 'orderedAt') {
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
						if (type === 'autocomplete') {
							return (
								<LabeledAutocomplete
									key={name}
									{...(input as AutocompleteInputType)}
									width="100%"
									defaultOptions={
										storeList?.map((item) => item.label) ||
										[]
									}
									value={getValues('storeName') || ''}
									onChange={(value) => {
										setValue('storeName', value);

										// 기존에 있던 판매처에서 선택된 경우, storeIdx 값 함께 전달
										const existedPlatform = storeList?.find(
											(platform) =>
												platform.label.trim() === value
										);
										if (existedPlatform) {
											setValue(
												'storeIdx',
												existedPlatform.value
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
				<BottomNavigation
					maxWidth={{
						xs: PAGE_MAX_WIDTH,
						md: '926px',
					}}>
					<Stack
						flexDirection="row"
						width="100%"
						justifyContent={
							isInitialRegister ? 'flex-end' : 'space-between'
						}>
						{!isInitialRegister && (
							<GuaranteeDeleteButton idx={initialData?.idx} />
						)}
						<Stack flexDirection="row" columnGap="12px">
							<Button
								variant="outlined"
								color="grey-100"
								height={48}
								type="submit"
								onClick={() => {
									setValue('nftStatus', 'ready');
								}}
								data-tracking={`guarantee_publish_save_click,{'button_title': '임시저장'}`}>
								임시저장
							</Button>
							<Button
								type="submit"
								height={48}
								onClick={() => {
									setValue('nftStatus', 'request');
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
			<GuaranteeRegisterAlimTalkNoticeModal
				open={alimTalkNoticeModalOpen}
				modalData={alimTalkModalData}
			/>
		</>
	);
}

export default GuaranteeRegisterForm;
