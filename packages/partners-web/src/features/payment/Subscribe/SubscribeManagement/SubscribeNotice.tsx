import {useMemo} from 'react';
import {Stack, Theme, Typography, Link} from '@mui/material';
import {SxProps} from '@mui/system';

import {SubscribeNoticeKey, UserPricePlanWithDate} from '@/@types';
import {checkSubscribeNoticeStatus} from '@/data';
import {useGetUserPricePlan, useGetPricePlanList} from '@/stores/payment.store';

type SubscribeNoticeType = {
	[key in SubscribeNoticeKey]: React.ReactNode;
};

export const SUBSCRIBE_NOTICE: SubscribeNoticeType = {
	TRIAL: (
		<>
			<Stack>
				<Typography variant="subtitle2">
					유료 플랜을 구독하면
					<br />
					어떤 기능을 이용할 수 있나요?
				</Typography>
				<ul>
					<li>나만의 개런티 디자인</li>
					<li>고객별/상품별 데이터 분류</li>
					<li>고객 사후관리</li>
					<li>기술안내 문서 제공</li>
				</ul>
			</Stack>
			<Link href="">요금제 안내페이지 보기</Link>
		</>
	),
	CHARGED: (
		<>
			<Stack>
				<Typography variant="subtitle2">
					발급량으로 플랜을 어떻게 정하나요?
				</Typography>
				<Typography fontSize={13}>
					고객이 브랜드(기업)에서 상품을 구매할 경우, 해당 상품에 대한
					디지털 개런티를 고객에게 발급할 수 있습니다. 발급량은 요금제
					별로 디지털 개런티를 발급이 가능한 수를 의미합니다. 요금제를
					선택할때에는 브랜드(기업)의 평균적으로 판매량을 고려해
					선택해 보세요.
				</Typography>
			</Stack>
			<Link href="">요금제 안내페이지 보기</Link>
		</>
	),
	USING_MONTH: (
		<>
			<Stack>
				<Typography variant="subtitle2">
					월 결제를 이용중이신가요?
				</Typography>
				<Typography fontSize={13} color="grey.900">
					연 결제를 이용하면 같은 플랜의 기능들을
					<br />
					20% 할인 된 가격으로 이용 할 수 있어요!
				</Typography>
			</Stack>
			<Link href="">결제 가이드 보기</Link>
		</>
	),
	CHANGE_PLAN_MONTH_TO_YEAR: (
		<>
			<Stack>
				<Typography variant="subtitle2">
					월결제를 연결제로 변경하시나요?
				</Typography>
				<Typography fontSize={13}>
					월결제를 연결제로 변경 하는 경우, 월결제가 끝난 다음달
					결제일에 연결제 요금이 결제됩니다.
					<br />
					<b>(*변경된 플랜도 다음 결제일부터 시작됩니다. )</b>
					<br />
					자세한 사항은 아래 구독 가이드를 참고해주세요.
				</Typography>
			</Stack>
			<Link href="">구독가이드 보기</Link>
		</>
	),
	CHANGE_PLAN_YEAR_TO_MONTH: (
		<>
			<Stack>
				<Typography variant="subtitle2">
					연결제를 월결제로 변경하시나요?
				</Typography>
				<Typography fontSize={13}>
					연결제 이용 시 월결제로 변경 할 경우에는 연결제가 끝나는
					다음 결제일에 월결제 요금이 결제되며, 자세한 사항은 아래
					<Link>구독가이드</Link>를 참고해주세요. (단, 월 요금제로
					바로 변경을 원하신다면 <Link>고객센터</Link>로 문의 주시기
					바랍니다.)
				</Typography>
			</Stack>
			<Link href="">구독가이드 보기</Link>
		</>
	),
	CHANGE_PLAN_UPGRADE: (
		<>
			<Stack>
				<Typography variant="subtitle2">
					플랜을 변경 하면 결제일이 바뀌나요?
				</Typography>
				<Typography
					variant="caption1"
					fontWeight="bold"
					color="grey.600">
					플랜 요금제 변경시 결제완료 시점에 플랜이 즉시 변경되며,
					업그레이드 한 날짜로 결제일이 변경됩니다.
				</Typography>
			</Stack>
			<Link href="">결제 가이드 보기</Link>
		</>
	),
	CHANGE_PLAN_DOWNGRADE_MONTHLY: (
		<>
			<Stack>
				<Typography variant="subtitle2">
					플랜을 다운그레이드 하시나요?
				</Typography>
				<Typography>
					현재 플랜의 다운그레이드는 <b>월결제 이용시에만 가능</b>
					하며, 변경시 다음달 결제일부터 새로운 플랜이 적용됩니다.
					(연결제 이용 고객께서 다운그레이드가 필요할 경우,
					<Link>고객센터</Link>로 문의해주세요.)
				</Typography>
			</Stack>
			<Link href="">구독가이드 보기</Link>
		</>
	),
};

interface Props {
	sx?: SxProps<Theme>;
}

function SubscribeNotice({sx = {}}: Props) {
	const {data: userPlan} = useGetUserPricePlan();
	const {data: planList} = useGetPricePlanList();

	const SubscribeNoticeComponent = useMemo(() => {
		if (!userPlan || !planList) return;

		const {
			pricePlan,
			planStartDate,
			planExpireDate,
			nextPricePlan,
			nextPlanStartDate,
		} = userPlan;

		const subscribeNoticeStatus = checkSubscribeNoticeStatus(userPlan);

		// TODO: or 아예 종료 되었거나
		if (subscribeNoticeStatus === 'TRIAL') {
			return SUBSCRIBE_NOTICE.TRIAL;
		}

		// 유료플랜
		if (nextPricePlan) {
			if (subscribeNoticeStatus === 'CHANGE_PLAN_MONTH_TO_YEAR') {
				return SUBSCRIBE_NOTICE.CHANGE_PLAN_MONTH_TO_YEAR;
			}
			if (subscribeNoticeStatus === 'CHANGE_PLAN_YEAR_TO_MONTH') {
				return SUBSCRIBE_NOTICE.CHANGE_PLAN_YEAR_TO_MONTH;
			}
			if (subscribeNoticeStatus === 'CHANGE_PLAN_UPGRADE') {
				return SUBSCRIBE_NOTICE.CHANGE_PLAN_UPGRADE;
			}
			if (subscribeNoticeStatus === 'CHANGE_PLAN_DOWNGRADE_MONTHLY') {
				return SUBSCRIBE_NOTICE.CHANGE_PLAN_DOWNGRADE_MONTHLY;
			}
		}
		if (pricePlan.planType === 'MONTH') {
			return SUBSCRIBE_NOTICE.USING_MONTH;
		}
		return SUBSCRIBE_NOTICE.CHARGED;
	}, [userPlan, planList]);

	return (
		<Stack
			sx={[
				{
					justifyContent: 'space-between',
					backgroundColor: 'primary.50',
					border: (theme) =>
						`1px solid ${theme.palette.primary[100] as string}`,
					borderRadius: '8px',
					padding: 3,
					maxWidth: '346px',
					minHeight: '240px',
					'& .MuiTypography-subtitle2': {
						marginBottom: '16px',
					},
					'& ul': {
						margin: 0,
						paddingLeft: '16px',
						'& li': {
							fontSize: 13,
						},
						'& li::marker': {
							fontSize: '10px',
						},
					},
					'& .MuiLink-root': {
						fontSize: 14,
						fontWeight: 700,
					},
				},
				...(Array.isArray(sx) ? sx : [sx]),
			]}>
			{SubscribeNoticeComponent && SubscribeNoticeComponent}
		</Stack>
	);
}

export default SubscribeNotice;
