import {Suspense} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {parse, stringify} from 'qs';

import {Typography, Stack} from '@mui/material';

import {useChildModalOpen, useTabQueryParam} from '@/utils/hooks';

import {Button, ContentWrapper, Tab} from '@/components';
import PaymentCardTab from './PaymentCard/PaymentCardTab';
import PaymentReceiptTab from './PaymentReceipt/PaymentReceiptTab';
import AddPaymentCardModal from '../common/AddPaymentCardModal';
import {useGetUserPricePlan, useMessageDialog} from '@/stores';

function PaymentInformation() {
	const location = useLocation();
	const navigate = useNavigate();
	const {selectedValue, handleChangeTab} = useTabQueryParam({
		key: 'mode',
		defaultValue: 'card',
	});
	const onMessageDialogOpen = useMessageDialog((state) => state.onOpen);
	const {open, onOpen, onClose} = useChildModalOpen({});

	const {data: userPlan} = useGetUserPricePlan();

	const onOpenAddCardModal = () => {
		if (userPlan?.card) {
			onMessageDialogOpen({
				title: '결제 카드는 1개만 등록이 가능합니다.',
				message: '등록된 카드를 삭제하고 다시 등록해주세요.',
				showBottomCloseButton: true,
				closeButtonValue: '확인',
			});
			return;
		}
		onOpen();
	};

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
						<Button height={32} onClick={onOpenAddCardModal}>
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
			{open && <AddPaymentCardModal open={open} onClose={onClose} />}
		</>
	);
}

export default PaymentInformation;
