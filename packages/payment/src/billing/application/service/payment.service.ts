import {Inject, Injectable} from '@nestjs/common';
import {CommandBus} from '@nestjs/cqrs';
import {PaymentRepository} from 'src/billing/domain/repository';
import {PlanPaymentRepository} from 'src/billing/infrastructure/respository/payment.repository';
import {Billing} from '../../domain/billing';

@Injectable()
export class RegularPaymentService {
	constructor(private readonly commandBus: CommandBus) {}

	createPayment(billing: Billing) {
		const props = billing.properties();
	}
}
