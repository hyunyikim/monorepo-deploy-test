import {Stack, Typography} from '@mui/material';

import {Guarantee} from '@/@types';
import {CustomerInfoLabel} from '@/components';
import {formatPhoneNum} from '@/utils';
import GuaranteeDetailInfoColumn from '@/features/guarantee/Detail/GuaranteeDetailInfoColumn';

function GuaranteeDetailCustomerInfo({data}: {data: Guarantee}) {
	return (
		<Stack
			flexDirection="column"
			padding="32px"
			borderRadius="8px"
			border={(theme) => `1px solid ${theme.palette.grey[100]}`}
			mb="24px">
			<Typography fontSize={18} fontWeight="bold" mb="24px">
				고객정보
			</Typography>
			<CustomerInfoLabel
				profileImgSize={54}
				isNameLink={true}
				data={{
					name: data?.orderer_nm ?? '',
					phoneNumber: formatPhoneNum(data?.orderer_tel ?? ''),
				}}
			/>
			<Stack
				mt="24px"
				flexDirection={{
					xs: 'column',
					md: 'row',
				}}
				justifyContent={{
					xs: 'flex-start',
					md: 'space-between',
				}}
				rowGap="20px"
				columnGap="16px"
				sx={{
					'& > *': {
						flex: 1,
					},
				}}>
				<GuaranteeDetailInfoColumn
					title="주문일자"
					value={data?.order_dt || '-'}
					fontSize={16}
				/>
				<GuaranteeDetailInfoColumn
					title="판매처"
					value={data?.order_platform_nm || '-'}
					fontSize={16}
				/>
				<GuaranteeDetailInfoColumn
					title="주문번호"
					value={data?.order_num || '-'}
					fontSize={16}
				/>
			</Stack>
		</Stack>
	);
}

export default GuaranteeDetailCustomerInfo;
