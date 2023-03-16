import {useEffect, useMemo, useState} from 'react';

import {Stack} from '@mui/material';

import {
	useGetPricePlanList,
	useGetUserPricePlan,
	useGetPricePlanListByPlanType,
	useIsUserUsedTrialPlan,
	useIsPlanOnSubscription,
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
	isPlanEnterprise,
	TRIAL_PLAN,
} from '@/data';
import {useOpen} from '@/utils/hooks';

import ChargedSubscribePlan from './SubscribePlan/ChargedSubscribePlan';
import SubscribeNotice from './SubscribeNotice';
import SubscribeInfoPreview from '@/features/payment/common/SubscribeInfoPreview';
import SubscribeNoticeBullet from '@/features/payment/common/SubscribeNoticeBullet';
import SubscribePlan from './SubscribePlan/SubscribePlan';
import SubscribeLineNotice from './SubscribeLineNotice';
import SubscribeCheckModal from './SubscribeCheckModal';
import SubscribeMagageButtonGroup from './SubscribeMagageButtonGroup';
import {usePageView} from '@/utils';

function SubscribeManagementTab() {
	usePageView('subscription_invoice_pv', '');
	const {data: planList} = useGetPricePlanList({suspense: true});
	const {data: userPlan} = useGetUserPricePlan();
	const {data: yearPlanList} = useGetPricePlanListByPlanType('YEAR');
	const {data: isTrial} = useIsUserUsedTrialPlan();
	const {data: isOnSubscription} = useIsPlanOnSubscription();

	const [isAvailableSelect, setIsAvailableSelect] = useState(false);
	const [selectedPlan, setSelectedPlan] = useState<PricePlan | null>(null);

	const {
		open: subscribeCheckModalOpen,
		onOpen: onSubscribeCheckModalOpen,
		onClose: onSubscribeCheckModalClose,
	} = useOpen({});

	const initialPlan = useMemo(() => {
		if (!planList || !yearPlanList) {
			return;
		}
		// 플랜 종료/무료 체험중(기본 연결제 엑스스몰 플랜 선택됨)
		if (!userPlan || !isOnSubscription || (isOnSubscription && isTrial)) {
			const xsYearPlan = yearPlanList[0];
			return xsYearPlan;
		}
		return (
			planList.find(
				(plan) => plan.planId === userPlan.pricePlan.planId
			) || userPlan.pricePlan // userPlan은 사용자의 개런티 개수가 반영되어서 전달 되기 때문에, planList에서 선택한 값을 사용자에게 보여줌
		);
	}, [userPlan, isTrial, isOnSubscription, planList, yearPlanList]);

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
		const newSelectedPlan = planList?.find(
			(plan) =>
				plan.planName === selectedPlan?.planName && // 현재 planType 별로 planLevel이 다르다, 동일한 플랜이라고 판별할 수 있는 것은 현재는 플랜명
				plan.planType === planType
		);
		newSelectedPlan && setSelectedPlan(newSelectedPlan);
	};

	const subscribePreviewData =
		useMemo<TotalSubscribeInfoPreviewData | null>(() => {
			const isPlanWillCanceled = !!userPlan?.planExpireDate; // 취소 예정
			if (!selectedPlan) {
				return null;
			}
			if (
				!isTrial &&
				isOnSubscription &&
				!isPlanWillCanceled &&
				selectedPlan?.planId === userPlan?.pricePlan.planId // 현재 구독 중이고, 유료 플랜이 다음에도 결제될 예정이라면, 동일한 플랜 선택 불가
			) {
				return null;
			}

			return getSubscribePreviwData({
				selectedPlan,
				userPlan,
				isTrial: !!isTrial,
			});
		}, [isTrial, isOnSubscription, selectedPlan, userPlan]);

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
				flexWrap="wrap"
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
								isTrial={!!isTrial}
								userPlan={userPlan}
								planList={planList}
								isOnSubscription={!!isOnSubscription}
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
						showButtonGroup={
							isPlanEnterprise(userPlan?.pricePlan.planType)
								? false
								: true
						}
						isTrial={!!isTrial}
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
							<SubscribeInfoPreview data={subscribePreviewData} />
							<SubscribeNoticeBullet />
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
	isTrial,
	userPlan,
	planList,
	isOnSubscription,
}: {
	isTrial: boolean;
	userPlan?: UserPricePlanWithDate;
	planList?: PricePlan[];
	isOnSubscription: boolean;
}) => {
	if (!userPlan || !planList) {
		return <></>;
	}

	const desc = () => {
		if (isPlanEnterprise(userPlan?.pricePlan.planType)) {
			return null;
		}
		if (isTrial) {
			return TRIAL_PLAN.PLAN_DESCRIPTION;
		}
		const usingPlanLimit =
			planList?.find(
				(plan) => plan.planId === userPlan?.pricePlan?.planId
			)?.planLimit || userPlan?.pricePlan.planLimit;
		return getChargedPlanDescription(usingPlanLimit || 0);
	};

	if (!isOnSubscription && isTrial) {
		return (
			<SubscribePlan
				title={userPlan.pricePlan.planName}
				desc={desc() as string}
				showSubscribedChip={true}
				isTrial={isTrial}
				isEnded={!isOnSubscription}
				sx={{
					marginBottom: '16px',
				}}
			/>
		);
	}
	return (
		<SubscribePlan
			title={userPlan.pricePlan.planName}
			desc={desc()}
			showSubscribedChip={true}
			isTrial={isTrial}
			isEnded={!isOnSubscription}
			sx={{
				marginBottom: '16px',
			}}
		/>
	);
};

export default SubscribeManagementTab;
