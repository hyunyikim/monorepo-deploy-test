import {Divider, Grid, Stack, Typography} from '@mui/material';
import {SxProps} from '@mui/system';

import {PricePlan} from '@/@types';

interface Props {
	selectedPlan: PricePlan;
	sx?: SxProps;
}

// TODO: 선택된 플랜 마다 변경 되도록 수정
function SubscribeInfoPreview({selectedPlan, sx = []}: Props) {
	return (
		<Stack
			className="flex-center"
			sx={[
				{
					width: '100%',
					maxWidth: '346px',
					minHeight: '116px',
					backgroundColor: 'grey.50',
					border: (theme) => `1px solid ${theme.palette.grey[100]}`,
					borderRadius: '8px',
					color: (theme) => theme.palette.grey[900],
					padding: '20px',
				},
				...(Array.isArray(sx) ? sx : [sx]),
			]}>
			<Grid
				container
				columns={3}
				justifyContent="space-between"
				rowGap="8px"
				sx={{
					'& .MuiGrid-root': {
						display: 'flex',
						alignItems: 'center',
					},
					'& .MuiGrid-root:nth-of-type(2n)': {
						justifyContent: 'flex-end',
					},
				}}>
				<Grid item xs={1}>
					<Typography variant="body3" fontWeight="bold">
						새로운 구독
					</Typography>
				</Grid>
				<Grid item xs={2}>
					<Typography variant="caption1" color="grey.500">
						2022.12.19 - 2023.12.19
					</Typography>
				</Grid>
				<Grid item xs={1}>
					<Typography
						variant="caption1"
						fontWeight="bold"
						color="grey.600">
						엑스스몰
					</Typography>
				</Grid>
				<Grid item xs={2}>
					<Typography variant="body3" fontWeight="bold" fontSize={14}>
						₩480,000
					</Typography>
				</Grid>
				<Grid item xs={1}>
					<Typography
						variant="caption1"
						color="grey.600"
						className="list-dot">
						정상가
					</Typography>
				</Grid>
				<Grid item xs={2}>
					<Typography fontSize={13} fontWeight={400} color="grey.600">
						₩480,000
					</Typography>
				</Grid>
				<Grid item xs={1}>
					<Typography
						variant="caption1"
						color="grey.600"
						className="list-dot">
						정상가
					</Typography>
				</Grid>
				<Grid item xs={2}>
					<Typography fontSize={13} fontWeight={400} color="grey.600">
						₩480,000
					</Typography>
				</Grid>
				<Divider
					sx={{
						width: '100%',
						borderColor: (theme) => theme.palette.grey[100],
						marginTop: '6px',
						marginBottom: '12px',
					}}
				/>
				<Grid item xs={1}>
					<Typography
						variant="body3"
						fontWeight="bold"
						color="grey.600">
						합계
					</Typography>
				</Grid>
				<Grid item xs={2}>
					<Typography variant="body3" fontWeight="bold">
						₩480,000
					</Typography>
				</Grid>
				<Grid item xs={1}>
					<Typography
						variant="body3"
						fontWeight="bold"
						color="grey.600">
						결제일
					</Typography>
				</Grid>
				<Grid item xs={2}>
					<Typography variant="body3" fontWeight="bold">
						2022.12.19
					</Typography>
				</Grid>
			</Grid>
		</Stack>
	);
}

export default SubscribeInfoPreview;
