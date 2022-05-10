import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
	UpdateDateColumn,
	CreateDateColumn,
} from 'typeorm';
import {Brand} from './brand.entity';
import {Inspection} from './inspection.entity';
import {User} from './user.entity';

enum YN {
	YES = 'Y',
	NO = 'N',
}

export enum PRODUCT_LABEL {
	BLACK = 'B',
	WHITE = 'W',
	SILVER = 'S',
	GOLD = 'G',
}

export enum PRODUCT_QUALITY {
	NEW = 'N',
	S_PLUS = 'S+',
	S = 'S',
	A = 'A',
	B = 'B',
	C = 'C',
	D = 'D',
}

export enum PRODUCT_STATUS {
	'EMPTY_STATUS_1' = '1',
	'EMPTY_STATUS_2' = '2',
	'REGISTERED_DEFAULT' = '3',
	'REGISTERED_SELLING' = '4',
	'INSPECT_OR_REPAIR' = '5',
	'PROVED' = '6',
	'SOLD' = '7',
	'RECEIVED' = '8',
	'VGC_SENDED' = '9',
	'SCANNED' = '10',
}

export enum PRODUCT_PERIOD {
	ONE_YEAR_LESS = '1',
	THREE_YEAR_LESS = '3',
	FIVE_YEAR_LESS = '5',
	TEN_YEAR_LESS = '10',
}

@Entity({name: 'TB_PRODUCT'})
export class Product {
	@PrimaryGeneratedColumn({name: 'pro_idx', type: 'int'})
	idx: number;

	@Column({name: 'pro_num', type: 'varchar', length: 16})
	productionNumber: string;

	@Column({name: 'pro_cd', type: 'varchar', length: 30})
	productCode: string;

	@Column({name: 'pro_state', type: 'enum', enum: PRODUCT_STATUS})
	productStatus: PRODUCT_STATUS;

	@Column({name: 'label', type: 'enum', enum: PRODUCT_LABEL})
	label: PRODUCT_LABEL;

	@Column({name: 'label_yn', type: 'enum', enum: YN})
	labelExposed: YN;

	@Column({name: 'quality', type: 'enum', enum: PRODUCT_QUALITY})
	quality: PRODUCT_QUALITY;

	@Column({name: 'period', type: 'enum', enum: PRODUCT_PERIOD})
	period: PRODUCT_PERIOD;

	@Column({name: 'warranty_yn', type: 'enum', enum: YN})
	validWarranty: YN;

	@Column({name: 'cate_cd', type: 'varchar', length: 2})
	categoryCode: string;

	@ManyToOne(() => Brand, (brand) => brand.products, {
		createForeignKeyConstraints: false,
		eager: true,
	})
	@JoinColumn({name: 'brand_idx'})
	brand: Brand;

	@Column({name: 'acsrs', type: 'varchar', length: 10})
	accessory: string;

	@Column({name: 'material', type: 'varchar', length: 100, nullable: true})
	material: string;

	@Column({name: 'size', type: 'varchar', length: 100, nullable: true})
	size: string;

	@Column({name: 'weight', type: 'varchar', length: 100, nullable: true})
	weight: string;

	@Column({name: 'pro_nm', type: 'varchar', length: 250, nullable: true})
	name: string;

	@Column({name: 'cost', type: 'int', scale: 11})
	cost: number;

	@Column({name: 'price', type: 'int', scale: 11})
	price: number;

	@Column({name: 'dlry_price', type: 'int', scale: 11})
	deliveryFee: number;

	@Column({name: 'dc_rate', type: 'int', scale: 11})
	discountRate: number;

	@Column({name: 'description', type: 'mediumtext'})
	description: string;

	@Column({name: 'view_cnt', type: 'int', scale: 11})
	viewCount: number;

	@ManyToOne(() => User, (user) => user.productList, {
		createForeignKeyConstraints: false,
	})
	@JoinColumn({name: 'reg_idx'})
	registrant: User;

	@CreateDateColumn({name: 'reg_dt', type: 'datetime'})
	registered: Date;

	@ManyToOne(() => User, {
		createForeignKeyConstraints: false,
		eager: true,
	})
	@JoinColumn({name: 'mod_idx'})
	modifier: User;

	@UpdateDateColumn({name: 'mod_dt', type: 'datetime', nullable: true})
	modified: Date;

	@Column({name: 'model_num', type: 'varchar', length: 250, nullable: true})
	modelNumber: string;

	@Column({name: 'custom_field', type: 'json', nullable: true})
	customField: JSON;

	@OneToMany(() => ProductImage, (image) => image.product, {
		createForeignKeyConstraints: false,
	})
	images: ProductImage[];

	@OneToMany(() => ProductHistory, (history) => history.product, {
		createForeignKeyConstraints: false,
		eager: false,
	})
	history: Promise<ProductHistory[]>;

	@OneToMany(() => Inspection, (inspection) => inspection.product, {
		createForeignKeyConstraints: false,
		eager: false,
	})
	inspections: Promise<Inspection[]>;
}

@Entity({name: 'TB_PRODUCT_IMAGE'})
export class ProductImage {
	@PrimaryGeneratedColumn({name: 'pro_img_idx', type: 'int'})
	id: number;

	@ManyToOne(() => Product, (product) => product.images, {
		createForeignKeyConstraints: false,
	})
	product: Product;

	@Column({name: 'img_detail', type: 'varchar', length: 250})
	path: string;

	@Column({name: ' img_sort', type: 'int', scale: 11})
	order: number;
}

@Entity({name: 'TB_PRODUCT_HISTORY'})
export class ProductHistory {
	@PrimaryColumn({name: 'pro_idx', type: 'int'})
	id: number;

	@ManyToOne(() => Product, (product) => product.history)
	@JoinColumn({name: 'pro_idx'})
	product: Product;

	@ManyToOne(() => User, {createForeignKeyConstraints: false})
	@JoinColumn({name: 'user_idx'})
	user: User;

	@Column({name: 'pro_state', type: 'enum', enum: PRODUCT_STATUS})
	productState: PRODUCT_STATUS;

	@Column({name: 'reg_dt', type: 'datetime'})
	registered: Date;
}
