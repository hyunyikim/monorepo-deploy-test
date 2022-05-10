import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import {Product} from './product.entity';

export enum PAY_TYPE {
	ORDER = 'order',
	INSPECT = 'inspect',
	REPAIR = 'repair',
}

export enum PAY_METHOD {
	CARD = 'card',
	TRANSFER = 'trans',
	VIRTUAL_BANK = 'vbank',
	CASH = 'cash',
}

enum YN {
	YES = 'Y',
	NO = 'N',
}

@Entity({name: 'TB_PAYMENT'})
export class Payment {
	@PrimaryGeneratedColumn({name: 'pay_idx', type: 'int'})
	idx: number;

	@Column({name: 'pay_type', enum: PAY_TYPE})
	payType: PAY_TYPE;

	@Column({name: 'pg', type: 'varchar', length: 10})
	pg: string;

	@Column({name: 'imp_uid', type: 'varchar', length: 50})
	imPortUniqId: string;

	// 가맹점에서 생성/관리하는 고유번호
	@Column({name: 'merchant_uid', type: 'varchar', length: 50})
	merchantUid: string;

	@Column({name: 'pay_method', enum: PAY_METHOD})
	payMethod: PAY_METHOD;

	@Column({name: 'escrow', enum: YN, default: YN.NO, nullable: false})
	escrowYN: YN;

	@Column({
		name: 'currency',
		type: 'varchar',
		default: 'KRW',
		nullable: false,
	})
	currency: string;

	@Column({name: 'pro_idx', type: 'int'})
	productId: string;

	@Column({name: 'price', type: 'int'})
	price: number;

	@Column({name: 'name', type: 'varchar', length: 250})
	name: string;

	@Column({name: 'buyer_idx', type: 'int'})
	buyerIdx: string;

	@Column({name: 'dc_price', type: 'int'})
	dcPrice: number;

	@Column({name: 'dlry_price', type: 'int'})
	dlryPrice: number;

	@Column({name: 'amount', type: 'int'})
	amount: number;

	@Column({name: 'buyer_name', type: 'varchar', length: 20})
	buyerName: string;

	@Column({name: 'buyer_email', type: 'varchar', length: 250})
	buyerEmail: string;

	@Column({name: 'buyer_tel', type: 'varchar', length: 50})
	buyerTel: string;

	@Column({name: 'buyer_addr', type: 'varchar', length: 250})
	buyerAddr: string;

	@Column({name: 'buyer_postcode', type: 'varchar', length: 6})
	buyerPostcode: string;

	@Column({name: 'success', enum: YN})
	success: YN;

	@Column({name: 'error_code', type: 'varchar', length: 100})
	errorCode: string;

	@Column({name: 'error_msg', type: 'varchar', length: 250})
	errorMessage: string;

	@Column({name: 'paid_amount', type: 'int'})
	paidAmount: number;

	@Column({name: 'status', type: 'varchar', length: 10})
	status: string;

	@Column({name: 'pg_tid', type: 'varchar', length: 50})
	pgTradeId: string;

	@Column({name: 'pg_provider', type: 'varchar', length: 20})
	pgProvider: string;

	@Column({name: 'emb_pg_provider', type: 'varchar', length: 20})
	embedPgProvider: string;

	@Column({name: 'custom_data', type: 'varchar', length: 250})
	customData: string;

	// 입금 일자
	@Column({name: 'pay_dt', type: 'datetime'})
	depositDate: Date;

	//결제승인일자
	@Column({name: 'paid_at', type: 'datetime'})
	paymentApprovalDate: Date;

	@Column({name: 'receipt_url', type: 'varchar', length: 250})
	receiptURL: string;

	@Column({name: 'cancel_amount', type: 'int'})
	cancelAmount: number;

	@Column({name: 'cancel_reason', type: 'varchar', length: 250})
	cancelReason: string;

	@Column({name: 'cancelled_at', type: 'datetime'})
	cancelledAt: Date;

	@Column({name: 'cancel_receipt_urls', type: 'varchar', length: 250})
	cancelReceiptUrl: string;

	@Column({name: 'apply_num', type: 'varchar', length: 250})
	applyNum: string;

	@Column({name: 'bank_code', type: 'varchar', length: 3})
	bankCode: string;

	@Column({name: 'bank_name', type: 'varchar', length: 20})
	bankName: string;

	@Column({name: 'bank_num', type: 'varchar', length: 250})
	bankNum: string;

	@Column({name: 'card_code', type: 'varchar', length: 10})
	cardCode: string;

	@Column({name: 'card_type', type: 'varchar', length: 20})
	cardType: string;

	@Column({name: 'card_name', type: 'varchar', length: 20})
	cardName: string;

	@Column({name: 'card_number', type: 'varchar', length: 50})
	cardNumber: string;

	@Column({name: 'card_quota', type: 'int'})
	cardQuota: number;

	@Column({name: 'vbank_code', type: 'varchar', length: 3})
	vbankCode: string;

	@Column({name: 'vbank_num', type: 'varchar', length: 50})
	vbankNum: string;

	@Column({name: 'vbank_name', type: 'varchar', length: 20})
	vbankName: string;

	@Column({name: 'vbank_holder', type: 'varchar', length: 20})
	vbankHolder: string;

	@CreateDateColumn({name: 'reg_dt', type: 'datetime'})
	registered: Date;

	@UpdateDateColumn({name: 'mod_dt', type: 'datetime', nullable: false})
	modified: Date;

	@ManyToOne(() => Product)
	@JoinColumn({name: 'pro_idx'})
	product: Product;
}
