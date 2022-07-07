import {
	Entity,
	PrimaryGeneratedColumn,
	Index,
	ManyToOne,
	Column,
	JoinColumn,
	CreateDateColumn,
} from 'typeorm';
import {Admin} from './admin.entity';
import {CURRENCY, CREDIT_EVENT, ORDER_STATUS, PAYMENT_METHOD} from './enums';
import {Nft} from './nft.entity';

@Entity({name: 'TB_CREDIT_PLAN'})
export class CreditPlan {
	@PrimaryGeneratedColumn({name: 'plan_idx', type: 'int', unsigned: true})
	idx: number;

	@Column({name: 'plan_uuid', type: 'char', length: 32})
	uuid: string;

	@Column({name: 'plan_name', type: 'varchar', length: 128})
	name: string;

	@Column({name: 'credit', type: 'int', unsigned: true})
	credit: number;

	@Column({name: 'amount', type: 'int', unsigned: true})
	amount: number;

	@Column({name: 'currency', enum: CURRENCY})
	currency: CURRENCY;

	@CreateDateColumn({name: 'registered_dt', type: 'datetime'})
	registeredAt: Date;

	@Column({name: 'deprecated_dt', type: 'datetime', nullable: true})
	deprecated: Date | null;

	@Column({name: 'registrant_idx', type: 'int', unsigned: true})
	registrantIdx: string;

	@ManyToOne(() => Admin, {createForeignKeyConstraints: false, eager: false})
	registrant: Promise<Admin>;
}

@Entity({name: 'TB_CREDIT_ORDER'})
export class CreditOrder {
	@PrimaryGeneratedColumn({name: 'order_idx', type: 'int', unsigned: true})
	idx: number;

	@Column({name: 'order_uuid', type: 'char', length: 32})
	uuid: string;

	@Index()
	@Column({name: 'orderer_idx', type: 'int', unsigned: true})
	ordererIdx: string;

	@CreateDateColumn({name: 'ordered_dt', type: 'datetime'})
	orderedAt: Date;

	@Column({name: 'canceled_dt', type: 'datetime', nullable: true})
	canceledAt: Date | null;

	@Column({name: 'cancel_request_dt', type: 'datetime', nullable: true})
	cancelRequestedAt: Date | null;

	/** tosspayments payment-key */
	@Column({name: 'payment_key', type: 'varchar'})
	paymentKey: string;

	/** tosspayments payment-key */
	@Column({name: 'payment_method', enum: PAYMENT_METHOD})
	paymentMethod: PAYMENT_METHOD;

	@Column({name: 'credit_plan_idx', type: 'int', unsigned: true})
	creditPlanIdx: number;

	@Column({name: 'status', enum: ORDER_STATUS})
	status: ORDER_STATUS;

	@ManyToOne(() => CreditPlan, {
		createForeignKeyConstraints: false,
		eager: true,
	})
	@JoinColumn({name: 'credit_plan_idx'})
	creditPlan: CreditPlan;

	@ManyToOne(() => Admin, {createForeignKeyConstraints: false, eager: false})
	@JoinColumn({name: 'orderer_idx'})
	orderer: Promise<Admin>;
}

@Entity({name: 'TB_CREDIT_HISTORY'})
export class CreditHistory {
	@PrimaryGeneratedColumn({name: 'history_idx', type: 'int', unsigned: true})
	idx: number;

	@Index()
	@Column({name: 'partnership_idx', type: 'int', unsigned: true})
	partnershipIdx: string;

	@CreateDateColumn({name: 'occurred_dt', type: 'datetime'})
	occurredAt: Date;

	/** 이벤트 종류 */
	@Column({name: 'event', enum: CREDIT_EVENT})
	event: CREDIT_EVENT;

	/** 변동된 크레딧의 양 */
	@Column({name: 'amount', type: 'int'})
	amount: number;

	/** 잔여 크레딧 */
	@Column({name: 'balance', type: 'int', unsigned: true})
	balance: number;

	/** nft 발급신청 idx, nft 발급 신청을 했을경우만 값이 있음 */
	@Column({name: 'nft_req_idx', type: 'int', unsigned: true, nullable: true})
	nftReqIdx: number | null;

	/** 크레딧 충전 또는 환불 주문 idx, 충전,환불 경우에만 있음 */
	@Column({name: 'order_idx', type: 'int', unsigned: true, nullable: true})
	orderIdx: number | null;

	@ManyToOne(() => Nft, {createForeignKeyConstraints: false, eager: false})
	@JoinColumn({name: 'nft_req_idx'})
	refNftReq: Promise<Nft>;

	@ManyToOne(() => CreditOrder, {
		createForeignKeyConstraints: false,
		eager: false,
	})
	@JoinColumn({name: 'order_idx'})
	refCreditOrder: Promise<CreditOrder>;
}
