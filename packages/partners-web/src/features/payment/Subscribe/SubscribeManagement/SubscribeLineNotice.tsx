import {useMemo} from 'react';
import {differenceInCalendarDays, format} from 'date-fns';

import {Typography} from '@mui/material';

import {useGetUserPricePlan, useGetPricePlanList} from '@/stores/payment.store';
import {checkSubscribeNoticeStatus} from '@/data';

import {LineNotice} from '@/components';
import {SubscribeLineNoticeKey, UserPricePlanWithDate} from '@/@types';

type LineNoticeValue = {
	content: LineNoticeContent;
	color: 'green' | 'red' | 'primary';
};
type LineNoticeContent = string | [string, React.ReactNode];
type LineNotice = {
	[key in SubscribeLineNoticeKey]: LineNoticeValue;
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
	CHARGED: {
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
	data: {
		expiredDate?: Date;
		leftDays?: number;
		planName?: string;
		upgradePlanName?: string;
		downgradePlanName?: string;
	}
): LineNoticeContent => {
	let replacedContent = Array.isArray(content) ? content[0] : content;
	const {
		expiredDate,
		leftDays,
		planName,
		upgradePlanName,
		downgradePlanName,
	} = data;
	const parsedDate = expiredDate && {
		year: format(expiredDate, 'yyyy'),
		month: format(expiredDate, 'M'),
		date: format(expiredDate, 'd'),
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
			pricePlan,
			planStartDate,
			planExpireDate,
			nextPricePlan,
			nextPlanStartDate,
			usedNftCount,
		} = userPlan;
		const {planLimit} = pricePlan;
		const leftDays =
			differenceInCalendarDays(planExpireDate, new Date()) + 1;

		const subscribeStatus = checkSubscribeNoticeStatus(userPlan);

		// trial
		if (subscribeStatus === 'TRIAL') {
			if (leftDays <= 0) {
				return LINE_NOTICE.TRIAL_FINISHED;
			}
			if (leftDays <= 10) {
				const lineNotice = LINE_NOTICE.TRIAL_ALMOST_FINISH;
				const replacedContent = replaceLineNotice(lineNotice.content, {
					expiredDate: planExpireDate,
					leftDays,
				});
				return {
					...lineNotice,
					content: (
						<>
							<Typography
								component="div"
								variant="caption1"
								fontWeight="bold">
								{replacedContent[0]}
							</Typography>
							{replacedContent[1]}
						</>
					),
				};
			}
			const lineNotice = LINE_NOTICE.TRIAL;
			return {
				...lineNotice,
				content: replaceLineNotice(lineNotice.content, {
					expiredDate: planExpireDate,
				}),
			};
		}

		// 유료플랜
		// 다음 플랜 예정
		if (nextPricePlan) {
			if (subscribeStatus === 'CHANGE_PLAN_MONTH_TO_YEAR') {
				const lineNotice = LINE_NOTICE.CHANGE_PLAN_MONTH_TO_YEAR;
				return {
					...lineNotice,
					content: replaceLineNotice(lineNotice.content, {
						expiredDate: nextPlanStartDate,
					}),
				};
			}
			if (subscribeStatus === 'CHANGE_PLAN_YEAR_TO_MONTH') {
				const lineNotice = LINE_NOTICE.CHANGE_PLAN_YEAR_TO_MONTH;
				return {
					...lineNotice,
					content: replaceLineNotice(lineNotice.content, {
						expiredDate: planStartDate,
						planName: pricePlan.planName,
						downgradePlanName: nextPricePlan.planName,
					}),
				};
			}
			if (subscribeStatus === 'CHANGE_PLAN_UPGRADE') {
				const lineNotice = LINE_NOTICE.CHANGE_PLAN_UPGRADE;
				return {
					...lineNotice,
					content: replaceLineNotice(lineNotice.content, {
						expiredDate: nextPlanStartDate,
						upgradePlanName: nextPricePlan.planName,
					}),
				};
			}
			if (subscribeStatus === 'CHANGE_PLAN_DOWNGRADE_MONTHLY') {
				const lineNotice = LINE_NOTICE.CHANGE_PLAN_DOWNGRADE_MONTHLY;
				return {
					...lineNotice,
					content: replaceLineNotice(lineNotice.content, {
						expiredDate: planStartDate,
						planName: pricePlan.planName,
						upgradePlanName: nextPricePlan.planName,
					}),
				};
			}
		}

		// TODO: 엔터프라이즈 사용한다면?
		const upgradePlanName =
			planList.find(
				(plan) =>
					plan.planLevel === pricePlan.planLevel + 1 &&
					plan.planType === pricePlan.planType
			)?.planName || '';

		// 개런티 부족
		if (planLimit - usedNftCount < Math.ceil(planLimit * 0.3)) {
			const lineNotice = LINE_NOTICE.LACKING_GUARANTEE;
			return {
				...lineNotice,
				content: replaceLineNotice(lineNotice.content, {
					upgradePlanName,
				}),
			};
		}

		// 유료플랜 기본 메시지
		const lineNotice = LINE_NOTICE.CHARGED;
		return {
			...lineNotice,
			content: replaceLineNotice(lineNotice.content, {
				upgradePlanName,
			}),
		};

		// TODO: 플랜 종료 예정
		// return LINE_NOTICEL.PLAN_WILL_END;
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
