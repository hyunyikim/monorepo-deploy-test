import {useState} from 'react';

import {Stack} from '@mui/material';

import {PlanType, PricePlan} from '@/@types';
import {CHARGED_GROUP_PLAN} from '@/data';
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
		if (!userPlan) {
			return setSelectOpen(false);
		}
		if (isUserUsedTrialPlan) {
			return setSelectOpen(value);
		}

		// 동일한 플랜 타입 선택시에만 select open
		if (userPlan.pricePlan.planType === selectedPlan.planType) {
			return setSelectOpen(value);
		}
		// select 안열림
		return setSelectOpen(false);
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
					setSelectOpen={onOpenSelect}
					selectedPlan={selectedPlan}
					onChangePlan={onChangePlan}
				/>
			</SubscribePlan>
		</Stack>
	);
}

export default ChargedSubscribePlan;
