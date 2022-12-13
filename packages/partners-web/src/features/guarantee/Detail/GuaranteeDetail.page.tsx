import {useEffect, useMemo, useState} from 'react';
import {useParams} from 'react-router-dom';

import {Stack, Typography} from '@mui/material';

import {GauranteeDetailResponse, Guarantee} from '@/@types';
import {getGuaranteeDetail} from '@/api/guarantee.api';
import {getGuaranteeStatusChip, PAGE_MAX_WIDTH} from '@/data';
import {usePageView} from '@/utils';

import GuaranteeDetailCustomerInfo from '@/features/guarantee/Detail/GuaranteeDetailCustomerInfo';
import GuaranteeDetailProductInfo from '@/features/guarantee/Detail/GuaranteeDetailProductInfo';
import GuaranteeDetailSellerInfo from '@/features/guarantee/Detail/GuaranteeDetailSellerInfo';
import GuaranteeDetailInfo from '@/features/guarantee/Detail/GuaranteeDetailInfo';
import GuaranteeDetailPreviewCard from '@/features/guarantee/Detail/GuaranteeDetailPreviewCard';

function GuaranteeDetail() {
	usePageView('guarantee_detail_pv', '개런티 상세페이지 노출');
	const params = useParams();
	const idx = params?.idx;

	const [data, setData] = useState<GauranteeDetailResponse | null>(null);

	useEffect(() => {
		(async () => {
			if (!idx) {
				return;
			}
			const res = await getGuaranteeDetail(Number(idx));
			setData(res);
		})();
	}, [idx]);

	const guaranteeData = useMemo<Guarantee | null>(
		() => data && data?.data,
		[data]
	);

	if (!data || !guaranteeData) return null;

	return (
		<Stack
			justifyContent="center"
			flexDirection={{
				xs: 'column',
				md: 'row',
			}}>
			<Stack
				flexDirection="column"
				width="100%"
				maxWidth={PAGE_MAX_WIDTH}
				marginRight={{
					xs: 'auto',
					md: '40px',
				}}
				marginLeft={{
					xs: 'auto',
					md: '0',
				}}
				mb="60px">
				<Typography
					variant="h1"
					fontSize={28}
					fontWeight={700}
					mb="40px">
					개런티 상세
				</Typography>
				<Stack
					flexDirection="row"
					justifyContent="space-between"
					mb="20px">
					<Stack
						flexDirection={{
							xs: 'column',
							sm: 'row',
						}}>
						<Stack
							flexDirection="row"
							marginRight={{
								xs: '0',
								sm: '36px',
							}}>
							<Typography color="grey.300" fontSize={15}>
								신청번호 :&nbsp;
							</Typography>
							<Typography fontSize={15}>
								{guaranteeData.nft_req_num}
							</Typography>
						</Stack>
						<Stack flexDirection="row">
							<Typography color="grey.300" fontSize={15}>
								신청일 :&nbsp;
							</Typography>
							<Typography fontSize={15}>
								{guaranteeData.nft_req_dt
									? guaranteeData.nft_req_dt.substr(0, 10)
									: '-'}
							</Typography>
						</Stack>
					</Stack>
					{getGuaranteeStatusChip(
						guaranteeData.nft_req_state,
						guaranteeData.nft_req_state_text
					)}
				</Stack>
				<GuaranteeDetailCustomerInfo data={guaranteeData} />
				<GuaranteeDetailProductInfo data={guaranteeData} />
				<GuaranteeDetailSellerInfo data={guaranteeData} />
				<GuaranteeDetailInfo data={guaranteeData} />
			</Stack>
			<GuaranteeDetailPreviewCard data={data} />
		</Stack>
	);
}

export default GuaranteeDetail;
