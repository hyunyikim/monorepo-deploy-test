import {DataSource} from 'typeorm';

import dotenv from 'dotenv';
import {
	Admin,
	User,
	UserBlock,
	UserWallet,
	Brand,
	VirtualBankCode,
	Inspection,
	InspectionComment,
	InspectionHistory,
	InspectionImage,
	Flex,
	FlexComment,
	FlexImage,
	FlexLike,
	FlexPoll,
	Product,
	ProductHistory,
	ProductImage,
	Payment,
	Slack,
	Client,
	Nft,
} from '../src';

export type InfoMap = Record<string, {type: string; null: 'YES' | 'NO'}>;

export interface ColumnInfo {
	Field: string;
	Type: string;
	Null: 'YES' | 'NO';
	Key: string;
	Default: null | string;
	Extra: string;
}

const config = dotenv.config({
	path: '.env.test',
});

if (config.error) {
	console.error('Failure to make parsing env file');
}

export default class TestSource {
	public src: DataSource;
	constructor() {
		this.src = this.createConnection();
	}

	createConnection(): DataSource {
		if (config.parsed === undefined) throw new Error('No Env Var');

		const {
			MYSQL_HOST,
			MYSQL_PORT,
			MYSQL_USER,
			MYSQL_PASSPORT,
			MYSQL_DATABASE,
		} = config.parsed;

		return new DataSource({
			synchronize: false, // Don't Change this config!!
			logging: true,
			type: 'mysql',
			host: MYSQL_HOST,
			port: parseInt(MYSQL_PORT),
			username: MYSQL_USER,
			password: MYSQL_PASSPORT,
			database: MYSQL_DATABASE,
			entities: [
				Admin,
				User,
				UserBlock,
				UserWallet,
				Brand,
				VirtualBankCode,
				Inspection,
				InspectionComment,
				InspectionHistory,
				InspectionImage,
				Flex,
				FlexComment,
				FlexImage,
				FlexLike,
				FlexPoll,
				Product,
				ProductHistory,
				ProductImage,
				Payment,
				Slack,
				Client,
				Nft,
			],
		});
	}

	async init() {
		try {
			await this.src.initialize();
		} catch (error) {
			console.error(error);
			this.destroy();
		}
	}

	destroy() {
		this.src.destroy();
	}
}
