import {useEffect, useMemo} from 'react';
import {format} from 'date-fns';

import {Stack, Typography} from '@mui/material';

import {useGetPartnershipInfo, useGuaranteePreviewStore} from '@/stores';

import PreviewGuarantee from '@/components/common/PreviewGuarantee';
import {DATE_FORMAT} from '@/data';

function GuaranteePreviewCard() {
	const previewData = useGuaranteePreviewStore((state) => state.data);
	const resetData = useGuaranteePreviewStore((state) => state.resetData);

	useEffect(() => {
		return () => {
			resetData();
		};
	}, []);

	const {data: partnershipData} = useGetPartnershipInfo();

	const values = useMemo(() => {
		let brandName: string = previewData?.product?.brandName;
		const brandNameEn = partnershipData?.brand?.englishName;

		// 병행수입은 브랜드명 / 로 분리되어 있음
		if (
			brandName &&
			brandName?.includes(' / ') &&
			brandName.split(' / ')?.length === 2
		) {
			brandName = brandName.split(' / ')[1];
		} else {
			// 일반 브랜드는 영어명으로
			brandName = brandNameEn || brandName;
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
			brandNameEN: brandName,
			warrantyDate,
			nftCustomField: partnershipData?.nftCustomFields || [],
			afterServiceInfo: partnershipData?.afterServiceInfo,
			authInfo: partnershipData?.authInfo,
			customerCenterUrl: partnershipData?.customerCenterUrl,
			'newCustomField-6': '',
			'newCustomField-7': '',
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
				: '',
			nftCustomFieldValue: nftCustomFieldValue || null,
			previewImage: previewData?.productImage?.preview,
			nftRequestId: previewData?.nft_req_idx || '000000000000',
			nftIssueDt:
				previewData?.nft_issue_dt || format(new Date(), DATE_FORMAT),
		};
	}, [previewData, partnershipData]);

	if (!partnershipData) return <></>;

	return (
		<Stack
			sx={{
				width: '280px',
				marginX: {
					xs: 'auto',
					md: 0,
				},
				marginTop: {
					xs: '0px',
					md: '70px',
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
				<PreviewGuarantee
					values={values}
					serviceCenterHandler={() => {
						const customerCenterUrl =
							partnershipData.customerCenterUrl;
						if (customerCenterUrl) {
							if (customerCenterUrl.includes('http')) {
								window.open(customerCenterUrl);
								return;
							}
							window.open(`https://${customerCenterUrl}`);
						}
					}}
				/>
			</Stack>
		</Stack>
	);
}

export default GuaranteePreviewCard;
