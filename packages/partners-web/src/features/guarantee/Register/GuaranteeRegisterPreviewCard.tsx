import {useEffect, useMemo} from 'react';
import {format} from 'date-fns';

import {Stack, Typography} from '@mui/material';

import {useGetPartnershipInfo, useGuaranteePreviewStore} from '@/stores';

import PreviewGuarantee from '@/components/common/PreviewGuarantee';
import {DATE_FORMAT} from '@/data';

function GuaranteeRegisterPreviewCard() {
	const previewData = useGuaranteePreviewStore((state) => state.data);
	const resetData = useGuaranteePreviewStore((state) => state.resetData);

	useEffect(() => {
		return () => {
			resetData();
		};
	}, []);

	const {data: partnershipData} = useGetPartnershipInfo();

	const values = useMemo(() => {
		const brandNameEn: string =
			previewData?.product?.brandNameEn ||
			partnershipData?.brand?.englishName;
		let certificationBrandName = brandNameEn?.toLocaleUpperCase();
		if (partnershipData?.b2bType !== 'brand') {
			certificationBrandName = partnershipData?.companyName || '';
		}
		// 커스텀 필드 값 세팅
		const nftCustomFieldValue: Record<string, string> = {};
		const customFields = partnershipData?.nftCustomFields;
		if (customFields && customFields?.length) {
			const productCustomField = previewData?.product?.customField;
			customFields.forEach((field: string) => {
				nftCustomFieldValue[field] =
					productCustomField && productCustomField[field]
						? productCustomField[field]
						: '-';
			});
		}

		// 상품의 보증기간이 설정되기 전에는 사용자의 보증기간 정보 보여줌
		const warrantyDate =
			previewData?.product?.warranty || partnershipData?.warrantyDate;
		return {
			brandNameEN: brandNameEn,
			certificationBrandName,
			warrantyDate,

			nftCustomField: partnershipData?.nftCustomFields || [],
			afterServiceInfo: partnershipData?.afterServiceInfo,
			authInfo: partnershipData?.authInfo,

			nftBackgroundImage: partnershipData?.nftBackgroundImg,
			profileImage: partnershipData?.profileImage,
			returnInfo: partnershipData?.returnInfo,

			// 개런티
			orderDate: previewData?.order_dt || '-',
			platformName: previewData?.platform_nm || '-',
			orderId: previewData?.ref_order_id || '-',

			// 상품
			productName: previewData?.product?.name || '상품명',
			price: previewData?.product?.price
				? `${String(previewData?.product?.price)}원`
				: '0원',
			nftCustomFieldValue: nftCustomFieldValue || null,
			previewImage:
				partnershipData?.useNftProdImage === 'Y'
					? previewData?.productImage?.preview
					: null,
			nftRequestId: previewData?.nft_req_num || '000000000000',
			nftIssueDt:
				previewData?.nft_issue_dt || format(new Date(), DATE_FORMAT),
			categoryName: previewData?.categoryName,
			modelNum: previewData?.modelNum,
		};
	}, [previewData, partnershipData]);

	if (!partnershipData) return <></>;

	return (
		<Stack
			sx={{
				width: '296px',
				marginX: {
					xs: 'auto',
					md: 0,
				},
				marginTop: {
					xs: '0px',
					md: '34px',
				},
				marginBottom: '60px',
			}}>
			<Stack
				position={{
					xs: 'static',
					md: 'sticky',
				}}
				top={{
					xs: 'none',
					md: '10px',
				}}>
				<Typography color="grey.500" fontWeight="bold" mb="8px">
					개런티 미리보기
				</Typography>
				<PreviewGuarantee values={values} />
			</Stack>
		</Stack>
	);
}

export default GuaranteeRegisterPreviewCard;
