import {Stack, Typography} from '@mui/material';

import {GuaranteeDetail} from '@/@types';

import DetailInfoColumn from '@/features/common/DetailInfoColumn';
import {goToParentUrl} from '@/utils';

function RepairGuaranteeDetailInfo({data}: {data: GuaranteeDetail}) {
	const idx = data?.idx;
	return (
		<Stack
			flexDirection="column"
			padding="32px"
			borderRadius="8px"
			border={(theme) => `1px solid ${theme.palette.grey[100]}`}
			mb="24px">
			<Typography variant="subtitle2" mb="12px">
				디지털 개런티 정보
			</Typography>
			<Stack
				flexDirection={{
					xs: 'column',
					md: 'row',
				}}
				columnGap="80px"
				rowGap="20px">
				<DetailInfoColumn
					title="발급일"
					value={data?.issuedAt ? data?.issuedAt.slice(0, 10) : '-'}
				/>
				<DetailInfoColumn
					title="개런티 번호"
					value={data?.nftNumber || '-'}
					isLink={idx ? true : false}
					onClick={() => {
						if (idx) {
							goToParentUrl(`/b2b/guarantee/${idx}`);
						}
					}}
					sx={{
						'& p:nth-of-type(2)': {
							color: 'black',
							width: 'fit-content',
						},
					}}
				/>
			</Stack>
		</Stack>
	);
}

export default RepairGuaranteeDetailInfo;
