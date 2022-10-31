import {AggregateRoot} from '@nestjs/cqrs';
import {DateTime} from 'luxon';
import {stringify} from 'querystring';
import {BillingApprovedEvent} from './event/billing-approved.event';
import {BillingRegisteredEvent} from './event/billing-registered.event';
import {PaymentCanceledEvent} from './event/payment-canceled.event';
import {PaymentConfirmedEvent} from './event/payment-confirmed.event';
import {PaymentProps} from './payment';

export enum CardType {
	CREDIT = '신용',
	CHECK = '체크',
	GIFT = '기프트',
}

export enum OwnerType {
	PERSONAL = '개인',
	COOPERATION = '법인',
}

export type Card = {
	company: string;
	number: string;
	cardType: CardType; //신용, 체크, 기프트
	ownerType: OwnerType;
};

export type BillingProps = {
	mId: string;
	customerKey: string;
	authenticatedAt: string; // yyyy-MM-dd
	method: string; // 카드 고정
	billingKey: string;
	card: Card;
};

export interface Billing {
	properties: () => BillingProps;
	register: () => void;
	approve: (payment: PaymentProps) => void;
	commit: () => void;
}

export class PlanBilling extends AggregateRoot implements Billing {
	private mId: string;
	private customerKey: string;
	private authenticatedAt: string; // yyyy-MM-dd
	private method: string; // 카드 고정
	private billingKey: string;
	private card: Card;

	constructor(props: BillingProps) {
		super();
		Object.assign(this, props);
	}

	properties(): BillingProps {
		return {
			mId: this.mId,
			customerKey: this.customerKey,
			authenticatedAt: this.authenticatedAt,
			method: this.method,
			billingKey: this.billingKey,
			card: this.card,
		};
	}

	register(): void {
		this.apply(Object.assign(new BillingRegisteredEvent(), this));
	}

	approve(payment: PaymentProps): void {
		this.apply(Object.assign(new BillingApprovedEvent(), payment));
	}
}
