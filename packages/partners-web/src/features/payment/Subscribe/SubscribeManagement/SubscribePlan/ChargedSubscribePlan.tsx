import {useState} from 'react';
import {Stack} from '@mui/material';

import SubscribePlanSelect from './SubscribePlanSelect';
import SubscribePlan from './SubscribePlan';
import SquaredSwitch from '../SquaredSwitch';

import {PlanType, PricePlan} from '@/@types';
import {CHARGED_GROUP_PLAN} from '@/data';
import {useIsUserUsedTrialPlan} from '@/stores';

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
	const {data: isUserUsedTrialPlan} = useIsUserUsedTrialPlan();
	const [selectOpen, setSelectOpen] = useState(false);

	const onOpenSelect = () => {
		return setSelectOpen;
		// if (isUserUsedTrialPlan) {
		// 	return setSelectOpen;
		// }
		// TODO: 유료 플랜 구독 중 플랜타입 변경시, 플랜 종류 변경 불가
		// 유저가 현재 구독하고 있는 플랜의 타입이 필요하다 (month, year)
		// payPlanId가 planId와 동일한가?
	};

	return (
		<Stack rowGap="14px">
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
							onChangePlanType(planType);
						}}
					/>
				</Stack>
				<SubscribePlanSelect
					selectOpen={selectOpen}
					setSelectOpen={setSelectOpen}
					selectedPlan={selectedPlan}
					onChangePlan={onChangePlan}
				/>
			</SubscribePlan>
		</Stack>
	);
}

export default ChargedSubscribePlan;
