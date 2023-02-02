import {Suspense} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {parse, stringify} from 'qs';

import {Typography, Stack} from '@mui/material';

import {useChildModalOpen, useTabQueryParam} from '@/utils/hooks';

import {Button, ContentWrapper, Tab} from '@/components';
import PaymentCardTab from './PaymentCard/PaymentCardTab';
import PaymentReceiptTab from './PaymentReceipt/PaymentReceiptTab';
import AddPaymentCardModal from '../common/AddPaymentCardModal';

function PaymentInformation() {
	const location = useLocation();
	const navigate = useNavigate();
	const {selectedValue, handleChangeTab} = useTabQueryParam({
		key: 'mode',
		defaultValue: 'card',
	});
	const {open, onOpen, onClose} = useChildModalOpen({});
	return (
		<>
			<ContentWrapper fullWidth={true}>
				<Typography variant="header1">결제 정보 관리</Typography>
				<Tab
					tabLabel="subscribe"
					selected={selectedValue}
					options={[
						{label: '카드', value: 'card'},
						{label: '영수증', value: 'receipt'},
					]}
					handleChange={(e, value) => {
						handleChangeTab(value as string);
						const {pathname, search} = location;
						const {idx, ...parsed} = parse(search);
						if (idx) {
							navigate(
								`${pathname}${stringify(parsed, {
									addQueryPrefix: true,
								})}`,
								{
									replace: true,
								}
							);
						}
					}}
					sx={{
						marginTop: '16px !important',
					}}>
					{selectedValue === 'card' && (
						<Button height={32} onClick={onOpen}>
							결제 카드 추가
						</Button>
					)}
				</Tab>
				<Stack>
					{selectedValue === 'card' && (
						<Suspense>
							<PaymentCardTab />
						</Suspense>
					)}
					{selectedValue === 'receipt' && <PaymentReceiptTab />}
				</Stack>
			</ContentWrapper>
			<AddPaymentCardModal open={open} onClose={onClose} />
		</>
	);
}

export default PaymentInformation;
