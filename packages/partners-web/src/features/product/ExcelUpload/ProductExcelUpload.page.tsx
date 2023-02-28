import {useCallback, useMemo} from 'react';

import {Stack} from '@mui/material';

import {ExcelInput, ProductExcelUploadInput} from '@/@types';
import {
	useGetPartnershipInfo,
	useGetSearchBrandList,
	useMessageDialog,
} from '@/stores';
import {
	CATEGORIES,
	getProductExcelField,
	PRODUCT_EXCEL_COLUMN,
	PRODUCT_EXCEL_INPUT,
} from '@/data';
import {useOpen, useExcelUpload} from '@/utils/hooks';

import {ContentWrapper, TitleTypography, Button} from '@/components';
import LackExcelInformationModal from '@/features/common/Excel/LackExcelInformationModal';
import ExcelUploadProductImageModal from '@/features/common/Excel/ExcelUploadProductImageModal';
import ProductExcelFormatDownloadButton from './ProductExcelFormatDownloadButton';
import ProductExcelUploadDataGrid from './ProductExcelUploadDataGrid';
import ProductExcelSubmit from './ProductExcelSubmit';
import ExcelDragDropBox from '@/features/common/Excel/ExcelDragDropBox';
import {sendAmplitudeLog, usePageView} from '@/utils';

function ProductExcelUpload() {
	usePageView('itemadmin_excel_regist_pv', '대량등록 진입');

	const {data: partnershipData} = useGetPartnershipInfo();
	const {data: brandList} = useGetSearchBrandList();

	const onOpenMessageDialog = useMessageDialog((state) => state.onOpen);

	// 필수/옵션 필드들
	const fields = useMemo(() => {
		if (!partnershipData) return;
		return getProductExcelField(partnershipData);
	}, [partnershipData]);

	// input 동적 구성
	const inputs = useMemo<ExcelInput[]>(() => {
		return (
			fields
				?.map((field) => {
					const fieldKey = field.key;
					const input = PRODUCT_EXCEL_INPUT[fieldKey] || {
						// 커스텀 필드
						type: 'text',
						name: fieldKey,
					};
					// select option 동적 구성
					if (input.type === 'select') {
						if (input.name === 'brandIdx') {
							const findBrand = (val: number) => {
								const cleanValue = val
									?.toString()
									.toUpperCase()
									.replace(/ /g, '');
								return (brandList || []).filter((brand) => {
									const brandNames = brand.label
										?.toUpperCase()
										.replace(/ /g, '')
										.split('/');
									return (
										brandNames?.indexOf(cleanValue) !== -1
									);
								})[0]?.value;
							};
							return {
								...input,
								options: brandList || [],
								parser: findBrand,
								renderer: (val: number) =>
									(brandList || []).filter(
										(brand) => brand.value === val
									)[0]?.label,
							};
						}
						if (input.name === 'categoryCode') {
							const categoryOptions =
								partnershipData?.category.map((category) => ({
									value: category,
									label: CATEGORIES[category],
								})) || [];
							return {
								...input,
								options: categoryOptions,
								parser: (val: string) => {
									return (
										categoryOptions.find(
											(category) => category.label === val
										)?.value || ''
									);
								},
							};
						}
					}
					return input;
				})
				.filter((item) => !!item) || []
		);
	}, [fields, brandList, partnershipData?.category]);

	const {
		gridData,
		excelProgress,
		excelErrors,
		excelLackingInfo,
		handleInit,
		handleExcelUpload,
		handleUpdate,
	} = useExcelUpload<ProductExcelUploadInput>({
		excelColumn: PRODUCT_EXCEL_COLUMN,
		excelInput: PRODUCT_EXCEL_INPUT,
		inputs,
	});

	// 정보 부족 모달
	const {
		onOpen: onOpenLackExcelInformationModal,
		onClose: onCloseLackExcelInformationModal,
		open: openLackExcelInformationModal,
	} = useOpen({
		handleClose: () => {
			sendAmplitudeLog(
				'itemadmin_excelpublish_infodeficiency_popupcomplete',
				{
					button_title: '확인 클릭시 닫힘',
				}
			);
		},
	});

	// 상품 이미지 모달
	const {
		onOpen: onOpenProductImgModal,
		onClose: onCloseProductImgModal,
		onSetModalData: setProductImgModalData,
		modalData: productImgModalData,
		open: openProductImgModal,
	} = useOpen({
		handleClose: () => {
			setProductImgModalData(null);
		},
	});

	const handleCancel = useCallback(() => {
		onOpenMessageDialog({
			title: '상품 등록을 취소하시겠어요?',
			message: '모든 데이터가 취소됩니다.',
			showBottomCloseButton: true,
			closeButtonValue: '닫기',
			buttons: (
				<Button
					color="black"
					onClick={handleInit}
					data-tracking={`itemadmin_excelpublish_infodeficiency_popupcencle,{'button_title': '등록 취소'}`}>
					취소하기
				</Button>
			),
		});
	}, [handleInit]);

	if (!partnershipData || !fields) {
		return <></>;
	}
	return (
		<>
			<ContentWrapper fullWidth>
				<TitleTypography title="상품 대량등록" />
				{!gridData ? (
					<>
						<Stack alignItems="end" mb="20px">
							<ProductExcelFormatDownloadButton fields={fields} />
						</Stack>
						<ExcelDragDropBox
							progress={excelProgress}
							onUploadFile={(e) => {
								sendAmplitudeLog(
									'itemadmin_excelpublish_fileselect_click',
									{
										button_title:
											'파일선택 클릭 시 finder 창 노출',
									}
								);
								handleExcelUpload(e);
							}}
						/>
					</>
				) : (
					<>
						<ProductExcelUploadDataGrid
							inputs={inputs}
							fields={fields}
							data={gridData}
							excelErrors={excelErrors}
							onUpdate={handleUpdate}
							onOpenLackExcelInformationModal={() => {
								onOpenLackExcelInformationModal();
								sendAmplitudeLog(
									'itemadmin_excelpublish_infodeficiency_popupview',
									{
										pv_title: '상품등록 정보부족 팝업 노출',
									}
								);
							}}
							onOpenProductImgModal={onOpenProductImgModal}
							setProductImgModalData={setProductImgModalData}
							ExcelFormatDownloadButton={
								<ProductExcelFormatDownloadButton
									fields={fields}
								/>
							}
						/>
						<Stack
							flexDirection="row"
							mt="24px"
							justifyContent="center">
							<Button
								variant="outlined"
								height={40}
								color="grey-100"
								sx={{
									marginRight: '8px',
								}}
								onClick={handleCancel}>
								취소
							</Button>
							<ProductExcelSubmit
								gridData={gridData}
								excelErrors={excelErrors}
							/>
						</Stack>
					</>
				)}
			</ContentWrapper>
			{excelLackingInfo && (
				<LackExcelInformationModal
					title="상품"
					desc="상품"
					data={excelLackingInfo}
					open={openLackExcelInformationModal}
					onClose={onCloseLackExcelInformationModal}
				/>
			)}
			<ExcelUploadProductImageModal
				modalData={productImgModalData}
				open={openProductImgModal}
				onClose={onCloseProductImgModal}
				onSave={handleUpdate}
			/>
		</>
	);
}

export default ProductExcelUpload;
