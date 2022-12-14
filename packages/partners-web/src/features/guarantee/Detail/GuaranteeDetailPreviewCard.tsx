import {useMemo} from 'react';
import {format} from 'date-fns';

import {Stack} from '@mui/material';

import {useGetPartnershipInfo} from '@/stores';
import {GauranteeDetailResponse, Guarantee} from '@/@types';
import {DATE_FORMAT} from '@/data';

import PreviewGuarantee from '@/components/common/PreviewGuarantee';
import GuaranteeCancelButton from '@/features/guarantee/Detail/GuaranteeCancelButton';

interface Props {
	data: GauranteeDetailResponse;
}

function GuaranteeDetailPreviewCard({data}: Props) {
	const {data: partnershipData} = useGetPartnershipInfo();
	const guaranteeData = useMemo<Guarantee>(() => data.data, [data]);

	const values = useMemo(() => {
		if (!guaranteeData || !partnershipData) return;

		const brandNameEn: string = guaranteeData?.brand_nm_en;
		let certificationBrandName = brandNameEn?.toLocaleUpperCase();
		if (partnershipData?.b2bType !== 'brand') {
			certificationBrandName = partnershipData?.companyName || '';
		}

		// 커스텀 필드 값 세팅
		const nftCustomFieldValue: Record<string, string> = {};
		const customFields = partnershipData?.nftCustomFields;
		if (customFields && customFields?.length) {
			const productCustomField = guaranteeData?.custom_field;
			customFields.forEach((field: string) => {
				nftCustomFieldValue[field] =
					productCustomField && productCustomField[field]
						? productCustomField[field]
						: '-';
			});
		}

		// 상품의 보증기간이 설정되기 전에는 사용자의 보증기간 정보 보여줌
		const warrantyDate = guaranteeData?.warranty_dt;
		return {
			brandNameEN: brandNameEn,
			certificationBrandName,
			warrantyDate,
			nftCustomField: partnershipData?.nftCustomFields || [],
			afterServiceInfo: partnershipData?.afterServiceInfo,
			authInfo: partnershipData?.authInfo,
			customerCenterUrl: partnershipData?.customerCenterUrl,

			nftBackgroundImage: partnershipData?.nftBackgroundImg,
			profileImage: partnershipData?.profileImage,
			returnInfo: partnershipData?.returnInfo,

			// 개런티
			orderDate: guaranteeData?.order_dt,
			platformName: guaranteeData?.order_platform_nm,
			orderId: guaranteeData?.ref_order_id,

			// 상품
			productName: guaranteeData?.pro_nm,
			price: guaranteeData?.price
				? `${guaranteeData?.price.toLocaleString()}원`
				: '0원',
			nftCustomFieldValue: nftCustomFieldValue || null,
			previewImage: guaranteeData?.product_img,
			nftRequestId: guaranteeData?.nft_req_num,

			// TODO: 확인
			nftIssueDt:
				guaranteeData?.nft_issue_dt || format(new Date(), DATE_FORMAT),

			categoryName: guaranteeData?.cate_cd_text,
			modelNum: guaranteeData?.model_num,
			isInvalidCard: guaranteeData.nft_req_state === '9' ? true : false,
		};
	}, [guaranteeData, partnershipData]);

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
					md: '119px',
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
				{data?.data?.nft_req_idx &&
					['3', '4'].includes(data?.data?.nft_req_state) && (
						<GuaranteeCancelButton idx={data?.data?.nft_req_idx} />
					)}
			</Stack>
		</Stack>
	);
}

export default GuaranteeDetailPreviewCard;
