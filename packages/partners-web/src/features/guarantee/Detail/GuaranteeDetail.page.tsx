import {useEffect, useMemo, useState} from 'react';
import {useParams} from 'react-router-dom';

import {Stack, Typography} from '@mui/material';

import {GuaranteeDetail} from '@/@types';
import {getGuaranteeDetail} from '@/api/guarantee-v1.api';
import {getGuaranteeStatusChip, PAGE_MAX_WIDTH} from '@/data';
import {usePageView} from '@/utils';

import GuaranteeDetailCustomerInfo from '@/features/guarantee/common/GuaranteeDetailCustomerInfo';
import GuaranteeDetailProductInfo from '@/features/guarantee/common/GuaranteeDetailProductInfo';
import GuaranteeDetailSellerInfo from '@/features/guarantee/common/GuaranteeDetailSellerInfo';
import GuaranteeDetailInfo from '@/features/guarantee/common/GuaranteeDetailInfo';
import GuaranteeDetailPreviewCard from '@/features/guarantee/Detail/GuaranteeDetailPreviewCard';
import {TitleTypography} from '@/components';

function GuaranteeDetail() {
	usePageView('guarantee_detail_pv', '개런티 상세페이지 노출');
	const params = useParams();
	const idx = params?.idx;

	const [data, setData] = useState<GuaranteeDetail | null>(null);

	useEffect(() => {
		(async () => {
			if (!idx) {
				return;
			}
			const res = await getGuaranteeDetail(Number(idx));
			setData(res);
		})();
	}, [idx]);

	if (!data) return null;

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
				<TitleTypography title="개런티 상세" />
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
							<Typography color="grey.300" variant="body2">
								신청번호 :&nbsp;
							</Typography>
							<Typography variant="body2">
								{data.nftNumber}
							</Typography>
						</Stack>
						<Stack flexDirection="row">
							<Typography color="grey.300" variant="body2">
								신청일 :&nbsp;
							</Typography>
							<Typography variant="body2">
								{data.registeredAt
									? data.registeredAt.substr(0, 10)
									: '-'}
							</Typography>
						</Stack>
					</Stack>
					{getGuaranteeStatusChip(data.nftStatusCode, data.nftStatus)}
				</Stack>
				<GuaranteeDetailCustomerInfo data={data} />
				<GuaranteeDetailProductInfo data={data} />
				<GuaranteeDetailSellerInfo data={data} />
				<GuaranteeDetailInfo data={data} />
			</Stack>
			<GuaranteeDetailPreviewCard data={data} />
		</Stack>
	);
}

export default GuaranteeDetail;
