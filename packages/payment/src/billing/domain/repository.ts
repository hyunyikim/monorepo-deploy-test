import {Payment} from './payment';
import {Billing} from './billing';
import {PricePlanProps} from './pricePlan';
import {PAYMENT_STATUS, PLAN_TYPE} from '../infrastructure/api-client';

export interface PaymentRepository {
	savePayment: (payment: Payment) => Promise<void>;
	findByKey: (key: string) => Promise<Payment | null>;
	findByKeys: (keys: string[]) => Promise<Payment[]>;
	findByOrderId: (id: string) => Promise<Payment | null>;
	search: (
		partnerIdx: number,
		status: PAYMENT_STATUS,
		sort: 'ASC' | 'DESC',
		page: number,
		pageSize: number
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
		planType?: PLAN_TYPE
	) => Promise<PricePlanProps[]>;
	findByPlanId: (planId: string) => Promise<PricePlanProps | null>;
	findFreePlan: (planType?: PLAN_TYPE) => Promise<PricePlanProps | null>;
	findEnterprisePlan: () => Promise<PricePlanProps | null>;
}
