import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToOne,
	ManyToOne,
	JoinColumn,
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
	'CANCELED' = '9',
}

export enum BLOCKCHAIN_PLATFORM {
	KLAYTN_KLIP = 'klaytn-klip',
	KLAYTN_KAS = 'klaytn-kas',
}

enum NFT_TYPE {
	'SELLER_GUARANTEE' = '1',
	'INSPECT_GUARANTEE' = '2',
	'REPIRE_GUARANTEE' = '3',
	'BRAND_GUARANTEE' = '4',
}

@Entity({name: 'TB_NFT_REQ'})
export class Nft {
	@PrimaryGeneratedColumn({name: 'nft_req_idx', type: 'int'})
	id: number;

	@Column({name: 'nft_req_state', type: 'enum', enum: NFT_STATUS})
	nftStatus: NFT_STATUS;

	@Column({name: 'cate_cd', type: 'varchar', length: 2, nullable: true})
	categoryCode: string;

	@ManyToOne(() => Brand, (brand) => brand.id, {
		createForeignKeyConstraints: false,
		eager: true,
	})
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

	@ManyToOne(() => Admin, (admin) => admin.idx, {
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

	@ManyToOne(() => User, (user) => user.nftList, {
		createForeignKeyConstraints: false,
		eager: false,
	})
	@JoinColumn({name: 'user_idx'})
	owner: User;

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
}