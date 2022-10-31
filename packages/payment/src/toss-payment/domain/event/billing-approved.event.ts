import {IEvent} from '@nestjs/cqrs';
import {DateTime} from 'luxon';
import {Currency, PaymentProps, PaymentType} from '../payment';

export class BillingApprovedEvent implements IEvent, PaymentProps {
	readonly paymentKey: string;
	readonly totalAmount: number;
	readonly currency: Currency;
	readonly type: PaymentType;
	readonly orderId: string;
	readonly orderName: string;
	readonly requestedAt: DateTime;
	readonly useEscrow: boolean;
	readonly vat: number;
	readonly canceledAt: DateTime | null;
	readonly approvedAt: DateTime | null;
}
