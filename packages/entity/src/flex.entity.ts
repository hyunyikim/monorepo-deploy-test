import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
	OneToMany,
	PrimaryColumn,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import {User} from './user.entity';

enum YN {
	YES = 'Y',
	NO = 'N',
}

enum FLEX_TYPE {
	FLEX = '1',
	REAL = '2',
	PROP = '3',
	EVNT = '4',
}

@Entity({name: 'TB_FLEX'})
export class Flex {
	@PrimaryGeneratedColumn({name: 'flex_idx', type: 'int'})
	id: number;

	@Column({name: 'flex_type', type: 'enum', enum: FLEX_TYPE})
	type: FLEX_TYPE;

	@Column({name: 'subject', type: 'varchar', length: 200})
	subject: string;

	@Column({name: 'contents', type: 'text'})
	contents: string;

	@Column({name: 'tags', type: 'varchar', length: 200})
	tags: string;

	@ManyToOne(() => User, (user) => user.flexList, {
		createForeignKeyConstraints: false,
	})
	@JoinColumn({name: 'reg_idx'})
	registrant: User;

	@Column({name: 'reg_dt', type: 'datetime'})
	registered: Date;

	@ManyToOne(() => User, {
		createForeignKeyConstraints: false,
	})
	@JoinColumn({name: 'mod_idx'})
	modifier: User;

	@Column({name: 'mod_dt', type: 'datetime', nullable: true})
	modified: Date;

	@Column({name: 'closing_dt', type: 'datetime', nullable: true})
	closed: Date;

	@OneToMany(() => FlexImage, (flexImage) => flexImage.flex, {
		createForeignKeyConstraints: false,
		eager: true,
	})
	images: FlexImage[];

	@OneToMany(() => FlexComment, (flexComment) => flexComment.flex, {
		createForeignKeyConstraints: false,
		eager: true,
	})
	comments: FlexComment[];

	@Column({name: 'closing_yn', type: 'enum', enum: YN})
	closing: YN;

	@Column({name: 'category', type: 'varchar', length: 10, nullable: true})
	category: string;

	@OneToMany(() => FlexLike, (flexLike) => flexLike.flex)
	likes: FlexLike[];

	@OneToMany(() => FlexPoll, (flexPoll) => flexPoll.flex)
	polls: FlexPoll[];
}

@Entity({name: 'TB_FLEX_IMAGE'})
export class FlexImage {
	@PrimaryGeneratedColumn({name: 'flex_img_idx', type: 'int'})
	id: number;

	@ManyToOne(() => Flex, (flex) => flex.images, {
		createForeignKeyConstraints: false,
		eager: false,
	})
	@JoinColumn({name: 'flex_idx'})
	flex: Promise<Flex>;

	@Column({name: 'img_detail', type: 'varchar', length: 250})
	path: string;

	@Column({name: 'img_sort', type: 'int', scale: 11})
	order: number;
}

@Entity({name: 'TB_FLEX_COMMENT'})
export class FlexComment {
	@PrimaryGeneratedColumn({name: 'flex_comment_idx', type: 'int'})
	id: number;

	@ManyToOne(() => Flex, (flex) => flex.comments, {
		createForeignKeyConstraints: false,
		eager: false,
	})
	@JoinColumn({name: 'flex_idx'})
	flex: Promise<Flex>;

	@Column({name: 'comment', type: 'varchar', scale: 11})
	comment: string;

	@ManyToOne(() => User, {
		createForeignKeyConstraints: false,
		eager: true,
	})
	@JoinColumn({name: 'reg_idx'})
	registrant: User;

	@CreateDateColumn({name: 'reg_dt', type: 'datetime'})
	registered: Date;

	@ManyToOne(() => User, {
		createForeignKeyConstraints: false,
		eager: true,
	})
	@JoinColumn({name: 'reg_idx'})
	modifier: User;

	@UpdateDateColumn({name: 'mod_dt', type: 'datetime', nullable: true})
	modified: Date;
}

export enum LIKE_TYPE {
	LIKE = 'L',
	BOOK_MARK = 'B',
}

@Entity({name: 'TB_FLEX_LIKE'})
export class FlexLike {
	@PrimaryGeneratedColumn({name: 'like_idx'})
	id: number;

	@ManyToOne(() => Flex)
	@JoinColumn({name: 'flex_idx'})
	flex: Flex;

	@Column({name: 'like_type', type: 'enum', enum: LIKE_TYPE})
	likeType: LIKE_TYPE;

	@ManyToOne(() => User)
	@JoinColumn({name: 'user_idx'})
	user: User;

	@CreateDateColumn({name: 'reg_dt', type: 'datetime'})
	registered: Date;
}

@Entity({name: 'TB_FLEX_POLL'})
export class FlexPoll {
	@PrimaryColumn({name: 'flex_idx', type: 'int'})
	flexId: string;

	@PrimaryColumn({name: 'user_idx', type: 'int'})
	userId: string;

	@ManyToOne(() => Flex)
	@JoinColumn({name: 'flex_id'})
	flex: Flex;

	@ManyToOne(() => User)
	@JoinColumn({name: 'user_idx'})
	user: User;

	@Column({name: 'poll_num', type: 'int', scale: 11})
	pollNumber: number;

	@CreateDateColumn({name: 'reg_dt', type: 'datetime'})
	registered: Date;
}
