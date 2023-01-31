import {Payment} from './payment';
import {Billing} from './billing';
import {PricePlanProps} from './pricePlan';

export interface PaymentRepository {
	savePayment: (payment: Payment) => Promise<void>;
	findByKey: (key: string) => Promise<Payment | null>;
	findByKeys: (keys: string[]) => Promise<Payment[]>;
	findByOrderId: (id: string) => Promise<Payment | null>;
	search: (
		partnerIdx: number,
		sort: 'ASC' | 'DESC',
		page: number,
		pageSize: number,
		range?: {startAt: Date; endAt: Date}
	) => Promise<{
		total: number;
		data: Payment[];
	}>;
}

export interface BillingRepository {
	getAll: (registered: boolean) => Promise<Billing[]>;
	saveBilling: (billing: Billing) => Promise<void>;
	findByKey: (billingKey: string) => Promise<Billing | null>;
	findByCustomerKey: (customerKey: string) => Promise<Billing | null>;
	findByPartnerIdx: (partnerIdx: number) => Promise<Billing | null>;
}

export interface PlanRepository {
	getAll: (
		activated: boolean,
		planType?: 'YEAR' | 'MONTH'
	) => Promise<PricePlanProps[]>;
	findByPlanId: (planId: string) => Promise<PricePlanProps | null>;
	findFreePlan: (
		planType?: 'YEAR' | 'MONTH'
	) => Promise<PricePlanProps | null>;
}
