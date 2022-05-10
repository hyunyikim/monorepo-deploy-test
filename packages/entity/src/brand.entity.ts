import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	JoinColumn,
	ManyToOne,
} from 'typeorm';
import {Admin} from './admin.entity';
import {Product} from './product.entity';

enum YN {
	YES = 'Y',
	NO = 'N',
}
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
		eager: true,
	})
	@JoinColumn({name: 'reg_idx'})
	registrant: Admin;
}
