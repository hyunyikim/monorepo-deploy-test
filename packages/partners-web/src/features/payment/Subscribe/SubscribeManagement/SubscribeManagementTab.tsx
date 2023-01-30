import {useEffect, useMemo, useState} from 'react';
import {addMonths, addYears, differenceInCalendarDays, format} from 'date-fns';

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
	TotalSbuscribeInfoPreviewData,
	UserPricePlanWithDate,
} from '@/@types';
import {
	DATE_FORMAT_SEPERATOR_DOT,
	getChargedPlanDescription,
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
	const {data: userPlan} = useGetUserPricePlan({suspense: true});
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
		if (userPlan.pricePlan.planId === TRIAL_PLAN.PLAN_ID) {
			const xsYearPlan = yearPlanList[0];
			return xsYearPlan;
		}

		// 유료플랜 구독중
		return userPlan.pricePlan;
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

	const subscribePreviewData =
		useMemo<TotalSbuscribeInfoPreviewData | null>(() => {
			if (!selectedPlan) {
				return null;
			}
			const today = format(new Date(), DATE_FORMAT_SEPERATOR_DOT);
			const endDate = format(
				selectedPlan.planType === 'MONTH'
					? addMonths(new Date(), 1)
					: addYears(new Date(), 1),
				DATE_FORMAT_SEPERATOR_DOT
			);
			return {
				data: {
					planName: selectedPlan.planName,
					subscribeDuration: `${today}-${endDate}`,
					displayTotalPrice: selectedPlan?.displayTotalPrice,
					planTotalPrice: selectedPlan?.planTotalPrice,
					discountTotalPrice: selectedPlan?.discountTotalPrice,
					totalPrice: selectedPlan?.totalPrice,
					payApprovedAt: today,
				},
			};
		}, [selectedPlan, userPlan]);

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
					subscribePreview={subscribePreviewData.data}
					open={subscribeCheckModalOpen}
					onOpen={onSubscribeCheckModalOpen}
					onClose={onSubscribeCheckModalClose}
				/>
			)}
		</>
	);
}

const NowSubscribedPlan = ({userPlan}: {userPlan?: UserPricePlanWithDate}) => {
	if (!userPlan) {
		return <></>;
	}
	const isTrial = TRIAL_PLAN.PLAN_ID === userPlan.pricePlan.planId;
	const desc = isTrial
		? TRIAL_PLAN.PLAN_DESCRIPTION
		: getChargedPlanDescription(userPlan?.pricePlan.planLimit || 0);
	const leftDays =
		differenceInCalendarDays(userPlan.planExpireDate, new Date()) + 1;
	const isEnded = leftDays <= 0 ? true : false;
	return (
		<SubscribePlan
			title={userPlan.pricePlan.planName}
			desc={desc}
			isSubscribed={true}
			isTrial={isTrial}
			isEnded={isEnded}
		/>
	);
};

export default SubscribeManagementTab;
