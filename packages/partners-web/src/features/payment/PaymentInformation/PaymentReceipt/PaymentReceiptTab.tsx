import {Suspense, useMemo} from 'react';
import {useLocation} from 'react-router-dom';
import {ErrorBoundary} from 'react-error-boundary';
import {parse} from 'qs';

import {Stack} from '@mui/material';

import PaymentReceiptList from './PaymentReceiptList';
import PaymentReceiptDetail from './PaymentReceiptDetail';
import {usePageView} from '@/utils';

function PaymentReceiptTab() {
	usePageView('payment_reciept_pv', '');
	const {search} = useLocation();

	const idx = useMemo(() => {
		return parse(search, {
			ignoreQueryPrefix: true,
		})?.idx;
	}, [search]);

	return (
		<Stack flexDirection="column">
			{idx ? (
				<ErrorBoundary FallbackComponent={Fallback}>
					<Suspense>
						<PaymentReceiptDetail idx={idx as string} />
					</Suspense>
				</ErrorBoundary>
			) : (
				<PaymentReceiptList />
			)}
		</Stack>
	);
}

const Fallback = () => <></>;

export default PaymentReceiptTab;
