import {Stack, Typography} from '@mui/material';

import {goToParentUrl} from '@/utils';
import {ProductDetailResponse} from '@/@types';
import {useGetPartnershipInfo} from '@/stores';

import {Breadcrumbs, DetailInfoCard} from '@/components';
import DetailInfoColumn from '@/features/common/DetailInfoColumn';
import ProductImage from '@/features/product/common/ProductImage';
import {IcPencil, IcWallet, IcCalendar, IcReceipt} from '@/assets/icon';

import style from '@/assets/styles/style.module.scss';

interface Props {
	data: ProductDetailResponse;
}

function ProductDetailInfo({data}: Props) {
	const {data: partnershipInfo} = useGetPartnershipInfo();

	return (
		<>
			<Breadcrumbs
				before={[{title: '상품', href: '/b2b/product'}]}
				current={data?.name ?? '-'}
			/>
			<Stack
				direction={{sm: 'column', md: 'row'}}
				width="100%"
				gap={{xs: '12px'}}
				justifyContent="space-between"
				flexWrap="wrap"
				mt="12px"
				mb="34px">
				<Stack flexDirection="row" alignItems="center">
					<ProductImage src={data.productImage} />
					<Typography
						className="text-ellipsis"
						variant="subtitle1"
						fontWeight="bold"
						ml={2}
						mr={1}>
						{data.name || '-'}
					</Typography>
					<IcPencil
						color={style.vircleGrey400}
						className="cursor-pointer"
						onClick={() => {
							goToParentUrl(`/b2b/product/edit/${data.idx}`);
						}}
					/>
				</Stack>
				<Stack
					flexDirection={{
						sm: 'column',
						md: 'row',
					}}
					flexWrap={'wrap'}
					gap={'12px'}>
					{[
						{
							title: 'No.',
							value: data.num,
							Icon: <IcReceipt color={style.vircleGrey500} />,
						},
						{
							title: '상품 등록일',
							value: data?.registeredAt?.substr(0, 10),
							Icon: <IcCalendar color={style.vircleGrey500} />,
						},
						{
							title: '총 개런티 발급건수',
							value: data.nftCount,
							Icon: <IcWallet color={style.vircleGrey500} />,
						},
					].map((item, idx) => (
						<DetailInfoCard key={idx} {...item} />
					))}
				</Stack>
			</Stack>
			<Stack
				flexDirection={{
					xs: 'column',
					md: 'row',
				}}
				gap="14px"
				sx={{
					'& > div': {
						flex: '0.4 0.6',
					},
				}}>
				<Stack
					gap="14px"
					flexDirection={{
						xs: 'column',
						sm: 'row',
					}}
					flexWrap="wrap"
					sx={{
						'& > div': {
							maxWidth: '150px',
							width: '100%',
						},
					}}>
					<DetailInfoColumn
						title="상품가격"
						value={
							data?.price
								? `${data?.price?.toLocaleString()}원`
								: '-'
						}
					/>
					<DetailInfoColumn
						title="상품코드"
						value={data?.code || '-'}
					/>
					{partnershipInfo?.useFieldModelNum === 'Y' && (
						<DetailInfoColumn
							title="모델번호"
							value={data?.modelNum || '-'}
						/>
					)}
					{partnershipInfo?.useFieldMaterial === 'Y' && (
						<DetailInfoColumn
							title="소재"
							value={data?.material || '-'}
						/>
					)}
					{partnershipInfo?.useFieldSize === 'Y' && (
						<DetailInfoColumn
							title="사이즈"
							value={data?.size || '-'}
						/>
					)}
					{partnershipInfo?.useFieldWeight === 'Y' && (
						<DetailInfoColumn
							title="중량(무게)"
							value={data?.weight || '-'}
						/>
					)}
					{data?.customField &&
						Object.keys(data?.customField)?.length > 0 &&
						Object.keys(data?.customField).map((key) => (
							<DetailInfoColumn
								key={key}
								title={key}
								value={
									(data?.customField &&
										data?.customField[key]) ||
									'-'
								}
							/>
						))}
				</Stack>
				<DetailInfoColumn title="보증기간" value={data?.warranty} />
			</Stack>
		</>
	);
}

export default ProductDetailInfo;
