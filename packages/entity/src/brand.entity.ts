import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	JoinColumn,
	ManyToOne,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import {Admin} from './admin.entity';
import {Product} from './product.entity';
import {YN} from './enums';

@Entity({name: 'TB_BRAND'})
export class Brand {
	@PrimaryGeneratedColumn({name: 'brand_idx', type: 'int'})
	id: number;

	@Column({name: 'brand_nm', type: 'varchar', length: 250})
	name: string;

	@Column({name: 'brand_nm_en', type: 'varchar', length: 250})
	englishName: string;

	@Column({name: 'summary', type: 'mediumtext'})
	summary: string;

	@Column({name: 'img_main', type: 'varchar', length: 250})
	mainImage: string;

	@Column({name: 'img_detail', type: 'varchar', length: 250})
	detailImage: string;

	@Column({name: 'view_yn', type: 'enum', enum: YN})
	viewExposure: YN;

	@Column({name: 'main_yn', type: 'enum', enum: YN})
	mainExposure: YN;

	@Column({name: 'use_inspect', type: 'enum', enum: YN})
	useInspect: YN;

	@Column({name: 'use_repair', type: 'enum', enum: YN})
	useRepair: YN;

	@OneToMany(() => Product, (product) => product.brand, {
		createForeignKeyConstraints: false,
		eager: false,
	})
	products: Promise<Product[]>;

	@ManyToOne(() => Admin, {
		createForeignKeyConstraints: false,
		eager: false,
	})
	@JoinColumn({name: 'reg_idx'})
	registrant: Admin;

	@CreateDateColumn({name: 'reg_dt', type: 'datetime'})
	registerDate: Date;

	@Column({name: 'mod_idx', type: 'int'})
	modifierIdx: number;

	@ManyToOne(() => Admin, {
		createForeignKeyConstraints: false,
		eager: true,
	})
	modifier: Admin;

	@UpdateDateColumn({name: 'mod_dt', type: 'datetime'})
	modifiedDate: Date;
}
