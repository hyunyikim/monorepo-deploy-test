import {isPlanEnterprise} from '@/data';
import {useGetUserPricePlan, useIsPlanOnSubscription} from '@/stores';

import iconFree from '@/assets/icon/icon_price_plan_free.svg';
import iconXs from '@/assets/icon/icon_price_plan_xs.svg';
import iconS from '@/assets/icon/icon_price_plan_s.svg';
import iconM from '@/assets/icon/icon_price_plan_m.svg';
import iconL from '@/assets/icon/icon_price_plan_l.svg';
import iconE from '@/assets/icon/icon_price_plan_e.svg';
import {useMemo} from 'react';
import {Stack, Typography} from '@mui/material';

function GuaranteeInfoBox() {
	const {data: userPricePlan} = useGetUserPricePlan();
	const {data: isOnSubscription} = useIsPlanOnSubscription();
	const isEnterprise = isPlanEnterprise(userPricePlan?.pricePlan?.planType);

	const pricePlanInfo = useMemo(() => {
		if (!userPricePlan || !userPricePlan?.pricePlan) {
			return null;
		}
		if (isEnterprise) {
			return {
				icon: iconE,
			};
		}
		const {pricePlan} = userPricePlan;
		if (pricePlan.planLevel === 0) {
			return {
				icon: iconFree,
				color: '#222227',
			};
		}

		const planId = pricePlan.planId;
		if (planId.includes('XSMALL')) {
			return {
				icon: iconXs,
				color: 'primary.main',
			};
		}
		if (planId.includes('SMALL')) {
			return {
				icon: iconS,
				color: 'primary.main',
			};
		}
		if (planId.includes('MEDIUM')) {
			return {
				icon: iconM,
				color: 'primary.main',
			};
		}
		if (planId.includes('LARGE')) {
			return {
				icon: iconL,
				color: 'primary.main',
			};
		}
		return null;
	}, [userPricePlan, isEnterprise]);

	const leftNftCount = useMemo(() => {
		const pricePlan = userPricePlan?.pricePlan;
		const usedNftCount = userPricePlan?.usedNftCount || 0;
		const planLimit = pricePlan?.planLimit || 0;
		return planLimit - usedNftCount <= 0 ? 0 : planLimit - usedNftCount;
	}, [userPricePlan]);

	return (
		<>
			{!pricePlanInfo || !isOnSubscription ? (
				<></>
			) : (
				<Stack
					sx={{
						display: {
							xs: 'none',
							sm: 'flex',
						},
						marginRight: '32px',
						height: '36px',
						background: '#F3F3F5',
						borderRadius: '4px',
						padding: '6px 12px',
						flexDirection: 'row',
						alignContent: 'center',
						gap: '9px',
						position: 'relative',
					}}>
					<pricePlanInfo.icon width={24} height={24} />
					{isEnterprise ? (
						<Typography
							sx={{
								fontWeight: 700,
								fontSize: '13px',
								lineHeight: '24px',
								color: '#7B7B86',
								whiteSpace: 'nowrap',
							}}>
							엔터프라이즈 이용중
						</Typography>
					) : (
						<Stack
							sx={{
								flexDirection: 'row',
								alignContent: 'center',
								flex: '1 1 auto',
								width: '100%',
							}}>
							<Typography
								sx={{
									fontWeight: 700,
									fontSize: '13px',
									lineHeight: '24px',
									color: '#7B7B86',
									whiteSpace: 'nowrap',
								}}>
								잔여 개런티 발급량 :&nbsp;
							</Typography>
							<Typography
								sx={{
									fontWeight: 700,
									fontSize: '13px',
									lineHeight: '24px',
									color: pricePlanInfo.color,
									width: 'auto',
									whiteSpace: 'nowrap',
								}}>
								{leftNftCount.toLocaleString()}
							</Typography>
							<Typography
								sx={{
									fontWeight: 700,
									fontSize: '13px',
									lineHeight: '24px',
									color: '#7B7B86',
									whiteSpace: 'nowrap',
								}}>
								/
								{(
									userPricePlan?.pricePlan?.planLimit || 0
								).toLocaleString()}
							</Typography>
						</Stack>
					)}
				</Stack>
			)}
		</>
	);
}

export default GuaranteeInfoBox;
