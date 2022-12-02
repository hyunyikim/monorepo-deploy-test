import {IEvent} from '@nestjs/cqrs';
import {PaymentProps} from '../payment';

export class PaymentCanceledEvent implements IEvent {
	readonly payment: PaymentProps;
}
