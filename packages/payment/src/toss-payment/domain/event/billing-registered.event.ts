import {IEvent} from '@nestjs/cqrs';
import {BillingProps, Card} from '../billing';

export class BillingRegisteredEvent implements IEvent, BillingProps {
	mId: string;
	method: string;
	authenticatedAt: string;
	customerKey: string;
	billingKey: string;
	card: Card;
}
