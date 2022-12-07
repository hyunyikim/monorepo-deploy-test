import {Payment} from './payment';
import {Billing, PricePlan} from './billing';

export interface PaymentRepository {
	savePayment: (payment: Payment) => Promise<void>;
	findByKey: (key: string) => Promise<Payment | null>;
	findByKeys: (keys: string[]) => Promise<Payment[]>;
	findByOrderId: (id: string) => Promise<Payment | null>;
}

export interface BillingRepository {
	saveBilling: (billing: Billing) => Promise<void>;
	findByKey: (billingKey: string) => Promise<Billing | null>;
	findByCustomerKey: (customerKey: string) => Promise<Billing | null>;
}

export interface PlanRepository {
	getAll: (activated: boolean) => Promise<PricePlan[]>;
	findByPlanId: (planId: string) => Promise<PricePlan | null>;
}
