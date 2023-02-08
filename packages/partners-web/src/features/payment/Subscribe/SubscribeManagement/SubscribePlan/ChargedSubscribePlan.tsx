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
	const {data: isUserUsedTrialPlan} = useIsUserUsedTrialPlan();
	const [selectOpen, setSelectOpen] = useState(false);

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
					setSelectOpen={setSelectOpen}
					selectedPlan={selectedPlan}
					onChangePlan={onChangePlan}
				/>
			</SubscribePlan>
		</Stack>
	);
}

export default ChargedSubscribePlan;
