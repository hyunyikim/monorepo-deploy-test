import {format} from 'date-fns';
import {useMutation, useQueryClient} from '@tanstack/react-query';

import {Stack, Typography} from '@mui/material';

import {
	useGetUserPricePlan,
	useGlobalLoading,
	useMessageDialog,
} from '@/stores';

import {IcLogin} from '@/assets/icon';
import style from '@/assets/styles/style.module.scss';
import {Button} from '@/components';
import {cancelPricePlan} from '@/api/payment.api';
import {updateUserPricePlanData} from '@/utils';

function CancelSubscribe({}) {
	const queryClient = useQueryClient();
	const onMessageDialogOpen = useMessageDialog((state) => state.onOpen);
	const onMessageDialogClose = useMessageDialog((state) => state.onClose);
	const onOpenError = useMessageDialog((state) => state.onOpenError);
	const setIsLoading = useGlobalLoading((state) => state.setIsLoading);
	const {data: userPlan} = useGetUserPricePlan();

	const nextPlanStartDate = userPlan?.nextPlanStartDate;
	const dialogMessage =
		nextPlanStartDate &&
		`지금 구독 취소하시면 yyyy년 MM월 dd일까지 이용 가능하고, 그 이후부터 서비스 이용이 일부 제한됩니다. 계속 하시겠어요?`
			.replace(/yyyy/g, format(nextPlanStartDate, 'yyyy'))
			.replace(/MM/g, format(nextPlanStartDate, 'M'))
			.replace(/dd/g, format(nextPlanStartDate, 'd'));

	const cancelPayment = useMutation({
		onMutate: () => {
			setIsLoading(true);
		},
		mutationFn: cancelPricePlan,
		onSuccess: async () => {
			updateUserPricePlanData();
			await queryClient.invalidateQueries({
				queryKey: ['userPricePlan'],
			});
			onMessageDialogOpen({
				title: '구독 플랜이 취소됐습니다.',
				showBottomCloseButton: true,
				closeButtonValue: '확인',
				onCloseFunc: onMessageDialogClose,
			});
		},
		onError: (e) => {
			onOpenError();
		},
		onSettled: () => {
			setIsLoading(false);
		},
	});

	const onClickCancel = async () => {
		await cancelPayment.mutateAsync();
	};

	if (!nextPlanStartDate) {
		return <></>;
	}
	return (
		<Stack
			flexDirection="row"
			className="cursor-pointer"
			onClick={() => {
				onMessageDialogOpen({
					title: '정말 구독을 취소하시겠어요?',
					message: dialogMessage,
					showBottomCloseButton: true,
					closeButtonValue: '취소',
					buttons: (
						<Button
							height={40}
							variant="contained"
							color="black"
							onClick={onClickCancel}>
							확인
						</Button>
					),
				});
			}}>
			<Typography
				variant="caption3"
				fontWeight="bold"
				color="grey.600"
				ml="16px"
				mr="2px">
				구독취소
			</Typography>
			<IcLogin color={style.vircleGrey300} />
		</Stack>
	);
}

export default CancelSubscribe;
