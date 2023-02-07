import {useEffect, useMemo, useState} from 'react';

import {Stack} from '@mui/material';

import {
	useGetPricePlanList,
	useGetUserPricePlan,
	useGetPricePlanListByPlanType,
	useIsUserUsedTrialPlan,
} from '@/stores';
import {
	PlanType,
	PricePlan,
	TotalSubscribeInfoPreviewData,
	UserPricePlanWithDate,
} from '@/@types';
import {
	getChargedPlanDescription,
	getSubscribePreviwData,
	isPlanOnSubscription,
	TRIAL_PLAN,
} from '@/data';
import {useChildModalOpen} from '@/utils/hooks';

import ChargedSubscribePlan from './SubscribePlan/ChargedSubscribePlan';
import SubscribeNotice from './SubscribeNotice';
import SubscribeInfoPreview from '@/features/payment/common/SubscribeInfoPreview';
import SubscribeNoticeBullet from '@/features/payment/common/SubscribeNoticeBullet';
import SubscribePlan from './SubscribePlan/SubscribePlan';
import SubscribeLineNotice from './SubscribeLineNotice';
import SubscribeCheckModal from './SubscribeCheckModal';
import SubscribeMagageButtonGroup from './SubscribeMagageButtonGroup';

function SubscribeManagementTab() {
	const {data: planList} = useGetPricePlanList({suspense: true});
	const {data: userPlan} = useGetUserPricePlan();
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
		if (!planList || !yearPlanList) {
			return;
		}

		const isOnSubscription = isPlanOnSubscription({
			startDate: userPlan?.planStartedAt,
			endDate: userPlan?.planExpireDate,
			isNextPlanExisted: !!userPlan?.nextPricePlan,
		});

		// 플랜 종료/무료 체험중(기본 연결제 엑스스몰 플랜 선택됨)
		if (!userPlan || isUserUsedTrialPlan || !isOnSubscription) {
			const xsYearPlan = yearPlanList[0];
			return xsYearPlan;
		}
		return (
			planList.find(
				(plan) => plan.planId === userPlan.pricePlan.planId
			) || userPlan.pricePlan // userPlan은 사용자의 개런티 개수가 반영되어서 전달 되기 때문에, planList에서 선택한 값을 사용자에게 보여줌
		);
	}, [userPlan, isUserUsedTrialPlan, planList, yearPlanList]);

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
		const newSelectedPlan =
			planList?.find(
				(plan) =>
					plan.planName === selectedPlan?.planName && // 현재 planType 별로 planLevel이 다르다, 동일한 플랜이라고 판별할 수 있는 것은 현재는 플랜명
					plan.planType === planType
			) || planList?.find((plan) => plan.planType === planType);
		newSelectedPlan && setSelectedPlan(newSelectedPlan);
	};

	const subscribePreviewData =
		useMemo<TotalSubscribeInfoPreviewData | null>(() => {
			if (!selectedPlan) {
				return null;
			}
			return getSubscribePreviwData({
				selectedPlan,
				userPlan,
				isUserUsedTrialPlan: !!isUserUsedTrialPlan,
			});
		}, [isUserUsedTrialPlan, selectedPlan, userPlan]);

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
							<NowSubscribedPlan
								userPlan={userPlan}
								isTrial={!!isUserUsedTrialPlan}
							/>
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
							{subscribePreviewData && (
								<SubscribeInfoPreview
									data={subscribePreviewData}
								/>
							)}
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
			{subscribePreviewData && (
				<SubscribeCheckModal
					selectedPlan={selectedPlan}
					subscribePreview={subscribePreviewData}
					open={subscribeCheckModalOpen}
					onOpen={onSubscribeCheckModalOpen}
					onClose={onSubscribeCheckModalClose}
					setIsAvailableSelect={setIsAvailableSelect}
				/>
			)}
		</>
	);
}

const NowSubscribedPlan = ({
	userPlan,
	isTrial,
}: {
	userPlan?: UserPricePlanWithDate;
	isTrial: boolean;
}) => {
	if (!userPlan) {
		return <></>;
	}
	const desc = isTrial
		? TRIAL_PLAN.PLAN_DESCRIPTION
		: getChargedPlanDescription(userPlan?.pricePlan.planLimit || 0);

	const isOnSubscription = isPlanOnSubscription({
		startDate: userPlan.planStartedAt,
		endDate: userPlan.planExpireDate,
		isNextPlanExisted: !!userPlan?.nextPlanStartDate,
	});

	if (!isOnSubscription) {
		return null;
	}
	return (
		<SubscribePlan
			title={userPlan.pricePlan.planName}
			desc={desc}
			isSubscribed={true}
			isTrial={isTrial}
			isEnded={!isOnSubscription}
			sx={{
				marginBottom: '16px',
			}}
		/>
	);
};

export default SubscribeManagementTab;
