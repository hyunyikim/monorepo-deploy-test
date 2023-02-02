import {useMemo} from 'react';
import {parse} from 'qs';
import {useLocation} from 'react-router-dom';

import {Stack} from '@mui/material';

import PaymentReceiptList from './PaymentReceiptList';
import PaymentReceiptDetail from './PaymentReceiptDetail';

function PaymentReceiptTab() {
	const {search} = useLocation();

	const idx = useMemo(() => {
		return parse(search, {
			ignoreQueryPrefix: true,
		})?.idx;
	}, [search]);

	return (
		<Stack flexDirection="column">
			{idx ? (
				<PaymentReceiptDetail idx={Number(idx)} />
			) : (
				<PaymentReceiptList />
			)}
		</Stack>
	);
}

export default PaymentReceiptTab;
