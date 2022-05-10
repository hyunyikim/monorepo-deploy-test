import {Expose} from 'class-transformer';
import {
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	DeleteDateColumn,
	JoinColumn,
	Index,
	OneToOne,
} from 'typeorm';
import {Admin} from './admin.entity';
import {Payment} from './payment.entity';

import {Product} from './product.entity';
import {User} from './user.entity';

export enum YN {
	YES = 'Y',
	NO = 'N',
}

export enum DELIVERY_TYPE {
	PRE_PAY = 1,
	DEFERRED_PAY = 2,
	TAKE_OUT = 3,
}

enum REGISTRANT_TYPE {
	USER = 'U',
	ADMIN = 'A',
}

export enum INSPECTION_TYPE {
	SELL = '1',
	CERTIFICATE = '2',
	REPAIR = '3',
}

export enum INSPECTION_RESULT {
	GENUINE = 'G',
	FALSE = 'F',
	DIFF = 'D',
	NOT_PERMITTED = 'X',
}

export enum INSPECTION_QUALITY {
	NEW = 'N',
	S = 'S',
	A = 'A',
	B = 'B',
	C = 'C',
	D = 'D',
}

export enum WORK_STATE {
	READY = '1',
	WORKING = '2',
	DONE = '3',
}

export enum INSPECTION_STATUS {
	'READY' = '1',
	'SENDING' = '2',
	'INSPECTION_WAREHOUSE' = '3',
	'INSPECTION_RELEASED' = '4',
	'WORK_WAREHOUSE' = '5',
	'WORK_RELEASED' = '6',
	'PRODUCT_WAREHOUSE' = '7',
	'PRODUCT_RELEASED' = '8',
	'DELIVERED' = '9',
	'CANCELED_BY_ADMIN' = '19',
	'CANCELED_BY_CLIENT' = '20',
	'RE_INSPECTION' = '21',
}

@Entity({name: 'TB_PRODUCT_INSPECTION'})
export class Inspection {
	@PrimaryGeneratedColumn({name: 'inspct_idx', type: 'int'})
	idx: number;

	// 감정/수선번호 (자동화)
	@Column({name: 'inspct_num', type: 'varchar', length: 16})
	inspectionNum: string;

	// 상품 IDX
	@Column({name: 'pro_idx', type: 'int'})
	productIdx: string;

	@ManyToOne(() => Product, (product) => product.inspections)
	@JoinColumn({name: 'pro_idx'})
	product: Product;

	// 감정비
	@Column({name: 'inspct_fee', type: 'int', nullable: false, default: 0})
	inspectionFee: number;

	// 신청기업 (직접입력)
	@Column({name: 'company_nm', type: 'varchar', length: 100})
	companyName: string;

	// 수령인
	@Column({name: 'return_nm', type: 'varchar', length: 30})
	returnName: string;

	// 휴대전화번호
	@Column({name: 'return_phone', type: 'varchar', length: 15})
	returnPhone: string;

	// 우편번호
	@Column({name: 'return_zipcode', type: 'varchar', length: 6})
	returnZipcode: string;

	// 주소
	@Column({name: 'return_addr', type: 'varchar', length: 150})
	returnAddr: string;

	// 상세주소
	@Column({name: 'return_addr_detail', type: 'varchar', length: 250})
	returnAddrDetail: string;

	// 감정/수선 작성자명
	@Column({name: 'inspct_nm', type: 'varchar', length: 250})
	inspectionName: string;

	// 검수타입
	@Column({name: 'inspct_type', type: 'enum', enum: INSPECTION_TYPE})
	inspectionType: INSPECTION_TYPE;

	// 1차 검수결과 (감정)
	@Column({name: 'pre_inspct_result', type: 'enum', enum: INSPECTION_RESULT})
	preInspectionResult: INSPECTION_RESULT;

	// 최종 검수결과 (감정)
	@Column({name: 'inspct_result', type: 'enum', enum: INSPECTION_RESULT})
	inspectionResult: INSPECTION_RESULT;

	// 검수 등급 (감정)
	@Column({name: 'inspct_quality', type: 'enum', enum: INSPECTION_QUALITY})
	inspectionQuality: INSPECTION_QUALITY;

	// 감정가 (감정)
	@Column({name: 'inspct_price', type: 'int'})
	inspectionPrice: number;

	//검수 상품상태 여부 (수선)
	@Column({name: 'pro_state_yn', type: 'enum', enum: YN})
	productStateYN: YN;

	// 정품인증여부 (감정)
	@Column({name: 'genuine_yn', type: 'enum', enum: YN})
	genuineYN: YN;

	// NFC수선여부 (수선)
	@Column({name: 'nfc_repair_yn', type: 'enum', enum: YN})
	nfcRepairYN: YN;

	// NFC테스트 (수선)
	@Column({name: 'nfc_test_result', type: 'enum', enum: ['Y', 'N', 'R']})
	nfsTestResult: 'Y' | 'N' | 'R';

	@OneToMany(() => InspectionHistory, (history) => history.inspection)
	history: InspectionHistory[];

	// 수선 견적서 첨부 || 감정 소견서 (수선,감정)
	@Column({name: 'inspct_img', type: 'varchar', length: 250})
	inspectImagePath: string;

	// 수선 견적서 첨부 || 감정 소견서 (수선,감정) - 관리자
	@Column({name: 'inspct_admin_img', type: 'varchar', length: 250})
	inspectAdminImagePath: string;

	// 담당자 노트 (수선,감정)
	@Column({name: 'inspct_memo', type: 'text'})
	inspectionMemo: string;

	// 고객 전달 노트 (수선,감정)
	@Column({name: 'cstmg_memo', type: 'text'})
	customerMessage: string;

	// 관리자 메모
	@Column({name: 'admin_memo', type: 'text'})
	adminMemo: string;

	// 검수 입고 일시
	@Column({name: 'inspct_in_dt', type: 'datetime'})
	inspectionInDate: Date;

	// 검수 출고 일시
	@Column({name: 'inspct_out_dt', type: 'datetime'})
	inspectionOutDate: Date;

	// 작업 입고 일시
	@Column({name: 'work_in_dt', type: 'datetime'})
	workInDate: Date;

	// 작업 출고 일시
	@Column({name: 'work_out_dt', type: 'datetime'})
	workOutDate: Date;

	// 작업 완료 일시
	@Column({name: 'work_end_dt', type: 'datetime'})
	workEndDate: Date;

	// 검수 상품 입고일시
	@Column({name: 'pro_in_dt', type: 'datetime'})
	productInDate: Date;

	// 검수 상품 출고일시
	@Column({name: 'pro_out_dt', type: 'datetime'})
	productOutDate: Date;

	// 택배사
	@Column({name: 'dlry_list', type: 'char', length: 2})
	deliveryCompany: string;

	// 운송장번호
	@Column({name: 'tracking_num', type: 'varchar', length: 50})
	deliveryTrackingNumber: string;

	// 발송정보 입력일시
	@Column({name: 'tracking_reg_dt', type: 'datetime'})
	deliveryTrackingRegistered: Date;

	// 검수상태
	@Column({name: 'inspct_state', enum: INSPECTION_STATUS})
	inspectionState: INSPECTION_STATUS;

	// 작업상태
	@Column({name: 'work_state', enum: WORK_STATE})
	workState: WORK_STATE;

	// 등록 IDX
	@Column({name: 'reg_idx', type: 'int'})
	registrantId: number;

	// 등록한 유저 (일반)
	@ManyToOne(() => User)
	@JoinColumn({name: 'reg_idx'})
	registerUser: User;

	// 등록한 유저 (B2B)
	@ManyToOne(() => Admin)
	@JoinColumn({name: 'reg_idx'})
	registerAdmin: Admin;

	// 감정신청타입
	@Column({name: 'reg_type', enum: REGISTRANT_TYPE})
	registrantType: REGISTRANT_TYPE;

	// 등록일시
	@CreateDateColumn({name: 'reg_dt', type: 'datetime'})
	registered: Date;

	// 등록 IDX
	@Column({name: 'mod_idx', type: 'int'})
	modifierId: number;

	// 수정한 유저
	@ManyToOne(() => Admin)
	@JoinColumn({name: 'mod_idx'})
	modifier: Admin;

	// 수정일시
	@UpdateDateColumn({name: 'mod_dt', type: 'datetime'})
	modified: Date;

	// 감정완료사진
	@OneToMany(() => InspectionImage, (image) => image.inspection, {
		createForeignKeyConstraints: false,
		eager: true,
	})
	images: InspectionImage[];

	// 구입시기
	@Column({name: 'buy_date', type: 'varchar', length: 100})
	buyDate: string;

	// 구입장소
	@Column({name: 'buy_place', type: 'varchar', length: 100})
	buyPlace: string;

	// 감정신청내용
	@Column({name: 'ref_memo', type: 'varchar', length: 500})
	refMemo: string;

	// 감정을 담당하는 회사의 index 값을 의미합니다.
	@Column({name: 'inspctor_idx', type: 'int'})
	inspectorIdx: number;

	// 감정을 담당하는 회사를 의미합니다. Ex : 한국명품 감정원, 라올스
	@ManyToOne(() => Admin)
	@JoinColumn({name: 'inspctor_idx'})
	inspector: Admin;

	// 보증기간
	@Column({name: 'warranty_dt', type: 'varchar', length: 500})
	warrantyDate: string;

	// 구입처
	@Column({name: 'store_idx', type: 'int', scale: 10})
	storeId: string;

	// 택배사(고객이 관리자에게 보낼때)
	@Column({name: 'dlry_list_to_admin', type: 'char', length: 2})
	deliveryListToAdmin: string;

	// 운송장번호(고객이 관리자에게 보낼때)
	@Column({name: 'tracking_num_to_admin', type: 'varchar', length: 50})
	tackingNumToAdmin: string;

	// 발송정보 입력일시(고객이 관리자에게 보낼때)
	@Column({name: 'tracking_reg_dt_to_admin', type: 'datetime'})
	trackingRegisterDateToAdmin: Date;

	// 결제테이블 idx
	@Column({name: 'pay_idx', type: 'int'})
	paymentId: number;

	// 결제 정보
	@OneToOne(() => Payment, {nullable: true})
	@JoinColumn({name: 'pay_idx'})
	payment: Payment;

	// 정산유무
	@Column({name: 'calculate_yn', enum: YN})
	calculateYN: YN;

	// 정산완료 일자
	@Column({name: 'calculate_dt', type: 'datetime'})
	calculated: Date;

	// 참조 상품 번호
	@Column({name: 'ref_pro_id', type: 'varchar', length: 50})
	refProId: string;

	// 참조 구매자 회원번호
	@Column({name: 'ref_buyer_id', type: 'varchar', length: 50})
	refBuyerId: string;

	// 참조 판매자 회원번호
	@Column({name: 'ref_seller_id', type: 'varchar', length: 50})
	refSellerId: string;

	// NFT 발급여부
	@Column({name: 'use_nft', enum: YN, default: YN.YES})
	useNFT: YN;

	// 첫번째 작업자 IDX
	@Column({name: 'first_worker_idx', type: 'int', nullable: true})
	firstInspectorId: string;

	// 첫번째 작업자
	@ManyToOne(() => Admin)
	@JoinColumn({name: 'first_worker_idx'})
	firstWorker: Admin;

	// 두번째 작업자 IDX
	@Column({name: 'second_worker_idx', type: 'int', nullable: true})
	secondInspectorId: string;

	// 두번째 작업자
	@ManyToOne(() => Admin)
	@JoinColumn({name: 'second_worker_idx'})
	secondWorker: Admin;

	// 작업의 우선 순위
	@Column({
		name: 'priority',
		type: 'tinyint',
		unsigned: true,
		nullable: false,
		default: 2,
	})
	priority: string;

	// 배송 방식
	@Column({name: 'delivery_type', enum: DELIVERY_TYPE})
	deliveryType: DELIVERY_TYPE;

	// 배송 완료시간
	@Column({name: 'delivery_arrived', type: 'datetime'})
	deliveryArrived: Date;

	// 기타
	@Column({name: 'etc', type: 'varchar', length: 500})
	etc: string;

	@Column({name: 'delivery_fee', type: 'int', unsigned: true})
	deliveryFee: number;

	@Expose()
	get deliveryTypeStr(): string {
		return DELIVERY_TYPE[this.deliveryType];
	}
}

@Entity({name: 'TB_PRODUCT_INSPECTION_HISTORY'})
export class InspectionHistory {
	@PrimaryGeneratedColumn({name: 'inspct_his_idx', type: 'int'})
	idx: number;

	@ManyToOne(() => Inspection, (inspection) => inspection.history)
	@JoinColumn({name: 'inspct_idx'})
	inspection: Inspection;

	@Column({name: 'inspct_state', type: 'enum', enum: INSPECTION_STATUS})
	inspectionState: INSPECTION_STATUS;

	@CreateDateColumn({name: 'reg_dt', type: 'datetime'})
	registered: Date;
}

@Entity({name: 'TB_PRODUCT_INSPECTION_IMAGE'})
export class InspectionImage {
	@PrimaryGeneratedColumn({name: 'pro_inspct_img_idx', type: 'int'})
	idx: number;

	@Column({name: 'inspct_idx', type: 'int'})
	inspectionIdx: number;

	@ManyToOne(() => Inspection, (inspection) => inspection.images, {
		createForeignKeyConstraints: false,
	})
	@JoinColumn({name: 'inspct_idx'})
	inspection: Inspection;

	@Column({name: 'img_detail', type: 'varchar', length: 250})
	path: string;

	@Column({name: 'img_sort', type: 'int'})
	order: number;
}

@Entity({name: 'TB_PRODUCT_INSPECTION_COMMENT'})
export class InspectionComment {
	@PrimaryGeneratedColumn({name: 'comment_idx', type: 'int', unsigned: true})
	idx: number;

	@Index({unique: true})
	@Expose({groups: []})
	@Column({
		name: 'inspection_idx',
		type: 'int',
		unsigned: true,
		nullable: false,
	})
	inspectionIdx: number;

	@ManyToOne(() => Inspection, {
		createForeignKeyConstraints: false,
		eager: false,
	})
	@JoinColumn({name: 'inspection_idx'})
	inspection: Inspection;

	@Column({name: 'message', type: 'text', nullable: false})
	message: string;

	@Expose({groups: []})
	@Column({name: 'writer_idx', type: 'int', unsigned: true, nullable: false})
	writerIdx: number;

	@ManyToOne(() => Admin, {
		createForeignKeyConstraints: false,
		eager: true,
	})
	@JoinColumn({name: 'writer_idx'})
	writer: Admin;

	@CreateDateColumn({name: 'created', type: 'datetime'})
	created: Date;

	@Expose({groups: []})
	@DeleteDateColumn({name: 'deleted', type: 'datetime'})
	deleted: Date;
}
