import {
	PrimaryGeneratedColumn,
	Column,
	OneToOne,
	ManyToOne,
	JoinColumn,
	Index,
	OneToMany,
	CreateDateColumn,
	UpdateDateColumn,
	Entity,
} from 'typeorm';
import {Product} from './product.entity';
import {User} from './user.entity';
import {Admin} from './admin.entity';
import {Brand} from './brand.entity';

enum NFT_STATUS {
	'READY' = '1',
	'REQUESTED' = '2',
	'CONFIRMED' = '3',
	'COMPLETED' = '4',
	'WAITING_SEND' = '5',
	'WAITING_RECEIVE' = '6',
	'CANCELED' = '9',
}

export enum BLOCKCHAIN_PLATFORM {
	KLAYTN_KLIP = 'klaytn-klip',
	KLAYTN_KAS = 'klaytn-kas',
}

enum NFT_TYPE {
	'SELLER_GUARANTEE' = '1',
	'INSPECT_GUARANTEE' = '2',
	'REPAIR_GUARANTEE' = '3',
	'BRAND_GUARANTEE' = '4',
}

@Entity({name: 'TB_NFT_REQ'})
export class Nft {
	@PrimaryGeneratedColumn({name: 'nft_req_idx', type: 'int'})
	idx: number;

	@Column({name: 'nft_req_state', type: 'enum', enum: NFT_STATUS})
	nftStatus: NFT_STATUS;

	@Column({name: 'cate_cd', type: 'varchar', length: 2, nullable: true})
	categoryCode: string;

	@Column({name: 'brand_idx', type: 'int'})
	brandIdx: number;

	@ManyToOne(() => Brand, {createForeignKeyConstraints: false, eager: true})
	@JoinColumn({name: 'brand_idx'})
	brand: Brand;

	@Column({name: 'pro_nm', type: 'varchar', length: 250, nullable: true})
	name: string;

	@Column({name: 'model_num', type: 'varchar', length: 250, nullable: true})
	modelNum: string;

	@Column({name: 'material', type: 'varchar', length: 100, nullable: true})
	material: string;

	@Column({name: 'size', type: 'varchar', length: 100, nullable: true})
	size: string;

	@Column({name: 'weight', type: 'varchar', length: 100, nullable: true})
	weight: string;

	@Column({name: 'price', type: 'int', nullable: true})
	price: number;

	@Column({name: 'warranty_dt', type: 'varchar', length: 250, nullable: true})
	warranty: string;

	@Column({name: 'platform_idx', type: 'int'})
	platformIdx: number;

	@ManyToOne(() => Admin, {
		createForeignKeyConstraints: false,
		eager: false,
	})
	@JoinColumn({name: 'platform_idx'})
	platform: Admin;

	@Column({name: 'ref_req_no', type: 'varchar', length: 50, nullable: true})
	refReqNo: string;

	@Column({
		name: 'ref_order_id',
		type: 'varchar',
		length: 100,
		nullable: true,
	})
	refOrderId: string;

	@Column({
		name: 'ref_order_dtl_id',
		type: 'varchar',
		length: 50,
		nullable: true,
	})
	refOrderDetailId: string;

	@Column({name: 'ref_cate_cd', type: 'varchar', length: 50, nullable: true})
	refCategoryCode: string;

	@Column({name: 'ref_pro_cd', type: 'varchar', length: 100, nullable: true})
	refProductCode: string;

	@Column({name: 'ref_user_idx', type: 'varchar', length: 50, nullable: true})
	refUserId: string;

	@Column({name: 'orderer_nm', type: 'varchar', length: 20, nullable: true})
	ordererName: string;

	@Column({name: 'orderer_tel', type: 'varchar', length: 20, nullable: true})
	ordererTel: string;

	@Index()
	@Column({name: 'user_idx', type: 'int'})
	userIdx: number;

	@ManyToOne(() => User, (user) => user.nftList, {
		createForeignKeyConstraints: false,
		eager: false,
	})
	@JoinColumn({name: 'user_idx'})
	owner: User;

	@Index()
	@Column({name: 'admin_idx', type: 'int'})
	adminIdx: number;

	@ManyToOne(() => Admin, (admin) => admin.nftList, {
		createForeignKeyConstraints: false,
		eager: false,
	})
	@JoinColumn({name: 'admin_idx'})
	register: Admin;

	@Column({name: 'apply_dt', type: 'datetime', nullable: true})
	applied: Date;

	@Column({name: 'nft_req_num', type: 'varchar', length: 50})
	nftNum: string;

	@OneToOne(() => Product, (product) => product.idx, {
		createForeignKeyConstraints: false,
		eager: false,
	})
	@JoinColumn({name: 'pro_idx'})
	product: Product;

	@Column({name: 'issued_dt', type: 'datetime', nullable: true})
	issued: Date;

	@Column({name: 'token_id', type: 'varchar', length: 250, nullable: true})
	tokenId: string;

	@Column({
		name: 'external_link',
		type: 'varchar',
		length: 250,
		nullable: true,
	})
	externalLink: string;

	@Column({
		name: 'transaction_hash',
		type: 'varchar',
		length: 250,
		nullable: true,
	})
	transactionHash: string;

	@Column({
		name: 'nft_card_img',
		type: 'varchar',
		length: 250,
		nullable: true,
	})
	nftCardImg: string;

	@Column({
		name: 'nft_req_type',
		type: 'enum',
		enum: NFT_TYPE,
		default: NFT_TYPE.SELLER_GUARANTEE,
	})
	nftType: NFT_TYPE;

	@Column({name: 'custom_field', type: 'json', nullable: true})
	customField: string;

	@Column({name: 'reg_dt', type: 'datetime', nullable: true})
	registered: Date;

	@Column({name: 'mod_dt', type: 'datetime', nullable: true})
	modified: Date;

	@Column({
		name: 'blockchain_platform',
		type: 'enum',
		enum: BLOCKCHAIN_PLATFORM,
		default: BLOCKCHAIN_PLATFORM.KLAYTN_KLIP,
	})
	blockchainPlatform: BLOCKCHAIN_PLATFORM;

	@Column({
		name: 'waiting_user_idx',
		type: 'int',
	})
	waitingUserIdx: number;

	@ManyToOne(() => User, {createForeignKeyConstraints: false, eager: false})
	@JoinColumn({name: 'waiting_user_idx'})
	waitingUser: Promise<User>;

	@OneToMany(() => NtfHistory, (history) => history.nftRequest, {
		eager: false,
	})
	history: Promise<NtfHistory[]>;

	@OneToMany(() => NftImage, (image) => image.nft, {eager: true})
	images: NftImage[];
}

@Entity({name: 'TB_NFT_HISTORY'})
export class NtfHistory {
	/** Primary Key */
	@PrimaryGeneratedColumn({name: 'nft_his_idx', type: 'int'})
	idx: number;

	/** FK, index of TB_NFT_REQ */
	@Column({name: 'nft_req_idx', type: 'int'})
	nftRequestIdx: number;

	@ManyToOne(() => Nft, {createForeignKeyConstraints: false, eager: false})
	@JoinColumn({name: 'nft_req_idx'})
	nftRequest: Promise<Nft>;

	/** 토큰 ID (hex) */
	@Column({name: 'token_id', type: 'varchar', length: 250})
	tokenId: string;

	/** 트랜잭션 해시 */
	@Column({name: 'tx_hash', type: 'varchar', length: 250})
	txHash: string;

	/** 보낸 사람 지갑 주소 */
	@Column({name: 'from_wallet', type: 'varchar', length: 250})
	fromWallet: string;

	/** 받는 사람 지갑 주소 */
	@Column({name: 'to_wallet', type: 'varchar', length: 250})
	toWallet: string;

	/** 등록 IDX */
	@Column({name: 'user_idx', type: 'int'})
	userIdx: number;

	@ManyToOne(() => User, {createForeignKeyConstraints: false, eager: false})
	@JoinColumn({name: 'user_idx'})
	registrant: User;

	/** 블록 해시 값 */
	@Column({name: 'block_hash', type: 'varchar', length: 250})
	blockHash: string;

	/** 수수료 대납 계정*/
	@Column({name: 'fee_player_address', type: 'varchar', length: 250})
	feePlayerAddress: string;

	/** 가스 비용 (hex)*/
	@Column({name: 'gas_price', type: 'varchar', length: 250})
	gasPrice: string;

	/** 가스 사용량 (hex)*/
	@Column({name: 'gas_used', type: 'varchar', length: 250})
	gasUsed: string;

	/** 트렌잭션 수수료 */
	@Column({name: 'tx_fee', type: 'decimal', precision: 27, scale: 18})
	txFee: number;

	/** 수수료 단위 */
	@Column({name: 'fee_unit', type: 'varchar', length: 250})
	feeUnit: string;

	/** 등록 일자 */
	@CreateDateColumn({name: 'reg_dt', type: 'datetime'})
	registered: Date;

	/** 수정 일자 */
	@UpdateDateColumn({name: 'mod_dt', type: 'datetime'})
	modified: Date;
}

@Entity({name: 'TB_NFT_REQ_IMAGE'})
export class NftImage {
	/** Primary Key */
	@PrimaryGeneratedColumn({name: 'nft_req_img_idx', type: 'int'})
	idx: number;

	/** FK, index of NFT_REQ */
	@Column({name: 'nft_req_idx', type: 'int'})
	nftReqIdx: number;

	/** NFT Obj */
	@ManyToOne(() => Nft, {createForeignKeyConstraints: false, eager: false})
	@JoinColumn({name: 'nft_req_img_idx'})
	nft: Nft;

	/** image URL */
	@Column({name: 'img_detail', type: 'varchar', length: 250})
	path: string;

	/** 이미지 순번 */
	@Column({name: 'img_sort', type: 'int'})
	sort: number;
}
