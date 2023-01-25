import {Stack, Typography} from '@mui/material';
import {parse, format} from 'date-fns';

import {DATE_FORMAT} from '@/data';
import {useGetUserPricePlan, useMessageDialog} from '@/stores';

import {IcLogin} from '@/assets/icon';
import style from '@/assets/styles/style.module.scss';
import {Button} from '@/components';

function CancelSubscribe({}) {
	const onMessageDialogOpen = useMessageDialog((state) => state.onOpen);
	const onMessageDialogClose = useMessageDialog((state) => state.onClose);
	const {data: userPlan} = useGetUserPricePlan();

	const expireDate =
		userPlan?.payPlanExpireDate &&
		parse(userPlan?.payPlanExpireDate, DATE_FORMAT, new Date());
	const dialogMessage =
		expireDate &&
		`지금 구독 취소하시면 yyyy년 MM월 dd일까지 이용 가능하고, 그 이후부터 개런티 발급이 제한됩니다. 계속 하시겠어요?`
			.replace(/yyyy/g, format(expireDate, 'yyyy'))
			.replace(/MM/g, format(expireDate, 'M'))
			.replace(/dd/g, format(expireDate, 'dd'));

	const onClickCancel = async () => {
		// TODO: 구독 취소 api 호출
		onMessageDialogClose();
	};

	if (!expireDate) {
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
				ml="16px">
				구독취소
			</Typography>
			<IcLogin color={style.vircleGrey300} />
		</Stack>
	);
}

export default CancelSubscribe;
