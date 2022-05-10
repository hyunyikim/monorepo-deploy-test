import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from 'typeorm';

export enum SLACK_ENUM_TYPE {
	INSPECTION = 'inspection',
	REPAIR = 'repair',
	NFS = 'nfs',
}

@Entity({name: 'TB_SLACK'})
export class Slack {
	@PrimaryGeneratedColumn({name: 'slack_idx', type: 'int'})
	id: string;

	@Column({name: 'noti_type', type: 'enum', enum: SLACK_ENUM_TYPE})
	type: SLACK_ENUM_TYPE;

	@Column({name: 'thread_ts', type: 'varchar', length: 100})
	threadTS: string;

	@Column({name: 'ref_idx', type: 'int', default: 0})
	refId: string;

	@Column({name: 'title', type: 'varchar', length: 500})
	title: string;

	@CreateDateColumn({name: 'reg_dt', type: 'datetime'})
	registered: Date;
}
