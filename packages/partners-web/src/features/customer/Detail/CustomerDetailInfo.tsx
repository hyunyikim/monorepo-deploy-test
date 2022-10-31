import {Grid, Stack, Box, Typography} from '@mui/material';

import {Avatar, BreadCrumb} from '@/components';
import {IcWallet, IcWon, IcDoc} from '@/assets/icon';

import style from '@/assets/styles/style.module.scss';
import {useEffect, useState} from 'react';
import {NftCustomerDetail} from '@/@types';
import {getNftCustomerDetail} from '@/api/customer.api';
import {formatPhoneNum, goToParentUrl} from '@/utils';

function CustomerDetailInfo({idx}: {idx: number}) {
	const [data, setData] = useState<NftCustomerDetail | null>(null);

	useEffect(() => {
		(async () => {
			const res = await getNftCustomerDetail(idx);
			setData(res);
		})();
	}, []);

	return (
		<>
			{data && (
				<>
					<BreadCrumb
						before={[{title: '고객관리', href: '/customer'}]}
						current={data?.customerName ?? '-'}
						onClick={() => {
							goToParentUrl('/b2b/customer');
						}}
					/>
					<Stack
						direction={{sm: 'column', md: 'row'}}
						gap={{xs: '12px'}}
						justifyContent="space-between"
						mt="30px">
						<Box
							display="flex"
							flexDirection="row"
							alignItems="center"
							gap="12px">
							<Avatar size={60}>
								{data?.customerName &&
									data?.customerName.slice(0, 1)}
							</Avatar>
							<Box>
								<Typography fontWeight="700" fontSize={21}>
									{data?.customerName}
								</Typography>
								<Typography width="max-content">
									{data?.phone
										? formatPhoneNum(data?.phone)
										: '-'}
								</Typography>
							</Box>
						</Box>
						<Grid container width="fit-content" gap={'12px'}>
							<CustomerInfoBox
								title="지갑 연동 상태"
								value={data?.walletLinked ? '연동' : '미연동'}
								Icon={<IcWallet fill={style.vircleGrey500} />}
							/>
							<CustomerInfoBox
								title="총 주문금액"
								value={`${(
									data?.totalPrice ?? 0
								).toLocaleString()}원`}
								Icon={<IcWon fill={style.vircleGrey500} />}
							/>
							<CustomerInfoBox
								title="총 발급완료건수"
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

const CustomerInfoBox = ({
	title,
	value,
	Icon,
}: {
	title: string;
	value: string;
	Icon: React.ReactElement;
}) => {
	return (
		<Stack
			flexDirection="row"
			justifyContent="space-between"
			alignItems="center"
			minWidth={250}
			sx={{
				borderWidth: '1px',
				borderStyle: 'solid',
				borderColor: 'grey.100',
				borderRadius: '8px',
				padding: '20px',
			}}>
			<Box>
				<Typography color="grey.500" fontSize={13} pb={0.5}>
					{title}
				</Typography>
				<Typography fontSize={18} fontWeight={700}>
					{value}
				</Typography>
			</Box>
			<Box
				sx={{
					width: '48px',
					height: '48px',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					borderRadius: '50%',
					backgroundColor: 'grey.50',
				}}>
				{Icon}
			</Box>
		</Stack>
	);
};

export default CustomerDetailInfo;
