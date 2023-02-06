import {Stack, Typography, TableRow, Box} from '@mui/material';

import {useChildModalOpen} from '@/utils/hooks';

import {IcAtm} from '@/assets/icon';
import {Table, HeadTableCell, TableCell, Chip} from '@/components';
import PaymentCardDetailModal from './PaymentCardDetailModal';
import {useGetUserPricePlan} from '@/stores';

const totalSize = 10;
const isLoading = false;

function PaymentCardTab() {
	const {open, onOpen, onClose} = useChildModalOpen({});
	const {data: userPlan} = useGetUserPricePlan();
	const card = userPlan?.card;

	return (
		<>
			<Stack mt="40px">
				<Stack
					flexDirection="row"
					justifyContent="space-between"
					mb="16px">
					<Typography
						variant="subtitle2"
						fontWeight="bold"
						display="flex"
						alignItems="center">
						<IcAtm
							width={24}
							height={24}
							style={{
								marginRight: '6px',
							}}
						/>
						카드
					</Typography>
				</Stack>
				<Typography variant="body3" color="grey.500" mb="20px">
					유료 플랜 결제를 위해서 1개 이상의 카드가 필요합니다.
				</Typography>
				<Stack>
					<Table
						isLoading={isLoading}
						totalSize={totalSize}
						headcell={
							<>
								<HeadTableCell width={240}>카드</HeadTableCell>
								<HeadTableCell minWidth={300}>
									결제사
								</HeadTableCell>
								<HeadTableCell width={180}>기타</HeadTableCell>
								<HeadTableCell width={180}>
									결제 상태
								</HeadTableCell>
							</>
						}>
						{card ? (
							<TableRow>
								<TableCell>
									<Box
										className="flex-center"
										sx={{
											width: '32px',
											height: '32px',
											borderRadius: '50%',
											border: (theme) =>
												`0.35px solid ${theme.palette.grey[100]}`,
										}}>
										<IcAtm width={20} height={20} />
									</Box>
									<Typography
										className="underline"
										onClick={onOpen}
										ml="12px">
										{card.number}
									</Typography>
								</TableCell>
								<TableCell>{card.company}</TableCell>
								<TableCell>-</TableCell>
								<TableCell>
									<Chip
										color="green"
										label="기본 결제 카드"
									/>
								</TableCell>
							</TableRow>
						) : (
							<TableRow>
								<TableCell align="center" colSpan={20}>
									등록된 카드가 존재하지 않습니다.
								</TableCell>
							</TableRow>
						)}
					</Table>
				</Stack>
			</Stack>
			{userPlan?.card && (
				<PaymentCardDetailModal
					data={userPlan}
					open={open}
					onClose={onClose}
				/>
			)}
		</>
	);
}

export default PaymentCardTab;
