import {Payment} from './payment';

export interface PaymentRepository {
	savePayment: (payment: Payment | Payment[]) => Promise<void>;
	findByKey: (key: string) => Promise<Payment | null>;
	findByKeys: (keys: string[]) => Promise<Payment[]>;
	findByOrderId: (id: string) => Promise<Payment | null>;
}
