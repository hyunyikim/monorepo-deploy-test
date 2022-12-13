import {useMemo, useState} from 'react';

import {Stack, Typography} from '@mui/material';

import {Guarantee} from '@/@types';
import {useGetPartnershipInfo} from '@/stores';
import {useChildModalOpen} from '@/utils/hooks';

import {IcChevronDown20} from '@/assets/icon';
import {ImageModal} from '@/components';
import GuaranteeDetailInfoColumn from '@/features/guarantee/Detail/GuaranteeDetailInfoColumn';
import ProductImage from '@/features/product/common/ProductImage';
import {sendAmplitudeLog} from '@/utils';

function GuaranteeDetailProductInfo({data}: {data: Guarantee}) {
	const {data: partnershipData} = useGetPartnershipInfo();
	const b2bType = useMemo(() => partnershipData?.b2bType, [partnershipData]);
	const customFields = useMemo(() => {
		if (!data?.custom_field) {
			return;
		}
		return Object.entries(data?.custom_field as Record<string, string>).map(
			(item) => item
		);
	}, [data]);

	const {open, onOpen, onClose, modalData, onSetModalData} =
		useChildModalOpen({});

	const [openBox, setOpenBox] = useState(false);

	return (
		<>
			<Stack
				flexDirection="column"
				padding="32px"
				borderRadius="8px"
				border={(theme) => `1px solid ${theme.palette.grey[100]}`}
				mb="24px">
				<Typography fontSize={18} fontWeight="bold" mb="24px">
					상품정보
				</Typography>
				<Stack
					flexDirection="row"
					justifyContent="space-between"
					alignItems="center">
					<Stack flexDirection="row" columnGap="13px">
						<ProductImage
							src={data?.product_img || ''}
							onImgClick={() => {
								sendAmplitudeLog(
									'guarantee_detail_itemimage_click',
									{button_title: '상품이미지 클릭'}
								);

								if (!data?.product_img) return;
								onSetModalData({
									imgSrc: data?.product_img,
									imgAlt: 'product image',
								});
								onOpen();
							}}
						/>
						<Stack flexDirection="column">
							<Typography fontSize={13} color="grey.400">
								{data?.brand_nm || '-'}
							</Typography>
							<Typography fontSize={14} fontWeight="bold">
								{data?.pro_nm || '-'}
							</Typography>
							<Typography fontSize={14} color="grey.600">
								{data?.price
									? `${data?.price.toLocaleString()}원`
									: '-'}
							</Typography>
						</Stack>
					</Stack>
					<Stack>
						<IcChevronDown20
							className="cursor-pointer"
							style={{
								transition: 'all 0.25s ease-in-out',
								transform: openBox
									? 'rotate(-180deg)'
									: 'rotate(0)',
							}}
							onClick={() => {
								setOpenBox((prev) => !prev);
							}}
						/>
					</Stack>
				</Stack>
				<Stack
					flexDirection="column"
					rowGap="20px"
					sx={{
						transition: 'all 0.25s ease-in-out',
						...(!openBox && {
							maxHeight: 0,
							overflow: 'hidden',
						}),
						...(openBox && {
							marginTop: '24px',
							maxHeight: '1000px',
						}),
					}}>
					<GuaranteeDetailInfoColumn
						title="보증기간"
						value={data.warranty_dt}
						sx={{
							'& > p:nth-of-type(2)': {
								lineHeight: '20px',
							},
						}}
					/>
					{b2bType !== 'brand' && (
						<GuaranteeDetailInfoColumn
							title="카테고리"
							value={data?.cate_cd_text || '-'}
							sx={{
								marginRight: '118px',
							}}
						/>
					)}
					{partnershipData?.useFieldModelNum === 'Y' && (
						<GuaranteeDetailInfoColumn
							title="모델번호"
							value={data?.model_num || '-'}
						/>
					)}
					{partnershipData?.useFieldMaterial === 'Y' && (
						<GuaranteeDetailInfoColumn
							title="소재"
							value={data?.material || '-'}
						/>
					)}
					{partnershipData?.useFieldSize === 'Y' && (
						<GuaranteeDetailInfoColumn
							title="사이즈"
							value={data?.size || '-'}
						/>
					)}
					{partnershipData?.useFieldWeight === 'Y' && (
						<GuaranteeDetailInfoColumn
							title="중량(무게)"
							value={data?.model_num || '-'}
						/>
					)}
					{customFields && customFields?.length > 0 && (
						<>
							{customFields.map((item) => (
								<GuaranteeDetailInfoColumn
									key={item[0]}
									title={item[0]}
									value={item[1] || '-'}
								/>
							))}
						</>
					)}
				</Stack>
			</Stack>
			<ImageModal
				open={open}
				onClose={onClose}
				imgSrc={modalData?.imgSrc}
				imgAlt={modalData?.imgAlt}
			/>
		</>
	);
}

export default GuaranteeDetailProductInfo;
