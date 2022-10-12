import {Inject} from '@nestjs/common';
import {PaymentFactory} from 'src/toss-payment/domain/factory';
import {PaymentRepository} from 'src/toss-payment/domain/repository';
import {Repository, EntityManager} from 'typeorm';
import {InjectEntityManager} from '@nestjs/typeorm';
import {PlanPaymentEntity} from './entity';
import {Payment} from 'src/toss-payment/domain/payment';

export class PlanPaymentRepository
	extends Repository<PlanPaymentEntity>
	implements PaymentRepository
{
	constructor(
		@Inject(PaymentFactory) private readonly paymentFactory: PaymentFactory,
		@InjectEntityManager() private readonly entityManager: EntityManager
	) {
		super(PlanPaymentEntity, entityManager);
	}

	async savePayment(payment: Payment | Payment[]): Promise<void> {
		return await Promise.resolve<void>(undefined);
	}

	async findByKey(key: string): Promise<Payment | null> {
		return await Promise.resolve<null>(null);
	}

	async findByKeys(keys: string[]): Promise<Payment[]> {
		return await Promise.resolve<Payment[]>([]);
	}
	async findByOrderId(id: string): Promise<Payment | null> {
		return await Promise.resolve<null>(null);
	}
}
