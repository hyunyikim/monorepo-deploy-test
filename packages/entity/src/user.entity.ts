import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	PrimaryColumn,
} from 'typeorm';
import {Flex} from './flex.entity';
import {YN, BLOCKCHAIN_PLATFORM} from './enums';
import {Nft} from './nft.entity';
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

	@OneToMany(() => Nft, (nft) => nft.owner, {
		createForeignKeyConstraints: false,
		eager: false,
	})
	nftList: Promise<Nft[]>;

	@OneToMany(() => UserWallet, (wallet) => wallet.owner, {
		createForeignKeyConstraints: false,
		eager: false,
	})
	walletList: Promise<UserWallet[]>;
}

@Entity({name: 'TB_USER_BLOCK'})
export class UserBlock {
	@PrimaryColumn({name: 'block_idx', type: 'int'})
	id: string;

	@PrimaryColumn({name: 'user_idx', type: 'int'})
	userId: string;
}

@Entity({name: 'TB_USER_WALLET'})
export class UserWallet {
	@PrimaryColumn({name: 'wallet_idx', type: 'int'})
	idx: number;

	@Column({name: 'user_idx', type: 'int', unsigned: true, nullable: false})
	ownerIdx: number;

	@Column({name: 'user_idx', type: 'int'})
	owner: User;

	@Column({name: 'wallet_address', type: 'varchar', length: 50})
	walletAddress: string;

	@Column({name: 'pool_krn', type: 'varchar', length: 100})
	poolKrn: string;

	@Column({name: 'public_key', type: 'varchar', length: 200})
	publicKey: string;

	@Column({name: 'private_key_id', type: 'varchar', length: 200})
	privateKeyId: string;

	@Column({name: 'main_yn', type: 'enum', enum: YN})
	mainYN: YN;

	@Column({
		name: 'blockchain_platform',
		type: 'enum',
		enum: BLOCKCHAIN_PLATFORM,
	})
	blockchainPlatform: BLOCKCHAIN_PLATFORM;

	@Column({name: 'reg_dt', type: 'datetime'})
	registered: Date;

	@Column({name: 'mod_dt', type: 'datetime'})
	modified: Date;
}

// @Entity({ name: "TB_USER_DELIVERY" })
// export class UserDelivery {

// }

// @Entity({ name: "TB_USER_PAYMENT" })
// export class UserPayment {}

// @Entity({ name: "TB_USER_RETURN" })
// export class UserReturn {}
