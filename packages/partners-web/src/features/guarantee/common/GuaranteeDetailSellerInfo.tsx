import {Box, Stack, Typography} from '@mui/material';

import {GuaranteeDetail} from '@/@types';

import {IcShopPrimary} from '@/assets/icon';
import {textLineChangeHelper} from '@/utils';

function GuaranteeDetailSellerInfo({data}: {data: GuaranteeDetail}) {
	return (
		<Stack
			flexDirection="column"
			padding="32px"
			borderRadius="8px"
			border={(theme) => `1px solid ${theme.palette.grey[100]}`}
			mb="24px">
			<Typography variant="subtitle2" mb="12px">
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
				<Stack
					flexDirection="column"
					justifyContent="center"
					sx={{
						height: '100%',
					}}>
					<Typography fontSize={16} fontWeight={700}>
						{data?.issuerName || '-'}
					</Typography>
					<Typography variant="body3">
						{data?.issuerInfo
							? textLineChangeHelper(
									String(data?.issuerInfo)
							  ).map((line) => (
									<>
										{line}
										<br />
									</>
							  ))
							: '-'}
					</Typography>
				</Stack>
			</Stack>
		</Stack>
	);
}

export default GuaranteeDetailSellerInfo;
