import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	JoinColumn,
	Index,
} from 'typeorm';
import {Admin} from './admin.entity';

@Entity({name: 'TB_PARTNERS_CLIENT'})
class Client {
	@PrimaryGeneratedColumn({name: 'client_idx', type: 'int', unsigned: true})
	id: number;

	@Index({unique: true})
	@Column({
		name: 'partner_idx',
		type: 'int',
		unsigned: true,
		nullable: false,
	})
	partnerIdx: number;

	@ManyToOne(() => Admin, {createForeignKeyConstraints: false})
	@JoinColumn({name: 'partner_idx'})
	partner: Admin;

	@Column({name: 'name', type: 'varchar', length: 50, nullable: false})
	name: string;

	@Column({name: 'reg_idx', type: 'int', unsigned: true, nullable: false})
	registrantIdx: number;

	@ManyToOne(() => Admin, {createForeignKeyConstraints: false})
	@JoinColumn({name: 'reg_idx'})
	registrant: Admin;

	@CreateDateColumn({name: 'created', type: 'datetime'})
	created: Date;

	@Column({
		name: 'phone_num',
		type: 'varchar',
		length: 16,
		nullable: false,
	})
	phoneNumber: string;

	@Column({name: 'address', type: 'varchar', length: 150, nullable: false})
	address: string;

	@Column({
		name: 'address_detail',
		type: 'varchar',
		length: 250,
		nullable: true,
	})
	addressDetail: string;

	@Column({name: 'zipcode', type: 'varchar', length: 8, nullable: false})
	zipcode: string;

	@Column({name: 'manager_name', type: 'varchar', length: 50})
	managerName: string;

	@Column({name: 'manager_phone_num', type: 'varchar', length: 16})
	managerPhoneNum: string;

	@Column({name: 'business_num', type: 'varchar', length: 50})
	businessNum: string;
}

export {Client};
