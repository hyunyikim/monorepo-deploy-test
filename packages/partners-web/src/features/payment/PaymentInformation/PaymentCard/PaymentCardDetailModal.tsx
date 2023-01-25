import {Stack, Typography} from '@mui/material';

import {Button, Dialog} from '@/components';
import {LogoVisa, LogoVisa2x} from '@/assets/images/payment-network';

interface Props {
	data: any;
	open: boolean;
	onClose: () => void;
}

function PaymentCardDetailModal({data, open, onClose}: Props) {
	return (
		<Dialog
			TitleComponent={
				<Typography variant="subtitle1" fontWeight="bold">
					카드 정보
				</Typography>
			}
			open={open}
			onClose={onClose}
			width={520}
			ActionComponent={
				<Stack
					flexDirection="row"
					justifyContent="flex-end"
					sx={{
						width: '100%',
						gap: '8px',
					}}>
					<Button variant="outlined" color="grey-100" height={40}>
						삭제
					</Button>
					<Button color="black" height={40} onClick={onClose}>
						확인
					</Button>
				</Stack>
			}>
			<Stack flexDirection="row" alignItems="center" pb="30px">
				<img
					src={LogoVisa}
					srcSet={`${LogoVisa} 1x, ${LogoVisa2x} 2x`}
				/>
				<Stack ml="20px">
					<Typography variant="subtitle2" fontWeight="bold">
						Visa **** 1234
					</Typography>
					<Typography variant="body1" color="grey.600">
						**/****
					</Typography>
					<Typography variant="body1" color="grey.600">
						일반 결제(Toss)
					</Typography>
				</Stack>
			</Stack>
		</Dialog>
	);
}

export default PaymentCardDetailModal;
