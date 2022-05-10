import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	PrimaryColumn,
} from 'typeorm';
import {Flex} from './flex.entity';
import {Product} from './product.entity';

@Entity({name: 'TB_USER'})
export class User {
	@PrimaryGeneratedColumn({name: 'user_idx', type: 'int'})
	id: number;

	@Column({name: 'user_num', type: 'varchar', length: 16})
	name: string;

	@Column({name: 'user_email', type: 'varchar', length: 50})
	email: string;

	@OneToMany(() => Flex, (flex) => flex.registrant, {
		createForeignKeyConstraints: false,
		eager: false,
	})
	flexList: Promise<Flex[]>;

	@OneToMany(() => Product, (product) => product.registrant, {
		createForeignKeyConstraints: false,
		eager: false,
	})
	productList: Promise<Product[]>;
}

@Entity({name: 'TB_USER_BLOCK'})
export class UserBlock {
	@PrimaryColumn({name: 'block_idx', type: 'int'})
	id: string;

	@PrimaryColumn({name: 'user_idx', type: 'int'})
	userId: string;
}

// @Entity({ name: "TB_USER_DELIVERY" })
// export class UserDelivery {

// }

// @Entity({ name: "TB_USER_PAYMENT" })
// export class UserPayment {}

// @Entity({ name: "TB_USER_RETURN" })
// export class UserReturn {}
