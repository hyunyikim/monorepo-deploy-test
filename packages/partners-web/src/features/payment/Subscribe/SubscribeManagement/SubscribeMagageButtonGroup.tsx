import {useCallback, useMemo} from 'react';
import {useQueryClient} from '@tanstack/react-query';
import {format} from 'date-fns';

import {Stack, Link} from '@mui/material';

import {
	useGetUserPricePlan,
	useGlobalLoading,
	useIsPlanOnSubscription,
	useMessageDialog,
} from '@/stores';
import {OnOpenParamType, PricePlan} from '@/@types';
import {
	isPlanTypeMonth,
	isPlanTypeYear,
	isPlanUpgraded,
	isPlanDowngraded,
} from '@/data';
import {patchPricePlan} from '@/api/payment.api';
import {updateUserPricePlanData, openChannelTalk} from '@/utils';

import {Button} from '@/components';
import CancelSubscribe from './CancelSubscribe';

type PaymentMessageModalKey =
	| 'CHANGE_PLAN_YEAR_TO_MONTH'
	| 'CHANGE_PLAN_MONTH_TO_YEAR'
	| 'CHANGE_PLAN_DOWNGRADE_MONTHLY'
	| 'BAN_DOWNGRADE_YEAR_PLAN';
type PaymentMessageModalType = {
	[key in PaymentMessageModalKey]: OnOpenParamType;
};

const onClickChangePlanGuide = () => {
	window.open(
		`${VIRCLE_GUIDE_URL}/subscription/change-plan-policy`,
		'_blank'
	);
};

export const PAYMENT_MESSAGE_MODAL: PaymentMessageModalType = {
	CHANGE_PLAN_YEAR_TO_MONTH: {
		title: '연결제를 월결제로 변경하시나요?',
		message: (
			<>
				연결제 이용시 월결제로 변경 할 경우에는 연결제가 끝나는 다음
				결제일부터 월결제 요금이 결제됩니다. 자세한 사항은{' '}
				<Link
					sx={{
						color: 'grey.600',
						textDecorationColor: (theme) => theme.palette.grey[600],
					}}
					className="cursor-pointer"
					onClick={onClickChangePlanGuide}>
					구독가이드
				</Link>
				를 참고해주세요.
			</>
		),
		showBottomCloseButton: true,
		closeButtonValue: '취소',
	},
	CHANGE_PLAN_MONTH_TO_YEAR: {
		title: '월결제를 연결제로 변경하시나요?',
		message: (
			<>
				월결제를 연결제로 변경 할 경우에는 월결제가 끝나는 다음달
				결제일에 연결제 요금이 결제됩니다. 자세한 사항은{' '}
				<Link
					sx={{
						color: 'grey.600',
						textDecorationColor: (theme) => theme.palette.grey[600],
					}}
					className="cursor-pointer"
					onClick={onClickChangePlanGuide}>
					구독가이드
				</Link>
				를 참고해주세요.
			</>
		),
		showBottomCloseButton: true,
		closeButtonValue: '취소',
	},
	CHANGE_PLAN_DOWNGRADE_MONTHLY: {
		title: '정말 플랜을 다운그레이드 하시겠어요?',
		message: (
			<>
				플랜 다운그레이드 변경시 구독 기간이 끝난 후 다음달 결제일부터
				다운그레이드 된 플랜의 요금제가 적용됩니다.
			</>
		),
		showBottomCloseButton: true,
		closeButtonValue: '취소',
	},
	BAN_DOWNGRADE_YEAR_PLAN: {
		title: '이미 연결제로 플랜을 구독중이시네요',
		message: (
			<>
				연결제로 플랜을 구독중 플랜의 다운그레이드는 현재 지원하지 않고,
				<Link
					sx={{
						color: 'grey.600',
						textDecorationColor: (theme) => theme.palette.grey[600],
					}}
					className="cursor-pointer"
					onClick={openChannelTalk}>
					고객센터
				</Link>
				로 문의 주시면 버클팀에서 확인 후 이용중이시던 플랜의 구독
				취소를 도와드립니다. (단, 위약금 규정에 따라 위약금을 공제 후
				차액을 환불해드립니다.)
			</>
		),
		showBottomCloseButton: true,
		closeButtonValue: '확인',
	},
};

function SubscribeMagageButtonGroup({
	isTrial,
	isAvailableSelect,
	selectedPlan,
	setIsAvailableSelect,
	onSubscribeCheckModalOpen,
}: {
	isTrial: boolean;
	isAvailableSelect: boolean;
	selectedPlan?: PricePlan;
	setIsAvailableSelect: (value: boolean) => void;
	onSubscribeCheckModalOpen: () => void;
}) {
	const queryClient = useQueryClient();
	const {
		onOpen: onOpenMessageDialog,
		onOpenError,
		onClose: onCloseMessageDialog,
	} = useMessageDialog();
	const setIsLoading = useGlobalLoading((state) => state.setIsLoading);
	const {data: userPlan} = useGetUserPricePlan();
	const {data: isOnSubscription} = useIsPlanOnSubscription();

	const isPlanChanged = useMemo(() => {
		if (!isOnSubscription) {
			// 현재 구독하지 않고 있을 경우, 모든 플랜 선택 가능
			return true;
		}
		if (userPlan?.pricePlan.planId !== selectedPlan?.planId) {
			return true;
		}
		return false;
	}, [userPlan, selectedPlan, isOnSubscription]);

	const onClickSubscribeChange = useCallback(() => {
		if (!selectedPlan) {
			return;
		}

		// 기존 구독 종료
		// 플랜 업그레이드 시
		// 1. 동일한 플랜타입에서 업그레이드
		// 2. 무료플랜에서 업그레이드
		if (
			!userPlan ||
			!isOnSubscription ||
			(isPlanUpgraded(
				userPlan.pricePlan.planLevel,
				selectedPlan.planLevel
			) &&
				(userPlan.pricePlan.planType === selectedPlan.planType ||
					isTrial))
		) {
			onSubscribeCheckModalOpen();
			return;
		}

		// 월결제에서 연결제로
		let messageDialogData: OnOpenParamType | null = null;
		if (
			isPlanTypeMonth(userPlan.pricePlan.planType) &&
			isPlanTypeYear(selectedPlan.planType)
		) {
			messageDialogData = PAYMENT_MESSAGE_MODAL.CHANGE_PLAN_MONTH_TO_YEAR;
		}

		// 연결제에서 월결제로
		if (
			isPlanTypeYear(userPlan.pricePlan.planType) &&
			isPlanTypeMonth(selectedPlan.planType)
		) {
			messageDialogData = PAYMENT_MESSAGE_MODAL.CHANGE_PLAN_YEAR_TO_MONTH;
		}

		// 월결제 플랜 다운그레이드
		if (
			isPlanTypeMonth(userPlan.pricePlan.planType) &&
			isPlanTypeMonth(selectedPlan.planType) &&
			isPlanDowngraded(
				userPlan.pricePlan.planLevel,
				selectedPlan.planLevel
			)
		) {
			messageDialogData =
				PAYMENT_MESSAGE_MODAL.CHANGE_PLAN_DOWNGRADE_MONTHLY;
		}

		// 연결제 플랜 다운그레이드
		if (
			isPlanTypeYear(userPlan.pricePlan.planType) &&
			isPlanTypeYear(selectedPlan.planType) &&
			isPlanDowngraded(
				userPlan.pricePlan.planLevel,
				selectedPlan.planLevel
			)
		) {
			messageDialogData = PAYMENT_MESSAGE_MODAL.BAN_DOWNGRADE_YEAR_PLAN;
			onOpenMessageDialog({
				...messageDialogData,
			});
			return;
		}

		if (!messageDialogData) {
			return;
		}
		onOpenMessageDialog({
			...messageDialogData,
			buttons: (
				<Button
					variant="contained"
					color="black"
					onClick={() => {
						(async () => {
							try {
								setIsLoading(true);
								await patchPricePlan({
									planId: selectedPlan.planId,
								});
								onOpenMessageDialog({
									title: '구독 플랜이 변경됐습니다.',
									showBottomCloseButton: true,
									closeButtonValue: '확인',
									onCloseFunc: () => {
										setIsAvailableSelect(false);
									},
								});
								updateUserPricePlanData();
								queryClient.invalidateQueries({
									queryKey: ['userPricePlan'],
								});
							} catch (e) {
								onOpenError();
							} finally {
								setIsLoading(false);
							}
						})();
					}}>
					확인
				</Button>
			),
		});
	}, [selectedPlan, userPlan, isTrial, isOnSubscription]);

	const onClickTrySubscribeChange = useCallback(() => {
		if (
			isOnSubscription &&
			userPlan?.pricePlan &&
			userPlan?.nextPricePlan &&
			userPlan?.nextPlanStartDate &&
			userPlan?.pricePlan?.planId !== userPlan?.nextPricePlan?.planId
		) {
			const {pricePlan, nextPricePlan, nextPlanStartDate} = userPlan;
			onOpenMessageDialog({
				title: '기존에 플랜 변경 요청을 하셨어요.',
				message: (
					<>
						다시 플랜 변경 신청을 하시겠습니까?
						<br />
						현재 구독 중인 {pricePlan.planName}{' '}
						{isPlanTypeMonth(pricePlan.planType) ? '월간' : '연간'}{' '}
						플랜이 {format(nextPlanStartDate, 'yyyy')}년{' '}
						{format(nextPlanStartDate, 'M')}월{' '}
						{format(nextPlanStartDate, 'd')}일에 종료 되며, 새로운{' '}
						{nextPricePlan.planName}{' '}
						{isPlanTypeMonth(nextPricePlan.planType)
							? '월간'
							: '연간'}{' '}
						플랜으로 구독이 결제될 예정입니다.
					</>
				),
				buttons: (
					<>
						<Button
							color="black"
							onClick={() => {
								setIsAvailableSelect(true);
								onCloseMessageDialog();
							}}>
							플랜 변경
						</Button>
					</>
				),
				showBottomCloseButton: true,
				closeButtonValue: '닫기',
			});
			return;
		}
		setIsAvailableSelect(true);
	}, [userPlan, isOnSubscription]);

	return (
		<Stack flexDirection="row" alignItems="center">
			{isAvailableSelect ? (
				<>
					<Button
						disabled={!isPlanChanged}
						height={40}
						sx={{
							marginRight: '8px',
						}}
						onClick={onClickSubscribeChange}>
						{!isOnSubscription || isTrial
							? '구독'
							: '구독설정 변경'}
					</Button>
					<Button
						variant="outlined"
						color="grey-100"
						height={40}
						onClick={() => setIsAvailableSelect(false)}>
						취소
					</Button>
				</>
			) : (
				<>
					<Button height={40} onClick={onClickTrySubscribeChange}>
						{!isOnSubscription || isTrial
							? '플랜 구독하기'
							: '플랜 변경하기'}
					</Button>
					{!isTrial && isOnSubscription && <CancelSubscribe />}
				</>
			)}
		</Stack>
	);
}

export default SubscribeMagageButtonGroup;
