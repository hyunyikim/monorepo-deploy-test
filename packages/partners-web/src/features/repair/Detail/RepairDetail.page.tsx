import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

import {Stack, Typography} from '@mui/material';

import {RepairDetail} from '@/@types';
import {getRepairDetail} from '@/api/repair.api';
import {getRepairStatusChip, PAGE_MAX_WIDTH} from '@/data';
import {usePageView} from '@/utils';

import RepairDetailInfo from '@/features/repair/Detail/RepairDetailInfo';
import RepairDetailControl from '@/features/repair/Detail/RepairDetailControl';
import RepairGuaranteeDetailInfo from '@/features/repair/Detail/RepairGuaranteeDetailInfo';
import GuaranteeDetailCustomerInfo from '@/features/guarantee/common/GuaranteeDetailCustomerInfo';
import GuaranteeDetailProductInfo from '@/features/guarantee/common/GuaranteeDetailProductInfo';
import {TitleTypography} from '@/components';

function RepairDetail() {
	usePageView('repair_detail_pv', '수선신청 상세 진입');
	const params = useParams();
	const idx = params?.idx;

	const [data, setData] = useState<RepairDetail | null>(null);

	useEffect(() => {
		(async () => {
			if (!idx) {
				return;
			}
			const res = await getRepairDetail(Number(idx));
			setData(res);
		})();
	}, [idx]);

	const status = data?.repairStatusCode;

	if (!data) return null;

	return (
		<Stack flexDirection="column" m="auto" maxWidth={PAGE_MAX_WIDTH}>
			<TitleTypography title="수선신청 상세" />
			<Stack flexDirection="row" justifyContent="space-between" mb="20px">
				<Stack
					flexDirection={{
						xs: 'column',
						sm: 'row',
					}}
					columnGap="20px">
					<Stack flexDirection="row">
						<Typography color="grey.300" variant="body2">
							신청번호 :&nbsp;
						</Typography>
						<Typography variant="body2">
							{data.repairNum}
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
					{status === 'complete' && (
						<Stack flexDirection="row">
							<Typography color="grey.300" variant="body2">
								완료일 :&nbsp;
							</Typography>
							<Typography variant="body2">
								{data?.completedAt
									? data.completedAt.substr(0, 10)
									: '-'}
							</Typography>
						</Stack>
					)}
					{status === 'cancel' && (
						<Stack flexDirection="row">
							<Typography color="grey.300" variant="body2">
								취소일 :&nbsp;
							</Typography>
							<Typography variant="body2">
								{data?.canceledAt
									? data.canceledAt.substr(0, 10)
									: '-'}
							</Typography>
						</Stack>
					)}
				</Stack>
				{getRepairStatusChip(data.repairStatusCode)}
			</Stack>
			<RepairDetailInfo data={data} />
			<GuaranteeDetailCustomerInfo data={data.nft} />
			<GuaranteeDetailProductInfo data={data.nft} />
			<RepairGuaranteeDetailInfo data={data.nft} />
			{status && ['ready', 'request'].includes(status) && (
				<RepairDetailControl idx={data.idx} />
			)}
		</Stack>
	);
}

export default RepairDetail;
