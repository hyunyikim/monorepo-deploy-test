import {Divider, Grid, Stack, Theme, Typography} from '@mui/material';
import {SxProps, SystemStyleObject} from '@mui/system';

import {
	TotalSbuscribeInfoPreviewData,
	SbuscribeInfoPreviewData,
} from '@/@types';

interface Props {
	data: TotalSbuscribeInfoPreviewData;
	sx?: SxProps;
}

const previewStyle: SystemStyleObject<Theme> = {
	width: '100%',
	minHeight: '116px',
	backgroundColor: 'grey.50',
	border: (theme) => `1px solid ${theme.palette.grey[100]}`,
	borderRadius: '8px',
	color: (theme) => theme.palette.grey[900],
	padding: '20px',
};

function SubscribeInfoPreview({data, sx = []}: Props) {
	return (
		<Stack
			className="flex-center"
			flexDirection="column"
			gap="12px"
			sx={[...(Array.isArray(sx) ? sx : [sx])]}>
			<SubscribeInfoPreviewItem subscribeType="new" data={data?.data} />
			{data?.canceledData && (
				<SubscribeInfoPreviewItem
					subscribeType="cancel"
					data={data.canceledData}
				/>
			)}
			{data?.totalPaidPrice && (
				<TotalPrice totalPaidPrice={data?.totalPaidPrice || 0} />
			)}
		</Stack>
	);
}

const SubscribeInfoPreviewItem = ({
	subscribeType,
	data,
}: {
	subscribeType: 'new' | 'cancel';
	data: SbuscribeInfoPreviewData;
}) => {
	return (
		<Stack className="flex-center" sx={[previewStyle]}>
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
						{subscribeType === 'new' ? '새로운 구독' : '구독취소'}
					</Typography>
				</Grid>
				<Grid item xs={2}>
					<Typography variant="caption1" color="grey.500">
						{data?.subscribeDuration}
					</Typography>
				</Grid>
				<Grid item xs={1}>
					<Typography
						variant="caption1"
						fontWeight="bold"
						color="grey.600">
						{data?.planName}
					</Typography>
				</Grid>
				<Grid item xs={2}>
					<Typography variant="body3" fontWeight="bold" fontSize={14}>
						₩{(data?.displayTotalPrice || 0).toLocaleString()}
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
						₩{(data?.planTotalPrice || 0).toLocaleString()}
					</Typography>
				</Grid>
				{!!data?.discountTotalPrice && (
					<>
						<Grid item xs={1}>
							<Typography
								variant="caption1"
								color="grey.600"
								className="list-dot">
								할인금액
							</Typography>
						</Grid>
						<Grid item xs={2}>
							<Typography
								fontSize={13}
								fontWeight={400}
								color="grey.600">
								₩
								{(
									data?.discountTotalPrice || 0
								).toLocaleString()}
							</Typography>
						</Grid>
					</>
				)}
				<Grid item xs={1}>
					<Typography
						variant="caption1"
						color="grey.600"
						className="list-dot">
						구독료
					</Typography>
				</Grid>
				<Grid item xs={2}>
					<Typography fontSize={13} fontWeight={400} color="grey.600">
						₩{(data?.totalPrice || 0).toLocaleString()}
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
						₩{(data?.totalPrice || 0).toLocaleString()}
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
						{data?.payApprovedAt}
					</Typography>
				</Grid>
			</Grid>
		</Stack>
	);
};

const TotalPrice = ({totalPaidPrice}: {totalPaidPrice: number}) => {
	return (
		<Stack
			flexDirection="row"
			justifyContent="space-between"
			sx={[
				previewStyle,
				{
					minHeight: '56px',
				},
			]}>
			<Stack flexDirection="row" alignItems="center">
				<Typography variant="body3" fontWeight="bold" mr="5px">
					총 결제 금액
				</Typography>
				<Typography variant="body3" fontWeight="400">
					Ⓑ - Ⓐ
				</Typography>
			</Stack>
			<Typography variant="body3" fontWeight="bold" color="primary.main">
				₩{(totalPaidPrice || 0).toLocaleString()}
			</Typography>
		</Stack>
	);
};

export default SubscribeInfoPreview;
