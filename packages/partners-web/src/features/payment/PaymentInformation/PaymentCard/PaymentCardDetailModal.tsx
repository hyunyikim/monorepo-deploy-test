import {Box, Stack, Typography} from '@mui/material';

import {Button, Dialog} from '@/components';
import {Card, UserPricePlanWithDate} from '@/@types';
import {IcAtm} from '@/assets/icon';
import style from '@/assets/styles/style.module.scss';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {deleteCard} from '@/api/payment.api';
import {useGlobalLoading, useMessageDialog} from '@/stores';
import {updateUserPricePlanData} from '@/utils';

interface Props {
	data: UserPricePlanWithDate;
	open: boolean;
	onClose: () => void;
}

function PaymentCardDetailModal({data, open, onClose}: Props) {
	const card = data.card;
	const {cardType, ownerType, number, company, companyCode} = card as Card;
	const setIsLoading = useGlobalLoading((state) => state.setIsLoading);
	const onMessageDialogOpen = useMessageDialog((state) => state.onOpen);
	const onOpenError = useMessageDialog((state) => state.onOpenError);
	const queryClient = useQueryClient();

	const deleteCardMutation = useMutation({
		onMutate: () => setIsLoading(true),
		mutationFn: deleteCard,
		onSuccess: () => {
			updateUserPricePlanData();
			queryClient.invalidateQueries({
				queryKey: ['userPricePlan'],
			});
			onMessageDialogOpen({
				title: '결제 카드가 삭제됐습니다.',
				showBottomCloseButton: true,
				closeButtonValue: '확인',
			});
		},
		onError: onOpenError,
		onSettled: () => setIsLoading(false),
	});

	const onDeleteCard = async () => {
		const customerKey = data?.customerKey;
		if (!customerKey) return;
		await deleteCardMutation.mutateAsync(customerKey);
	};

	return (
		<Dialog
			TitleComponent={
				<Typography
					component={'span'}
					variant="subtitle1"
					fontWeight="bold">
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
					<Button
						variant="outlined"
						color="grey-100"
						height={40}
						onClick={onDeleteCard}>
						삭제
					</Button>
					<Button color="black" height={40} onClick={onClose}>
						확인
					</Button>
				</Stack>
			}>
			<Stack flexDirection="row" alignItems="center" pb="30px">
				<Box
					className="flex-center"
					sx={{
						width: '94px',
						height: '94px',
						borderRadius: '50%',
						border: (theme) =>
							`1px solid ${theme.palette.grey[100]}`,
					}}>
					<IcAtm width={40} height={40} color={style.vircleBlue500} />
				</Box>
				<Stack ml="20px">
					<Typography variant="subtitle2" fontWeight="bold">
						{number}
					</Typography>
					<Typography variant="body1" color="grey.600">
						{company}
					</Typography>
					<Typography variant="body1" color="grey.600">
						{cardType}카드({ownerType})
					</Typography>
				</Stack>
			</Stack>
		</Dialog>
	);
}

export default PaymentCardDetailModal;
