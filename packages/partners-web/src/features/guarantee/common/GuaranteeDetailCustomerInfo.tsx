import {Stack, Typography} from '@mui/material';

import {GuaranteeDetail} from '@/@types';
import {CustomerInfoLabel} from '@/components';
import {formatPhoneNum} from '@/utils';
import DetailInfoColumn from '@/features/common/DetailInfoColumn';

function GuaranteeDetailCustomerInfo({data}: {data: GuaranteeDetail}) {
	return (
		<Stack
			flexDirection="column"
			padding="32px"
			borderRadius="8px"
			border={(theme) => `1px solid ${theme.palette.grey[100]}`}
			mb="24px">
			<Typography variant="subtitle2" mb="12px">
				고객정보
			</Typography>
			<CustomerInfoLabel
				profileImgSize={54}
				isNameLink={true}
				data={{
					name: data?.ordererName ?? '',
					phoneNumber: formatPhoneNum(data?.ordererTel ?? ''),
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
				<DetailInfoColumn
					title="주문일자"
					value={data?.orderedAt ? data?.orderedAt.slice(0, 10) : '-'}
					fontSize={16}
				/>
				<DetailInfoColumn
					title="판매처"
					value={data?.platformName || '-'}
					fontSize={16}
				/>
				<DetailInfoColumn
					title="주문번호"
					value={data?.orderNumber || '-'}
					fontSize={16}
				/>
			</Stack>
		</Stack>
	);
}

export default GuaranteeDetailCustomerInfo;
