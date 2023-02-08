import {AggregateRoot} from '@nestjs/cqrs';
import {PaymentCanceledEvent, PaymentConfirmedEvent} from './event';
import {Payment as TossPayment} from '../infrastructure/api-client';
import {DateTime} from 'luxon';
import {PricePlanProps} from './pricePlan';

/**
 * 결제 속성
 */
export type PaymentProps = Omit<TossPayment, 'version'> & {
	partnerIdx: number;
	pricePlan: PricePlanProps;
	canceledPricePlan?: PricePlanProps;
	expiredAt?: string;
	failMessage?: string;
};

/**
 * 결제 인터페이스
 */
export interface Payment {
	properties: () => PaymentProps;
	confirm: (props: PaymentProps) => void;
	expire: () => void;
	cancel: (props: PaymentProps) => void;
	commit: () => void;
}

/**
 * 결제내역
 * 실제 PG사로 결제가 발생한 내역을 담고 있는 객체
 */
export class PlanPayment extends AggregateRoot implements Payment {
	private readonly partnerIdx: number;
	private readonly pricePlan: PricePlanProps;
	private readonly canceledPricePlan?: PricePlanProps;
	private expiredAt?: string;
	private failMessage?: string;

	constructor(private props: PaymentProps) {
		super();
		Object.assign(this, props);
	}

	properties(): PaymentProps {
		return {
			...this.props,
			partnerIdx: this.partnerIdx,
			pricePlan: this.pricePlan,
			canceledPricePlan: this.canceledPricePlan,
			expiredAt: this.expiredAt,
			failMessage: this.failMessage,
		};
	}

	/**
	 * 결제 확인
	 * @param paymentProps
	 */
	confirm(paymentProps: PaymentProps): void {
		this.apply(Object.assign(new PaymentConfirmedEvent(), this));
	}

	/**
	 * 결제 종료
	 */
	expire(): void {
		this.expiredAt = DateTime.now().toISO();
	}

	/**
	 * 결제 취소
	 * @param paymentProps
	 */
	cancel(paymentProps: PaymentProps): void {
		this.apply(Object.assign(new PaymentCanceledEvent(), this));
	}
}
