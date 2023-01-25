import {useMemo} from 'react';
import {parse, differenceInCalendarDays, format} from 'date-fns';

import {Typography} from '@mui/material';

import {useGetUserPricePlan, useGetPricePlanList} from '@/stores/payment.store';

import {LineNotice} from '@/components';
import {PricePlan} from '@/@types';
import {TRIAL_PLAN} from '@/data';

type LineNoticeKey =
	| 'TRIAL'
	| 'TRIAL_ALMOST_FINISH'
	| 'TRIAL_FINISHED'
	| 'CHARGED_GROUP_PLAN'
	| 'LACKING_GUARANTEE'
	| 'CHANGE_PLAN_MONTH_TO_YEAR'
	| 'CHANGE_PLAN_YEAR_TO_MONTH'
	| 'CHANGE_PLAN_UPGRADE'
	| 'CHANGE_PLAN_DOWNGRADE_MONTHLY'
	| 'PLAN_WILL_END';
type LineNoticeValue = {
	content: LineNoticeContent;
	color: 'green' | 'red' | 'primary';
};
type LineNoticeContent = string | [string, React.ReactNode];
type LineNotice = {
	[key in LineNoticeKey]: LineNoticeValue;
};

const REPLACE_CHARACTOR = {
	YEAR: 'yyyy',
	MONTH: 'MM',
	DATE: 'dd',
	NN: 'NN',
	PLAN_NAME: 'PLAN_NAME',
	UPGRADE_PLAN_NAME: 'UPGRADE_PLAN_NAME',
	DOWNGRADE_PLAN_NAME: 'DOWNGRADE_PLAN_NAME',
};

const LINE_NOTICE: LineNotice = {
	// 트라이얼
	TRIAL: {
		content: `무료 체험 기간은 yyyy년 MM월 dd일에 종료됩니다. 무료 체험 기간이 끝나면 사용할 수 있는 기능에 제한이 생깁니다. 유료 플랜으로 업그레이드 해보세요!`,
		color: 'green',
	},
	TRIAL_ALMOST_FINISH: {
		content: [
			'무료 체험 기간이 NN일 남았습니다. (MM월 dd일 종료)',
			<Typography variant="caption3" fontWeight="medium">
				원활한 서비스 이용을 위해 플랜 업그레이드를 권장합니다.
			</Typography>,
		],
		color: 'red',
	},
	TRIAL_FINISHED: {
		content: `무료 체험 기간이 종료되었습니다. 버클의 핵심 기능을 사용하고 싶다면, 플랜을 업그레이드 해주세요!`,
		color: 'red',
	},
	// 유료플랜
	// 유료플랜 이용 중일 때
	CHARGED_GROUP_PLAN: {
		content: `발급량이 부족하다면 UPGRADE_PLAN_NAME 플랜으로 업그레이드를 권장합니다. 발급량 초과시 서비스 사용이 제한될 수 있어요.`,
		color: 'green',
	},
	// 유료플랜 이용 중 사용 가능한 개런티 일정범위 미만일 때
	LACKING_GUARANTEE: {
		content: `UPGRADE_PLAN_NAME 플랜으로 업그레이드를 권장합니다. 발급량 초과시 서비스 사용이 제한됩니다.`,
		color: 'green',
	},
	// 플랜 변경될 예정일 때 (월결제 -> 연결제)
	CHANGE_PLAN_MONTH_TO_YEAR: {
		content: 'yyyy년 MM월 dd일부터 연결제로 구독 플랜이 변경됩니다.',
		color: 'primary',
	},
	// 플랜 변경될 예정일 때 (연결제 -> 월결제)
	CHANGE_PLAN_YEAR_TO_MONTH: {
		content:
			'yyyy년 MM월 dd일 PLAN_NAME 연간 플랜 구독이 종료 되며, DOWNGRADE_PLAN_NAME 월간 플랜을 이용합니다.',
		color: 'primary',
	},
	// 플랜 업그레이드 시
	CHANGE_PLAN_UPGRADE: {
		content:
			'yyyy년 MM월 dd일부터 UPGRADE_PLAN_NAME 구독 플랜으로 변경됩니다.',
		color: 'primary',
	},
	// 플랜 변경될 예정일 때 (월결제, 다운그레이드)
	CHANGE_PLAN_DOWNGRADE_MONTHLY: {
		content: `yyyy년 MM월 dd일 PLAN_NAME 플랜 구독이 종료 되며, DOWNGRADE_PLAN_NAME 플랜으로 변경됩니다.`,
		color: 'primary',
	},
	// 플랜 종료 예정
	PLAN_WILL_END: {
		content: `yyyy년 MM월 dd일 PLAN_NAME 플랜 구독이 종료됩니다.`,
		color: 'primary',
	},
};

export const replaceLineNotice = (
	content: LineNoticeContent,
	expiredDate?: Date,
	leftDays?: number,
	planName?: string,
	upgradePlanName?: string,
	downgradePlanName?: string
): LineNoticeContent => {
	let replacedContent = Array.isArray(content) ? content[0] : content;
	const parsedDate = expiredDate && {
		year: format(expiredDate, 'yyyy'),
		month: format(expiredDate, 'M'),
		date: format(expiredDate, 'dd'),
	};
	if (parsedDate) {
		replacedContent = replacedContent
			.replace(/yyyy/g, parsedDate.year)
			.replace(/MM/g, parsedDate.month)
			.replace(/dd/g, parsedDate.date);
	}
	if (leftDays && replacedContent.includes(REPLACE_CHARACTOR.NN)) {
		replacedContent = replacedContent.replace(/NN/g, String(leftDays));
	}
	if (replacedContent.includes(REPLACE_CHARACTOR.UPGRADE_PLAN_NAME)) {
		replacedContent = replacedContent.replace(
			/UPGRADE_PLAN_NAME/g,
			upgradePlanName || ''
		);
	}
	if (replacedContent.includes(REPLACE_CHARACTOR.DOWNGRADE_PLAN_NAME)) {
		replacedContent = replacedContent.replace(
			/DOWNGRADE_PLAN_NAME/g,
			downgradePlanName || ''
		);
	}
	if (replacedContent.includes(REPLACE_CHARACTOR.PLAN_NAME)) {
		replacedContent = replacedContent.replace(/PLAN_NAME/g, planName || '');
	}
	return Array.isArray(content)
		? [replacedContent, content[1]]
		: replacedContent;
};

function SubscribeLineNotice() {
	const {data: userPlan} = useGetUserPricePlan();
	const {data: planList} = useGetPricePlanList();

	const lineNoticeData = useMemo(() => {
		if (!userPlan || !planList) return;

		const {
			payPlanName,
			payPlanId,
			payPlanExpireDate,
			payPlanLimit,
			usedNftCount,
		} = userPlan;
		const parsedPlanExpireDate = parse(
			payPlanExpireDate,
			'yyyy-MM-dd',
			new Date()
		);
		const leftDays =
			differenceInCalendarDays(parsedPlanExpireDate, new Date()) + 1;

		// trial
		if (payPlanId === TRIAL_PLAN.PLAN_ID) {
			if (leftDays <= 0) {
				return LINE_NOTICE.TRIAL_FINISHED;
			}
			if (leftDays <= 10) {
				const lineNotice = LINE_NOTICE.TRIAL_ALMOST_FINISH;
				return {
					...lineNotice,
					content: replaceLineNotice(
						lineNotice.content,
						parsedPlanExpireDate,
						leftDays
					),
				};
			}
			const lineNotice = LINE_NOTICE.TRIAL;
			return {
				...lineNotice,
				content: replaceLineNotice(
					lineNotice.content,
					parsedPlanExpireDate
				),
			};
		}

		// 유료플랜
		const nowPlan = planList.filter((plan) => plan.planId === payPlanId)[0];
		let nextPlan: PricePlan[] | PricePlan | null = planList.filter(
			(plan) =>
				plan.planLevel === nowPlan.planLevel + 1 &&
				nowPlan.planType === plan.planType
		);
		nextPlan = nextPlan?.length > 0 ? nextPlan[0] : null;
		let downgradePlan: PricePlan[] | PricePlan | null = planList.filter(
			(plan) =>
				plan.planLevel === nowPlan.planLevel - 1 &&
				nowPlan.planType === plan.planType
		);
		downgradePlan = downgradePlan?.length > 0 ? downgradePlan[0] : null;

		// 개런티 부족
		if (payPlanLimit - usedNftCount < Math.ceil(payPlanLimit * 0.3)) {
			const lineNotice = LINE_NOTICE.LACKING_GUARANTEE;
			return {
				...lineNotice,
				content: replaceLineNotice(
					lineNotice.content,
					parsedPlanExpireDate,
					leftDays,
					nowPlan?.planName,
					nextPlan?.planName,
					downgradePlan?.planName
				),
			};
		}

		// TODO: 상태 변경 완료후
		// 월결제에서 연결제로 변경 완료, 현재 아직 월결제 이용중
		// return LINE_NOTICE.CHANGE_PLAN_MONTH_TO_YEAR;

		// 연결제에서 월결제로 변경 완료, 현재 아직 연결제 이용중
		// return LINE_NOTICE.CHANGE_PLAN_YEAR_TO_MONTH;

		// 플랜 업그레이드 완료
		// return LINE_NOTICE.CHANGE_PLAN_UPGRADE;

		// 플랜 다운그레이드 예정
		// return LINE_NOTICE.CHANGE_PLAN_DOWNGRADE_MONTHLY;

		// 플랜 종료 예정
		// return LINE_NOTICEL.PLAN_WILL_END;

		// 유료플랜 이용중 기본 메시지
		const lineNotice = LINE_NOTICE.CHARGED_GROUP_PLAN;
		return {
			...lineNotice,
			content: replaceLineNotice(
				lineNotice.content,
				parsedPlanExpireDate,
				leftDays,
				nowPlan?.planName,
				nextPlan?.planName,
				downgradePlan?.planName
			),
		};
	}, [userPlan, planList]);

	return (
		<LineNotice
			color={lineNoticeData?.color || 'primary'}
			content={lineNoticeData?.content || ''}
			sx={{
				marginTop: '12px',
			}}
		/>
	);
}

export default SubscribeLineNotice;
