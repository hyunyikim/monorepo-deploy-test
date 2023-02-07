import {useState} from 'react';

import {Stack} from '@mui/material';

import {PlanType, PricePlan} from '@/@types';
import {CHARGED_GROUP_PLAN, isPlanOnSubscription} from '@/data';
import {useGetUserPricePlan, useIsUserUsedTrialPlan} from '@/stores';

import SubscribePlanSelect from './SubscribePlanSelect';
import SubscribePlan from './SubscribePlan';
import SquaredSwitch from '../SquaredSwitch';

interface Props {
	selectedPlan: PricePlan;
	onChangePlan: (value: PricePlan) => void;
	onChangePlanType: (value: PlanType) => void;
}

function ChargedSubscribePlan({
	selectedPlan,
	onChangePlan,
	onChangePlanType,
}: Props) {
	const {data: userPlan} = useGetUserPricePlan();
	const {data: isUserUsedTrialPlan} = useIsUserUsedTrialPlan();
	const [selectOpen, setSelectOpen] = useState(false);

	const onOpenSelect = (value: boolean) => {
		// 무료 플랜 이용중
		// 구독 종료 되었다면
		// 모두 열림
		if (
			!userPlan ||
			isUserUsedTrialPlan ||
			!isPlanOnSubscription({
				startDate: new Date(userPlan.planStartedAt),
				...(userPlan?.planExpireDate && {
					endDate: new Date(userPlan?.planExpireDate),
				}),
				isNextPlanExisted: !!userPlan?.nextPricePlan,
			})
		) {
			return setSelectOpen(value);
		}

		// 현재 구독 중인 플랜과 다른 플랜타입 선택시 select 열리지 않음
		if (
			userPlan &&
			userPlan?.pricePlan.planType !== selectedPlan.planType
		) {
			return setSelectOpen(false);
		}
		return setSelectOpen(value);
	};

	return (
		<Stack rowGap="14px" mb="16px">
			<SubscribePlan
				title={CHARGED_GROUP_PLAN.PLAN_NAME}
				desc={CHARGED_GROUP_PLAN.PLAN_DESCRIPTION}
				isSubscribed={!isUserUsedTrialPlan}
				isTrial={false}
				isEnded={false}>
				<Stack alignItems="flex-end" mt="30px" mb="16px">
					<SquaredSwitch
						planType={selectedPlan.planType}
						onChangePlanType={(planType) => {
							setSelectOpen(false);
							onChangePlanType(planType);
						}}
					/>
				</Stack>
				<SubscribePlanSelect
					selectOpen={selectOpen}
					setSelectOpen={onOpenSelect}
					selectedPlan={selectedPlan}
					onChangePlan={onChangePlan}
				/>
			</SubscribePlan>
		</Stack>
	);
}

export default ChargedSubscribePlan;
