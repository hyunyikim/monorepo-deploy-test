import {Link} from '@mui/material';

import {OnOpenParamType, PlanType, PricePlan, UserPricePlan} from '@/@types';

export const pricePlanExample: PricePlan[] = [
	{
		planId: '1',
		planName: '엑스 스몰',
		planPrice: 50000,
		discountRage: 10,
		displayPrice: 50000,
		vat: 1000,
		totalPrice: 50000,
		planLimit: 250,
		planType: 'MONTH',
		planLevel: 1,
	},
	{
		planId: '2',
		planName: '스몰',
		planPrice: 100000,
		discountRage: 10,
		displayPrice: 100000,
		vat: 1000,
		totalPrice: 100000,
		planLimit: 500,
		planType: 'MONTH',
		planLevel: 2,
	},
	{
		planId: '3',
		planName: '미디엄',
		planPrice: 150000,
		discountRage: 10,
		displayPrice: 150000,
		vat: 1000,
		totalPrice: 150000,
		planLimit: 750,
		planType: 'MONTH',
		planLevel: 3,
	},
	{
		planId: '4',
		planName: '라지',
		planPrice: 200000,
		discountRage: 10,
		displayPrice: 200000,
		vat: 1000,
		totalPrice: 200000,
		planLimit: 1000,
		planType: 'MONTH',
		planLevel: 4,
	},
	{
		planId: '5',
		planName: '엔터프라이즈',
		planPrice: 0,
		discountRage: 0,
		displayPrice: 0,
		vat: 0,
		totalPrice: 0,
		planLimit: 0,
		planType: 'MONTH',
		planLevel: 5,
	},
	{
		planId: '6',
		planName: '엑스 스몰',
		planPrice: 50000,
		discountRage: 10,
		displayPrice: 50000,
		vat: 1000,
		totalPrice: 50000,
		planLimit: 250,
		planType: 'YEAR',
		planLevel: 1,
	},
	{
		planId: '7',
		planName: '스몰',
		planPrice: 100000,
		discountRage: 10,
		displayPrice: 100000,
		vat: 1000,
		totalPrice: 100000,
		planLimit: 500,
		planType: 'YEAR',
		planLevel: 2,
	},
	{
		planId: '8',
		planName: '미디엄',
		planPrice: 150000,
		discountRage: 10,
		displayPrice: 150000,
		vat: 1000,
		totalPrice: 150000,
		planLimit: 750,
		planType: 'YEAR',
		planLevel: 3,
	},
	{
		planId: '9',
		planName: '라지',
		planPrice: 200000,
		discountRage: 10,
		displayPrice: 200000,
		vat: 1000,
		totalPrice: 200000,
		planLimit: 1000,
		planType: 'YEAR',
		planLevel: 4,
	},
	{
		planId: '10',
		planName: '엔터프라이즈',
		planPrice: 0,
		discountRage: 0,
		displayPrice: 0,
		vat: 0,
		totalPrice: 0,
		planLimit: 0,
		planType: 'YEAR',
		planLevel: 5,
	},
];

export const userPricePlanExample: UserPricePlan = {
	payPlanName: '무료 플랜',
	payPlanId: 'FREE_TRIAL',
	payPlanExpireDate: '2023-03-30',
	payPlanLimit: 100,
	usedNftCount: 10,
	// payPlanName: '엑스스몰',
	// payPlanId: '6',
	// payPlanExpireDate: '2023-01-30',
	// payPlanLimit: 100,
	// usedNftCount: 10,
};

export const DEFAULT_PLAN_TYPE: PlanType = 'YEAR';

export const TRIAL_PLAN = {
	PLAN_ID: 'FREE_TRIAL',
	PLAN_DESCRIPTION:
		'30일 동안 버클의 핵심기능들을 부담없이 무료로 이용해보세요!',
};

export const CHARGED_GROUP_PLAN = {
	PLAN_NAME: '유료 플랜',
	PLAN_DESCRIPTION:
		'마케팅, 사후관리, 브랜딩을 통해 충성고객을 확보할 수 있어요.',
};

export const getChargedPlanDescription = (planLimit: number) =>
	`개런티 발급량 ${planLimit}개`;

type PaymentMessageModalKey =
	// | 'CANCEL_PLAN_UPGRADE'
	| 'CANCEL_SUBSCRIBE'
	| 'CHANGE_PLAN_YEAR_TO_MONTH'
	| 'CHANGE_PLAN_MONTH_TO_YEAR'
	| 'MONTH_PLAN_DOWNGRADE'
	| 'BAN_DOWNGRADE_YEAR_PLAN';
type PaymentMessageModalType = {
	[key in PaymentMessageModalKey]: OnOpenParamType;
};

export const PAYMENT_MESSAGE_MODAL: PaymentMessageModalType = {
	// CANCEL_PLAN_UPGRADE: {
	// 	title: '플랜 업그레이드를 취소할까요?',
	// 	showBottomCloseButton: true,
	// 	closeButtonValue: '아니오',
	// },
	CANCEL_SUBSCRIBE: {
		title: '정말 구독을 취소하시겠어요?',
		message: `지금 구독 취소하시면 yyyy년 M월 YY일까지 이용 가능하고, 그 이후부터 개런티 발급이 제한됩니다. 계속 하시겠어요?`,
		showBottomCloseButton: true,
		closeButtonValue: '취소',
	},
	CHANGE_PLAN_YEAR_TO_MONTH: {
		title: '연결제를 월결제로 변경하시나요?',
		message: (
			<>
				연결제 이용시 월결제로 변경 할 경우에는 연결제가 끝나는 다음
				결제일부터 월결제 요금이 결제됩니다. 자세한 사항은{' '}
				<Link
					sx={{
						color: 'grey.600',
						textDecorationColor: (theme) => theme.palette.grey[600],
					}}
					className="cursor-pointer">
					구독가이드
				</Link>
				를 참고해주세요.
			</>
		),
		showBottomCloseButton: true,
		closeButtonValue: '취소',
	},
	CHANGE_PLAN_MONTH_TO_YEAR: {
		title: '월결제를 연결제로 변경하시나요?',
		message: (
			<>
				월결제를 연결제로 변경 할 경우에는 월결제가 끝나는 다음달
				결제일에 연결제 요금이 결제됩니다. 자세한 사항은{' '}
				<Link
					sx={{
						color: 'grey.600',
						textDecorationColor: (theme) => theme.palette.grey[600],
					}}
					className="cursor-pointer">
					구독가이드
				</Link>
				를 참고해주세요.
			</>
		),
		showBottomCloseButton: true,
		closeButtonValue: '취소',
	},
	MONTH_PLAN_DOWNGRADE: {
		title: '정말 플랜을 다운그레이드 하시겠어요?',
		message: (
			<>
				플랜 다운그레이드 변경시 구독 기간이 끝난 후 다음달 결제일부터
				다운그레이드 된 플랜의 요금제가 적용됩니다.
			</>
		),
		showBottomCloseButton: true,
		closeButtonValue: '취소',
	},
	BAN_DOWNGRADE_YEAR_PLAN: {
		title: '이미 연결제로 플랜을 구독중이시네요',
		message: (
			<>
				연결제로 플랜을 구독중 플랜의 다운그레이드는 현재 지원하지 않고,
				<Link
					sx={{
						color: 'grey.600',
						textDecorationColor: (theme) => theme.palette.grey[600],
					}}
					className="cursor-pointer">
					고객센터
				</Link>
				로 문의 주시면 버클팀에서 확인 후 이용중이시던 플랜의 구독
				취소를 도와드립니다. (단, 위약금 규정에 따라 위약금을 공제 후
				차액을 환불해드립니다.)
			</>
		),
		showBottomCloseButton: true,
		closeButtonValue: '확인',
	},
};
