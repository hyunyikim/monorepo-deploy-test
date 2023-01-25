import {useEffect, useMemo, useState} from 'react';

import {Stack} from '@mui/material';

import {
	useGetPricePlanList,
	useGetUserPricePlan,
	useGetPricePlanListByPlanType,
	useIsUserUsedTrialPlan,
} from '@/stores/payment.store';
import {PlanType, PricePlan, UserPricePlan} from '@/@types';
import {
	getChargedPlanDescription,
	TRIAL_PLAN,
	DATE_FORMAT,
	PAYMENT_MESSAGE_MODAL,
} from '@/data';
import {useChildModalOpen} from '@/utils/hooks';

import {Button} from '@/components';
import ChargedSubscribePlan from './SubscribePlan/ChargedSubscribePlan';
import SubscribeNotice from './SubscribeNotice';
import SubscribeInfoPreview from '@/features/payment/common/SubscribeInfoPreview';
import SubscribeNoticeBullet from '@/features/payment/common/SubscribeNoticeBullet';
import SubscribePlan from './SubscribePlan/SubscribePlan';
import SubscribeLineNotice from './SubscribeLineNotice';
import SubscribeCheckModal from './SubscribeCheckModal';
import CancelSubscribe from './CancelSubscribe';
import {differenceInCalendarDays, parse} from 'date-fns';
import {useMessageDialog} from '@/stores';

function SubscribeManagementTab() {
	const {data: userPlan} = useGetUserPricePlan({suspense: true});
	const {data: planList} = useGetPricePlanList();
	const {data: yearPlanList} = useGetPricePlanListByPlanType('YEAR');
	const {data: isUserUsedTrialPlan} = useIsUserUsedTrialPlan();

	const [isAvailableSelect, setIsAvailableSelect] = useState(false);
	const [selectedPlan, setSelectedPlan] = useState<PricePlan | null>(null);

	const {
		open: subscribeCheckModalOpen,
		onOpen: onSubscribeCheckModalOpen,
		onClose: onSubscribeCheckModalClose,
	} = useChildModalOpen({});

	const initialPlan = useMemo(() => {
		if (!planList || !yearPlanList || !userPlan) {
			return;
		}

		// 무료 체험중(기본 연결제 엑스스몰 플랜 선택됨)
		if (userPlan.payPlanId === TRIAL_PLAN.PLAN_ID) {
			const xsYearPlan = yearPlanList[0];
			return xsYearPlan;
		}

		// 유료플랜 구독중
		const selectedUserPlan = planList.filter(
			(plan) => plan.planId === userPlan.payPlanId
		)[0];
		return selectedUserPlan;
	}, [userPlan, planList, yearPlanList]);

	useEffect(() => {
		// 선택된 플랜 최초 설정
		// 구독설정 변경 클릭 후 취소시 선택된 플랜 초기화
		if (!initialPlan || isAvailableSelect) return;
		setSelectedPlan(initialPlan);
	}, [initialPlan, isAvailableSelect]);

	const onChangePlan = (value: PricePlan) => {
		setSelectedPlan(value);
	};

	const onChangePlanType = (planType: PlanType) => {
		// 동일한 플랜타입 선택
		if (selectedPlan && selectedPlan?.planType === planType) {
			return;
		}
		const sameLevelSelectedPlan = planList?.find(
			(plan) =>
				plan.planType === planType &&
				plan.planLevel === selectedPlan?.planLevel
		);
		sameLevelSelectedPlan && setSelectedPlan(sameLevelSelectedPlan);
	};

	const isPlanChanged = useMemo(() => {
		if (userPlan?.payPlanId !== selectedPlan?.planId) {
			return true;
		}
		return false;
	}, [userPlan, selectedPlan]);

	if (!selectedPlan) {
		return <></>;
	}
	return (
		<>
			<Stack
				flexDirection={{
					xs: 'column',
					md: 'row',
				}}
				flex={1}
				gap="24px"
				mt="32px">
				<Stack
					sx={{
						maxWidth: '460px',
						width: '100%',
					}}>
					{!isAvailableSelect ? (
						<>
							<NowSubscribedPlan userPlan={userPlan} />
							<SubscribeLineNotice />
						</>
					) : (
						<ChargedSubscribePlan
							selectedPlan={selectedPlan}
							onChangePlan={onChangePlan}
							onChangePlanType={onChangePlanType}
						/>
					)}
					<SubscribeMagageButtonGroup
						isTrial={!!isUserUsedTrialPlan}
						isAvailableSelect={isAvailableSelect}
						isPlanChanged={isPlanChanged}
						userPlan={userPlan}
						selectedPlan={selectedPlan}
						setIsAvailableSelect={setIsAvailableSelect}
						onSubscribeCheckModalOpen={onSubscribeCheckModalOpen}
					/>
				</Stack>
				<Stack
					sx={{
						maxWidth: '346px',
						width: '100%',
					}}>
					{isAvailableSelect ? (
						<>
							<SubscribeInfoPreview selectedPlan={selectedPlan} />
							<SubscribeNoticeBullet
								{...(!isUserUsedTrialPlan && {
									data: [
										'월결제 이용중 연결제로 변경 할 경우에는 월결제가 끝나는 다음달부터 연결제가 진행됩니다.',
									],
								})}
							/>
						</>
					) : (
						<SubscribeNotice />
					)}
				</Stack>
			</Stack>
			<SubscribeCheckModal
				selectedPlan={selectedPlan}
				open={subscribeCheckModalOpen}
				onClose={onSubscribeCheckModalClose}
			/>
		</>
	);
}

const NowSubscribedPlan = ({userPlan}: {userPlan?: UserPricePlan}) => {
	if (!userPlan) {
		return <></>;
	}
	const isTrial = TRIAL_PLAN.PLAN_ID === userPlan.payPlanId;
	const desc = isTrial
		? TRIAL_PLAN.PLAN_DESCRIPTION
		: getChargedPlanDescription(userPlan?.payPlanLimit || 0);
	const leftDays =
		differenceInCalendarDays(
			parse(userPlan.payPlanExpireDate, DATE_FORMAT, new Date()),
			new Date()
		) + 1;
	const isEnded = leftDays <= 0 ? true : false;
	return (
		<SubscribePlan
			title={userPlan.payPlanName}
			desc={desc}
			isSubscribed={true}
			isTrial={isTrial}
			isEnded={isEnded}
		/>
	);
};

// 현재 구독중인 정보
const SubscribeMagageButtonGroup = ({
	isTrial,
	isAvailableSelect,
	isPlanChanged,
	userPlan,
	selectedPlan,
	setIsAvailableSelect,
	onSubscribeCheckModalOpen,
}: {
	isTrial: boolean;
	isAvailableSelect: boolean;
	isPlanChanged: boolean;
	userPlan?: UserPricePlan;
	selectedPlan?: PricePlan;
	setIsAvailableSelect: (value: boolean) => void;
	onSubscribeCheckModalOpen: () => void;
}) => {
	const {onOpen: onOpenMessageDialog} = useMessageDialog();

	const onClickSubscribeChange = () => {
		// TODO: 플랜을 업그레이드 할 때만, 구독 정보 확인 팝업이 뜬다.
		onSubscribeCheckModalOpen();

		// 각 케이스 별로
		// const messageDialogData = PAYMENT_MESSAGE_MODAL.BAN_DOWNGRADE_YEAR_PLAN;
		// onOpenMessageDialog({
		// 	title: messageDialogData.title,
		// 	message: messageDialogData.message,
		// 	buttons: (
		// 		<>
		// 			<Button
		// 				variant="contained"
		// 				color="black"
		// 				onClick={() => {
		// 					// TODO:
		// 				}}>
		// 				확인
		// 			</Button>
		// 		</>
		// 	),
		// });
	};

	return (
		<Stack flexDirection="row" alignItems="center" mt="30px">
			{isAvailableSelect ? (
				<>
					<Button
						disabled={!isPlanChanged}
						height={40}
						sx={{
							marginRight: '8px',
						}}
						onClick={onClickSubscribeChange}>
						구독설정 변경
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
					<Button
						height={40}
						onClick={() => setIsAvailableSelect(true)}>
						{isTrial ? '플랜 업그레이드' : '플랜 변경하기'}
					</Button>
					{!isTrial && <CancelSubscribe />}
				</>
			)}
		</Stack>
	);
};

export default SubscribeManagementTab;
