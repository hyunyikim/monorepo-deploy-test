import {useMemo, useState} from 'react';
import {Button} from '@/components';
import {
	ExcelError,
	ProductExcelUploadInput,
	ProductExcelUploadInputWithCustomFields,
	ProductExcelUploadRequestData,
} from '@/@types';
import {
	useGetPartnershipInfo,
	useGlobalLoading,
	useMessageDialog,
} from '@/stores';
import ProgressModal from '@/features/common/ProgressModal';
import {useChildModalOpen} from '@/utils/hooks';
import {goToParentUrl} from '@/utils';
import {CATEGORIES, customFieldsToJSONString} from '@/data';
import {bulkRegisterProduct} from '@/api/product.api';

interface Props {
	gridData: ProductExcelUploadInput[] | null;
	excelErrors: ExcelError | null;
}

function ProductExcelSubmit({gridData, excelErrors}: Props) {
	const [requestCount, setRequestCount] = useState(0);
	const totalCount = useMemo(() => gridData?.length || 0, [gridData]);
	const setIsLoading = useGlobalLoading((state) => state.setIsLoading);
	const onOpenMessageDialog = useMessageDialog((state) => state.onOpen);
	const onCloseMessageDialog = useMessageDialog((state) => state.onClose);

	const {data: partnershipData} = useGetPartnershipInfo();

	// 상품 등록중 모달
	const {
		open: openRegisterGuaranteeListModal,
		onOpen: onOpenRegisterGuaranteeListModal,
		onClose: onCloseRegisterGuaranteeListModal,
	} = useChildModalOpen({});

	const handleSubmit = async () => {
		if (!gridData || gridData?.length === 0) {
			return;
		}
		setIsLoading(true, false);
		let failCount = 0;

		onCloseMessageDialog();
		onOpenRegisterGuaranteeListModal();
		for (let i = 0; i < gridData.length; i++) {
			try {
				let data: ProductExcelUploadInputWithCustomFields = {
					...gridData[i],
				};
				const isB2bTypeBrand = partnershipData?.b2bType === 'brand';
				if (isB2bTypeBrand) {
					data = {
						...data,
						brandIdx: partnershipData?.brand?.idx,
					};
				}
				if (!isB2bTypeBrand) {
					data = {
						...data,
						categoryName: CATEGORIES[data.categoryCode],
					};
				}

				const customFields = partnershipData?.nftCustomFields || [];
				data = {
					...data,
					customField: customFieldsToJSONString(data, customFields),
				};
				customFields.forEach((customField) => {
					if (data?.hasOwnProperty(customField)) {
						delete data[customField];
					}
				});
				await bulkRegisterProduct([
					data as ProductExcelUploadRequestData,
				]);
				setRequestCount((prev) => prev + 1);
			} catch (e) {
				failCount += 1;
			}
		}

		// delay
		await new Promise((resolve) => {
			setTimeout(() => {
				resolve('');
				setIsLoading(false);
			}, 1000);
		});
		onCloseRegisterGuaranteeListModal();
		onOpenMessageDialog({
			title: '상품이 등록됐어요.',
			message: (
				<>
					총 <b>{(totalCount - failCount).toLocaleString()}건</b>의
					상품이 정상적으로 등록됐어요.
					{failCount > 0 && (
						<>
							<br />
							{failCount.toLocaleString()}건은 일부 오류가 발생해
							등록되지 않았습니다. 다시 확인해주세요.
						</>
					)}
				</>
			),
			showBottomCloseButton: true,
			closeButtonValue: '확인',
			onCloseFunc: () => {
				goToParentUrl('/b2b/product');
			},
		});
	};

	return (
		<>
			<Button
				height={40}
				disabled={!!(excelErrors && excelErrors?.size > 0)}
				onClick={() => {
					onOpenMessageDialog({
						title: '상품을 등록하시겠어요?',
						message: `${(
							gridData?.length || 0
						).toLocaleString()}개의 상품정보가 확인됐어요.`,
						showBottomCloseButton: true,
						closeButtonValue: '취소',
						buttons: (
							<Button
								color="black"
								onClick={handleSubmit}
								data-tracking={`itemadmin_excelpublish_infodeficiency_popuppublish,{'button_title': '상품등록 대량 등록하기'}`}>
								등록
							</Button>
						),
					});
				}}>
				상품 등록
			</Button>
			<ProgressModal
				title="상품 등록중"
				open={openRegisterGuaranteeListModal}
				requestCount={requestCount}
				totalCount={totalCount}
			/>
		</>
	);
}

export default ProductExcelSubmit;
