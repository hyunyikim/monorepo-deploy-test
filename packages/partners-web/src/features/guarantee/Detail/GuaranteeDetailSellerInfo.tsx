import {Box, Stack, Typography} from '@mui/material';

import {Guarantee} from '@/@types';

import {IcShopPrimary} from '@/assets/icon';

function GuaranteeDetailSellerInfo({data}: {data: Guarantee}) {
	return (
		<Stack
			flexDirection="column"
			padding="32px"
			borderRadius="8px"
			border={(theme) => `1px solid ${theme.palette.grey[100]}`}
			mb="24px">
			<Typography fontSize={18} fontWeight="bold" mb="24px">
				판매자 정보
			</Typography>
			<Stack
				flexDirection={{
					xs: 'column',
					sm: 'row',
				}}
				alignItems="flex-start">
				<Box
					className="flex-center"
					sx={{
						width: '54px',
						minWidth: '54px',
						height: '54px',
						borderRadius: '20px',
						backgroundColor: 'primary.50',
						marginRight: '12px',
						marginBottom: {
							xs: '12px',
							sm: 0,
						},
					}}>
					<IcShopPrimary />
				</Box>
				<Stack flexDirection="column">
					<Typography fontSize={16} fontWeight={700}>
						{data?.brand_nm || '-'}
					</Typography>
					<Typography fontSize={14}>
						{data?.seller_auth_info ||
							data?.parent_seller_auth_info ||
							'-'}
					</Typography>
				</Stack>
			</Stack>
		</Stack>
	);
}

export default GuaranteeDetailSellerInfo;
