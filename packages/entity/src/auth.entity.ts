import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToOne,
	CreateDateColumn,
	DeleteDateColumn,
	JoinColumn,
} from 'typeorm';
import {User} from './user.entity';

@Entity({name: 'TB_SIMPLE_AUTH'})
export class SimpleAuth {
	@PrimaryGeneratedColumn({
		name: 'simple_auth_idx',
		type: 'int',
		unsigned: true,
	})
	idx: number;

	@Column({name: 'user_idx', type: 'int', unsigned: true})
	userIdx: number;

	@OneToOne(() => User, {
		createForeignKeyConstraints: false,
		eager: false,
	})
	@JoinColumn({name: 'user_idx'})
	user: Promise<User>;

	@Column({name: 'password', type: 'varchar', length: 128})
	password: string;

	@Column({name: 'fail_count', type: 'tinyint', unsigned: true, default: 0})
	failCount: number;

	@CreateDateColumn({name: 'created', type: 'datetime'})
	created: Date;

	@Column({name: 'last_authed', type: 'datetime', nullable: true})
	lastAuthed: Date;

	@Column({
		name: 'updated',
		type: 'datetime',
		default: () => 'CURRENT_DATETIME',
	})
	updated: Date;

	@DeleteDateColumn({name: 'deleted', type: 'datetime', nullable: true})
	deleted: Date;
}
