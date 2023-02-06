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

		// 플랜 종료/무료 체험중(기본 연결제 엑스스몰 플랜 선택됨)
		if (!userPlan || isUserUsedTrialPlan) {
			const xsYearPlan = yearPlanList[0];
			return xsYearPlan;
		}

		// 유료플랜 구독중
		return userPlan.pricePlan;
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
		const initialSelectedPlan = planList?.find(
			(plan) => plan.planType === planType
		);
		initialSelectedPlan && setSelectedPlan(initialSelectedPlan);
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
	return (
		<SubscribePlan
			title={userPlan.pricePlan.planName}
			desc={desc}
			isSubscribed={true}
			isTrial={isTrial}
			isEnded={!isOnSubscription}
		/>
	);
};

export default SubscribeManagementTab;
