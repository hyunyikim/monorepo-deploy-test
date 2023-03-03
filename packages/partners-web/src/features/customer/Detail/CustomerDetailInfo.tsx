import {Grid, Stack} from '@mui/material';

import {CustomerInfoLabel, Breadcrumbs, DetailInfoCard} from '@/components';
import {IcWallet, IcWon, IcDoc} from '@/assets/icon';

import style from '@/assets/styles/style.module.scss';
import {useEffect, useState} from 'react';
import {NftCustomerDetail} from '@/@types';
import {getNftCustomerDetail} from '@/api/customer.api';

function CustomerDetailInfo({name, phone}: {name: string; phone: string}) {
	const [data, setData] = useState<NftCustomerDetail | null>(null);

	useEffect(() => {
		(async () => {
			const res = await getNftCustomerDetail(name, phone);
			setData(res);
		})();
	}, []);

	return (
		<>
			{data && (
				<>
					<Breadcrumbs
						before={[{title: '고객관리', href: '/b2b/customer'}]}
						current={data?.customerName ?? '-'}
					/>
					<Stack
						direction={{sm: 'column', md: 'row'}}
						gap={{xs: '12px'}}
						justifyContent="space-between"
						mt="20px">
						<CustomerInfoLabel
							profileImgSize={60}
							data={{
								name: data?.customerName ?? '',
								phoneNumber: data?.phone ?? '',
							}}
						/>
						<Grid container width="fit-content" gap={'12px'}>
							<DetailInfoCard
								title="지갑 연동 상태"
								value={
									data?.walletLinked ? '연동완료' : '미연동'
								}
								Icon={<IcWallet fill={style.vircleGrey500} />}
							/>
							<DetailInfoCard
								title="결제금액"
								value={`${(
									data?.totalPrice ?? 0
								).toLocaleString()}원`}
								Icon={<IcWon fill={style.vircleGrey500} />}
							/>
							<DetailInfoCard
								title="구매수량"
								value={`${(
									data?.amount ?? 0
								).toLocaleString()}개`}
								Icon={<IcDoc stroke={style.vircleGrey500} />}
							/>
						</Grid>
					</Stack>
				</>
			)}
		</>
	);
}

export default CustomerDetailInfo;
