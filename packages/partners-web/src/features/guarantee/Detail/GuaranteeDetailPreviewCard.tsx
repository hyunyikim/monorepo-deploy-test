import {useMemo} from 'react';

import {Stack} from '@mui/material';

import {useGetPartnershipInfo} from '@/stores';

import PreviewGuarantee from '@/components/common/PreviewGuarantee';
import GuaranteeCancelButton from '@/features/guarantee/Detail/GuaranteeCancelButton';
import {GuaranteeDetail} from '@/@types';

interface Props {
	data: GuaranteeDetail;
}

function GuaranteeDetailPreviewCard({data}: Props) {
	const {data: partnershipData} = useGetPartnershipInfo();

	const values = useMemo(() => {
		if (!data || !partnershipData) return;

		const brandNameEn: string = data?.brandNameEn;
		let certificationBrandName = brandNameEn?.toLocaleUpperCase();
		if (partnershipData?.b2bType !== 'brand') {
			certificationBrandName = partnershipData?.companyName || '';
		}

		// 커스텀 필드 값 세팅
		const nftCustomFieldValue: Record<string, string> = {};
		const customFields = partnershipData?.nftCustomFields;
		if (customFields && customFields?.length) {
			const productCustomField = data?.customField;
			customFields.forEach((field: string) => {
				nftCustomFieldValue[field] =
					productCustomField && productCustomField[field]
						? productCustomField[field]
						: '-';
			});
		}

		// 상품의 보증기간이 설정되기 전에는 사용자의 보증기간 정보 보여줌
		const warrantyDate = data?.warrantyDate;
		return {
			brandNameEN: brandNameEn,
			certificationBrandName,
			warrantyDate,
			nftCustomField: partnershipData?.nftCustomFields || [],
			afterServiceInfo: partnershipData?.afterServiceInfo,
			authInfo: partnershipData?.authInfo,
			customerCenterUrl: partnershipData?.customerCenterUrl,

			nftBackgroundImage:
				data?.nftCardImg || partnershipData?.nftBackgroundImg,
			profileImage: partnershipData?.profileImage,
			returnInfo: partnershipData?.returnInfo,

			// 개런티
			orderDate: data?.orderedAt ? data?.orderedAt.slice(0, 10) : '-',
			platformName: data?.platformName,
			orderId: data?.orderNumber,

			// 상품
			productName: data?.productName,

			price: data?.price ? `${data?.price.toLocaleString()}원` : '0원',
			nftCustomFieldValue: nftCustomFieldValue || null,
			previewImage: null,
			nftRequestId: data?.nftNumber,
			nftIssueDt: data?.issuedAt ? data?.issuedAt.slice(0, 10) : '-',
			modelNum: data?.modelNumber,
			isInvalidCard: data.nftStatusCode === '9' ? true : false,
		};
	}, [data, partnershipData]);

	if (!values) return null;

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
					md: '111px',
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
				<PreviewGuarantee values={values} />
				{data?.idx && ['3', '4'].includes(data?.nftStatusCode) && (
					<GuaranteeCancelButton idx={data?.idx} />
				)}
			</Stack>
		</Stack>
	);
}

export default GuaranteeDetailPreviewCard;
