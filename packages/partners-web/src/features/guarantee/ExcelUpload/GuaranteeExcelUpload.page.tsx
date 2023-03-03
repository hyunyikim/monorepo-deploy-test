import {useCallback, useEffect, useMemo} from 'react';

import {Stack} from '@mui/material';

import {ExcelInput, GuaranteeExcelUploadFormData} from '@/@types';
import {
	useGetGuaranteeSettingCompleted,
	useGetPartnershipInfo,
	useGetPlatformList,
	useGetSearchBrandList,
	useMessageDialog,
} from '@/stores';
import {
	CATEGORIES,
	getGuaranteeExcelField,
	GUARANTEE_EXCEL_COLUMN,
	GUARANTEE_EXCEL_INPUT,
} from '@/data';
import {useOpen, useExcelUpload} from '@/utils/hooks';

import {ContentWrapper, TitleTypography, Button} from '@/components';
import GuaranteeExcelUploadDataGrid from './GuaranteeExcelUploadDataGrid';
import LackExcelInformationModal from '@/features/common/Excel/LackExcelInformationModal';
import ExcelUploadProductImageModal from '@/features/common/Excel/ExcelUploadProductImageModal';
import GuaranteeExcelSubmit from './GuaranteeExcelSubmit';
import GuaranteeExcelFormatDownloadButton from './GuaranteeExcelFormatDownloadButton';
import ExcelDragDropBox from '@/features/common/Excel/ExcelDragDropBox';
import {sendAmplitudeLog, usePageView} from '@/utils';
import {useNavigate} from 'react-router-dom';

function GuaranteeExcelUpload() {
	usePageView('guarantee_excelpublish_pv', '대량등록 진입');

	const navigate = useNavigate();
	const {data: partnershipData} = useGetPartnershipInfo();
	const {data: brandList} = useGetSearchBrandList();
	const {data: platformList} = useGetPlatformList();
	const {data: guaranteeSettingCompleted} = useGetGuaranteeSettingCompleted();

	const onOpenMessageDialog = useMessageDialog((state) => state.onOpen);

	useEffect(() => {
		if (!guaranteeSettingCompleted) {
			sendAmplitudeLog('guarantee_publish_popupview', {
				pv_title: '개런티 미설정시 안내 팝업',
			});
			onOpenMessageDialog({
				title: '개런티 설정 후 개런티 발급이 가능합니다.',
				showBottomCloseButton: true,
				closeButtonValue: '확인',
				onCloseFunc: () => {
					navigate('/setup/guarantee');
				},
			});
		}
	}, [guaranteeSettingCompleted]);

	// 정보 부족 모달
	const {
		onOpen: onOpenLackExcelInformationModal,
		onClose: onCloseLackExcelInformationModal,
		open: openLackExcelInformationModal,
	} = useOpen({
		handleClose: () => {
			sendAmplitudeLog(
				'guarantee_excelpublish_infodeficiency_popupcomplete',
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

	// 필수/선택 필드
	// 이 필드를 기반으로 excel input/excel DataCell을 생성함
	const fields = useMemo(() => {
		if (!partnershipData) return;
		return getGuaranteeExcelField(partnershipData);
	}, [partnershipData]);

	// input 동적 구성
	const inputs = useMemo<ExcelInput[]>(() => {
		return (
			fields
				?.map((field) => {
					const fieldKey = field.key;
					const input = GUARANTEE_EXCEL_INPUT[fieldKey] || {
						// 커스텀 필드
						type: 'text',
						name: fieldKey,
					};
					// select option 동적 구성
					if (input.type === 'select') {
						if (input.name === 'brand_idx') {
							const findBrand = (val: number) => {
								// 브랜드명 한글/영문으로 되어있는데 그 안에서 올바른 브랜드 찾기 위한 절차
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
						if (input.name === 'cate_cd') {
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
					// auto complete 동적 구성
					if (input.name === 'platform_nm') {
						return {
							...input,
							options: platformList || [],
						};
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
	} = useExcelUpload<GuaranteeExcelUploadFormData>({
		excelColumn: GUARANTEE_EXCEL_COLUMN,
		excelInput: GUARANTEE_EXCEL_INPUT,
		inputs,
	});

	const handleCancel = useCallback(() => {
		onOpenMessageDialog({
			title: '개런티 발급을 취소하시겠어요?',
			message: '모든 데이터가 취소됩니다.',
			showBottomCloseButton: true,
			closeButtonValue: '닫기',
			buttons: (
				<Button
					color="black"
					onClick={handleInit}
					data-tracking={`guarantee_excelpublish_infodeficiency_popupcencle,{'button_title': '발급 취소'}`}>
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
				<TitleTypography title="개런티 대량발급" />
				{!gridData ? (
					<>
						<Stack alignItems="end" mb="20px">
							<GuaranteeExcelFormatDownloadButton
								fields={fields}
							/>
						</Stack>
						<ExcelDragDropBox
							progress={excelProgress}
							onUploadFile={(e) => {
								sendAmplitudeLog(
									'guarantee_excelpublish_fileselect_click',
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
						<GuaranteeExcelUploadDataGrid
							inputs={inputs}
							fields={fields}
							data={gridData}
							excelErrors={excelErrors}
							onUpdate={handleUpdate}
							onOpenLackExcelInformationModal={() => {
								onOpenLackExcelInformationModal();
								sendAmplitudeLog(
									'guarantee_excelpublish_infodeficiency_popupview',
									{
										pv_title: '개런티 정보부족 팝업 노출',
									}
								);
							}}
							onOpenProductImgModal={onOpenProductImgModal}
							setProductImgModalData={setProductImgModalData}
							ExcelFormatDownloadButton={
								<GuaranteeExcelFormatDownloadButton
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
							<GuaranteeExcelSubmit
								gridData={gridData}
								errors={excelErrors}
							/>
						</Stack>
					</>
				)}
			</ContentWrapper>
			{excelLackingInfo && (
				<LackExcelInformationModal
					title="개런티"
					desc="개런티를 발급"
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

export default GuaranteeExcelUpload;
