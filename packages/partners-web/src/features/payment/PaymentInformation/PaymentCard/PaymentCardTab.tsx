import {Stack, Typography, TableRow} from '@mui/material';

import {useChildModalOpen} from '@/utils/hooks';

import {IcAtm} from '@/assets/icon';
import {
	LabeledSwitch,
	Table,
	HeadTableCell,
	TableCell,
	Chip,
} from '@/components';
import PaymentCardDetailModal from './PaymentCardDetailModal';
import {LogoVisa, LogoVisa2x} from '@/assets/images/payment-network';

const totalSize = 10;
const isLoading = false;

function PaymentCardTab() {
	const {open, onOpen, onClose} = useChildModalOpen({});
	return (
		<>
			<Stack mt="40px">
				<Stack flexDirection="row" justifyContent="space-between">
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
					<Stack
						flexDirection="row"
						alignItems="center"
						sx={{
							borderRadius: '41px',
							border: (theme) =>
								`1px solid ${theme.palette.grey[100]}`,
							padding: '11px 20px',
						}}>
						<Typography
							variant="caption1"
							fontWeight="bold"
							mr="8px">
							자동결제
						</Typography>
						<LabeledSwitch
							checked={true}
							options={[
								{label: 'ON', value: true},
								{label: 'OFF', value: false},
							]}
						/>
					</Stack>
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
								<HeadTableCell minWidth={240}>
									카드
								</HeadTableCell>
								<HeadTableCell minWidth={180}>
									유효기간
								</HeadTableCell>
								<HeadTableCell minWidth={500}>
									결제사
								</HeadTableCell>
								<HeadTableCell minWidth={180}>
									기타
								</HeadTableCell>
								<HeadTableCell minWidth={180}>
									결제 상태
								</HeadTableCell>
							</>
						}>
						<TableRow>
							<TableCell>
								<img
									src={LogoVisa}
									srcSet={`${LogoVisa} 1x, ${LogoVisa2x} 2x`}
									width={32}
								/>
								<Typography
									className="underline"
									onClick={onOpen}
									ml="12px">
									test
								</Typography>
							</TableCell>
							<TableCell>test</TableCell>
							<TableCell>test</TableCell>
							<TableCell>test</TableCell>
							<TableCell>
								<Chip color="green" label="기본 결제 카드" />
							</TableCell>
						</TableRow>
					</Table>
				</Stack>
			</Stack>
			<PaymentCardDetailModal data={{}} open={open} onClose={onClose} />
		</>
	);
}

export default PaymentCardTab;
