import {useNavigate} from 'react-router-dom';
import {format} from 'date-fns';

import {Stack, Grid, Typography, Divider} from '@mui/material';

import style from '@/assets/styles/style.module.scss';

import {IcPrinter, IcVircleLogo} from '@/assets/icon';
import Breadcrumbs from '@/features/payment/common/Breadcrumbs';
import {PaymentHistoryDetail} from '@/@types';
import {useGetPartnershipInfo, useGetUserPaymentHistoryDetail} from '@/stores';
import {DATE_FORMAT} from '@/data';

interface Props {
	idx: string;
}

function PaymentReceiptDetail({idx}: Props) {
	const navigate = useNavigate();

	const {data} = useGetUserPaymentHistoryDetail(idx, {suspense: true});
	const paymentHistory = data as PaymentHistoryDetail;
	const {data: partnershipData} = useGetPartnershipInfo();

	return (
		<Stack
			sx={{
				margin: '40px auto',
				maxWidth: '346px',
			}}>
			<Stack flexDirection="row" justifyContent="space-between" mb="20px">
				<Breadcrumbs
					beforeList={[
						{
							name: '영수증',
							onClick: () => {
								navigate(-1);
							},
						},
					]}
					now={paymentHistory.displayOrderId}
				/>
				<Typography
					variant="body3"
					fontWeight="bold"
					color="primary.main"
					className="flex-center cursor-pointer"
					onClick={() => {
						window.print();
					}}>
					<IcPrinter
						width={16}
						height={16}
						color={style.virclePrimary500}
						style={{
							marginRight: '4px',
						}}
					/>
					인쇄
				</Typography>
			</Stack>
			<Stack
				className="flex-center"
				sx={{
					width: '100%',
					maxWidth: '346px',
					minHeight: '116px',
					backgroundColor: 'grey.50',
					border: (theme) => `1px solid ${theme.palette.grey[100]}`,
					borderRadius: '8px',
					color: (theme) => theme.palette.grey[900],
					padding: '20px',
				}}>
				<Stack width="100%" justifyContent="flex-start" mb="20px">
					<IcVircleLogo color={style.vircleGrey800} />
				</Stack>
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
					{partnershipData?.brand?.name && (
						<>
							<Grid item xs={1}>
								<Typography
									variant="body3"
									fontWeight="bold"
									color="grey.600">
									브랜드명
								</Typography>
							</Grid>
							<Grid item xs={2}>
								<Typography variant="body3" color="grey.600">
									{partnershipData?.brand?.name}
								</Typography>
							</Grid>
						</>
					)}
					<Grid item xs={1}>
						<Typography
							variant="body3"
							fontWeight="bold"
							color="grey.600">
							영수증 ID
						</Typography>
					</Grid>
					<Grid item xs={2}>
						<Typography variant="body3" color="grey.600">
							{paymentHistory.displayOrderId}
						</Typography>
					</Grid>
					<Grid item xs={1}>
						<Typography
							variant="body3"
							fontWeight="bold"
							color="grey.600">
							종류
						</Typography>
					</Grid>
					<Grid item xs={2}>
						<Typography variant="body3" color="grey.600">
							구독
						</Typography>
					</Grid>
					<Grid item xs={1}>
						<Typography
							variant="body3"
							fontWeight="bold"
							color="grey.600">
							결제상태
						</Typography>
					</Grid>
					<Grid item xs={2}>
						<Typography variant="body3" color="grey.600">
							{paymentHistory.payStatus === 'DONE'
								? '결제완료'
								: '결제실패'}
						</Typography>
					</Grid>
					<Grid item xs={1}>
						<Typography
							variant="body3"
							fontWeight="bold"
							color="grey.600">
							청구일
						</Typography>
					</Grid>
					<Grid item xs={2}>
						<Typography variant="body3" color="grey.600">
							{format(
								new Date(paymentHistory.payApprovedAt),
								DATE_FORMAT
							)}
						</Typography>
					</Grid>
					<Divider
						sx={{
							width: '100%',
							borderColor: (theme) => theme.palette.grey[100],
							marginY: '14px',
						}}
					/>
					<Grid item xs={1}>
						<Typography
							variant="body3"
							fontWeight="bold"
							color="grey.600">
							항목
						</Typography>
					</Grid>
					<Grid item xs={2} />
					<Grid item xs={2}>
						<Typography
							variant="body3"
							fontWeight="bold"
							color="grey.600">
							유료플랜 - {paymentHistory.pricePlan.planName}
						</Typography>
					</Grid>
					<Grid item xs={1}>
						<Typography
							variant="body3"
							fontWeight="bold"
							color="grey.600">
							₩
							{(
								paymentHistory.pricePlan.displayTotalPrice || 0
							).toLocaleString()}
						</Typography>
					</Grid>
					<Grid item xs={2}>
						<Typography variant="caption2" color="grey.600">
							· 정상가
						</Typography>
					</Grid>
					<Grid item xs={1}>
						<Typography variant="caption2" color="grey.600">
							₩
							{(
								paymentHistory.pricePlan.planTotalPrice || 0
							).toLocaleString()}
						</Typography>
					</Grid>
					{!!paymentHistory?.pricePlan?.discountTotalPrice && (
						<>
							<Grid item xs={2}>
								<Typography variant="caption2" color="grey.600">
									· 할인금액
								</Typography>
							</Grid>
							<Grid item xs={1}>
								<Typography variant="caption2" color="grey.600">
									₩
									{(
										paymentHistory.pricePlan
											.discountTotalPrice || 0
									).toLocaleString()}
								</Typography>
							</Grid>
						</>
					)}
					{paymentHistory?.canceledPricePlan && (
						<>
							<Divider
								sx={{
									width: '100%',
									borderColor: (theme) =>
										theme.palette.grey[100],
									marginY: '14px',
								}}
							/>
							<Grid item xs={2}>
								<Typography
									variant="body3"
									fontWeight="bold"
									color="grey.600">
									유료플랜 -{' '}
									{
										paymentHistory?.canceledPricePlan
											?.planName
									}
								</Typography>
								<Typography
									variant="caption2"
									color="primary.main"
									ml="4px">
									환불
								</Typography>
							</Grid>
							<Grid item xs={1}>
								<Typography
									variant="body3"
									fontWeight="bold"
									color="primary.main">
									₩
									{(
										(paymentHistory.canceledPricePlan
											.canceledPrice || 0) / 1.1
									).toLocaleString()}
								</Typography>
							</Grid>
						</>
					)}
					<Divider
						sx={{
							width: '100%',
							borderColor: (theme) => theme.palette.grey[100],
							marginY: '14px',
						}}
					/>
					<Grid item xs={1}>
						<Typography
							variant="body3"
							fontWeight="bold"
							color="grey.600">
							결제금액
						</Typography>
					</Grid>
					<Grid item xs={2}>
						<Typography
							variant="body3"
							fontWeight="bold"
							color="grey.600">
							₩{(paymentHistory.payPrice || 0).toLocaleString()}
						</Typography>
					</Grid>
					<Grid item xs={2}>
						<Typography variant="caption2" color="grey.600">
							부가세(10%)
						</Typography>
					</Grid>
					<Grid item xs={1}>
						<Typography variant="caption2" color="grey.600">
							₩{(paymentHistory.payVat || 0).toLocaleString()}
						</Typography>
					</Grid>

					<Divider
						sx={{
							width: '100%',
							borderColor: (theme) => theme.palette.grey[100],
							marginY: '14px',
						}}
					/>
					<Grid item xs={1}>
						<Typography
							variant="body3"
							fontWeight="bold"
							color="grey.600">
							총 결제금액
						</Typography>
					</Grid>
					<Grid item xs={2}>
						<Typography
							variant="body3"
							fontWeight="bold"
							color="grey.600">
							₩
							{(
								paymentHistory.payTotalPrice || 0
							).toLocaleString()}
						</Typography>
					</Grid>
				</Grid>
			</Stack>
		</Stack>
	);
}

export default PaymentReceiptDetail;
