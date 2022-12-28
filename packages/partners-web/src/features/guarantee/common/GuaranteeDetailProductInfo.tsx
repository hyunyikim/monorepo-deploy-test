import {useMemo, useState} from 'react';

import {Stack, Typography} from '@mui/material';

import {GuaranteeDetail} from '@/@types';
import {useGetPartnershipInfo} from '@/stores';
import {useChildModalOpen} from '@/utils/hooks';

import {IcChevronDown20} from '@/assets/icon';
import {ImageModal} from '@/components';
import DetailInfoColumn from '@/features/common/DetailInfoColumn';
import ProductImage from '@/features/product/common/ProductImage';
import {sendAmplitudeLog} from '@/utils';

function GuaranteeDetailProductInfo({data}: {data: GuaranteeDetail}) {
	const {data: partnershipData} = useGetPartnershipInfo();
	const customFields = useMemo(() => {
		if (!data?.customField) {
			return;
		}
		return Object.entries(data?.customField).map((item) => item);
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
				<Typography variant="subtitle2" mb="12px">
					상품정보
				</Typography>
				<Stack
					flexDirection="row"
					justifyContent="space-between"
					alignItems="center"
					columnGap="4px">
					<Stack
						flexDirection="row"
						alignItems="center"
						columnGap="13px">
						<ProductImage
							src={
								data?.productImages?.length > 0
									? data?.productImages[0]
									: ''
							}
							onImgClick={() => {
								sendAmplitudeLog(
									'guarantee_detail_itemimage_click',
									{button_title: '상품이미지 클릭'}
								);
								const productImages = data?.productImages;
								if (productImages?.length > 0) {
									onSetModalData({
										imgSrc: productImages[0],
										imgAlt: 'product image',
									});
									onOpen();
								}
							}}
						/>
						<Stack flexDirection="column">
							<Typography variant="caption1" color="grey.400">
								{data?.brandName || '-'}
							</Typography>
							<Typography variant="body3" fontWeight="bold">
								{data?.productName || '-'}
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
								transition: 'transform 0.25s ease-in-out',
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
						transitionProperty: 'max-height, overflow, margin-top',
						transitionDelay: '0.01s',
						transitionDuration: '0.25s',
						transitionTimingFunction: 'ease-in-out',
						'-webkit-transform': 'translateZ(0)',
						...(!openBox && {
							maxHeight: 0,
							overflow: 'hidden',
						}),
						...(openBox && {
							marginTop: '24px',
							maxHeight: '1000px',
						}),
					}}>
					<DetailInfoColumn
						title="보증기간"
						value={data.warrantyDate}
						sx={{
							'& > p:nth-of-type(2)': {
								lineHeight: '20px',
							},
						}}
					/>
					{/* {b2bType !== 'brand' && (
						<DetailInfoColumn
							title="카테고리"
							value={data?.cate_cd_text || '-'}
							sx={{
								marginRight: '118px',
							}}
						/>
					)} */}
					{partnershipData?.useFieldModelNum === 'Y' && (
						<DetailInfoColumn
							title="모델번호"
							value={data?.modelNumber || '-'}
						/>
					)}
					{partnershipData?.useFieldMaterial === 'Y' && (
						<DetailInfoColumn
							title="소재"
							value={data?.material || '-'}
						/>
					)}
					{partnershipData?.useFieldSize === 'Y' && (
						<DetailInfoColumn
							title="사이즈"
							value={data?.size || '-'}
						/>
					)}
					{partnershipData?.useFieldWeight === 'Y' && (
						<DetailInfoColumn
							title="중량(무게)"
							value={data?.weight || '-'}
						/>
					)}
					{customFields && customFields?.length > 0 && (
						<>
							{customFields.map((item) => (
								<DetailInfoColumn
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
