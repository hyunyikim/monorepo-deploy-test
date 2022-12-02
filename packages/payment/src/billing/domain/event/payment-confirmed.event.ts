import {IEvent} from '@nestjs/cqrs';
import {PaymentProps} from '../payment';

export class PaymentConfirmedEvent implements IEvent {
	readonly payment: PaymentProps;
}
