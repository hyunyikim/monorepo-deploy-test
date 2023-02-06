export type SubscribeNoticeStatus =
	| 'TRIAL'
	| 'CHANGE_PLAN_MONTH_TO_YEAR'
	| 'CHANGE_PLAN_YEAR_TO_MONTH'
	| 'CHANGE_PLAN_DOWNGRADE_MONTHLY'
	| 'CHARGED_PLAN_FINISHED';

export type SubscribeLineNoticeKey =
	| SubscribeNoticeStatus
	| 'TRIAL_ALMOST_FINISH'
	| 'TRIAL_FINISHED'
	| 'LACKING_GUARANTEE'
	| 'PLAN_WILL_END';

export type SubscribeNoticeKey =
	| Exclude<SubscribeNoticeStatus, 'CHARGED_PLAN_FINISHED'>
	| 'USING_MONTH'
	| 'CHARGED';

export interface TotalSubscribeInfoPreviewData {
	data: SubscribeInfoPreviewData;
	canceledData?: SubscribeInfoPreviewData;
	totalPaidPrice?: number;
}

export interface SubscribeInfoPreviewData {
	planName: string;
	displayTotalPrice: number; // 표기가격
	planTotalPrice: number; // 정상가
	discountTotalPrice?: number; // 할인가(연결제만 표기)
	totalPrice: number; // 구독료
	subscribeDuration: string; // 구독 기간
	payApprovedAt?: string; // 결제일
}
