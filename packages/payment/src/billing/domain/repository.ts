import {Payment} from './payment';
import {Billing, PricePlan} from './billing';

export interface PaymentRepository {
	savePayment: (payment: Payment) => Promise<void>;
	findByKey: (key: string) => Promise<Payment | null>;
	findByKeys: (keys: string[]) => Promise<Payment[]>;
	findByOrderId: (id: string) => Promise<Payment | null>;
	search: (
		key: string,
		range: {startAt: Date; endAt: Date}
	) => Promise<Payment[]>;
}

export interface BillingRepository {
	getAll: (registered: boolean) => Promise<Billing[]>;
	saveBilling: (billing: Billing) => Promise<void>;
	findByKey: (billingKey: string) => Promise<Billing | null>;
	findByCustomerKey: (customerKey: string) => Promise<Billing | null>;
}

export interface PlanRepository {
	getAll: (activated: boolean) => Promise<PricePlan[]>;
	findByPlanId: (planId: string) => Promise<PricePlan | null>;
}
