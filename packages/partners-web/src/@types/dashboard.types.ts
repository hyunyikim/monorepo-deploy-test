/* 공통 */
export type DashboardPeriodType = 'WEEKLY' | 'MONTHLY';

/* 개런티 관련 */

export interface DashboardGuranteeParamsType {
	dateType: DashboardPeriodType;
}
export interface DashboardCustomersParamsType {
	from: string;
	to: string;
}
export interface DashboardIssuedGuranteeOverviewType {
	issuedGraph: any;
	issueStatusCount: any;
	issuedFrom: any;
}

/* 고객관련 타입 */
export interface TopIssuedCustomerOverviewType {
	name: string;
	issued?: string;
	tel?: string;
	// paid?: string;
}
export interface TopPaidCustomerOverviewType {
	name: string;
	paid?: string;
	tel?: string;
	// issued?: string;
}

export interface DashboardCustomerOverviewType {
	topIssued: TopIssuedCustomerOverviewType[];
	topPaid: TopPaidCustomerOverviewType[];
	vip: number;
}

/* 수선관련 타입 */
export interface DashboardRepairOverviewType {
	ready: number;
	complete: number;
	cancel: number;
}

/* 월렛 링크 관련 타입 */

export interface DashboardWalletOverviewType {
	confirmCount: number;
	linked: number;
	viewCount: number;
	lastConfirmCount: number;
	lastViewCount: number;
	lastLinked: number;
	rate: number;
}
