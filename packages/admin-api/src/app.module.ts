import {Module} from '@nestjs/common';

import {AdminModule} from './admin/admin.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule} from '@nestjs/config';
import {
	Admin,
	Nft,
	Brand,
	Product,
	ProductImage,
	ProductHistory,
	User,
	Inspection,
	InspectionHistory,
	InspectionComment,
	InspectionImage,
	Payment,
	Flex,
	FlexImage,
	FlexComment,
	FlexLike,
	FlexPoll,
	UserWallet,
	NftImage,
	NtfHistory,
} from '@vircle/entity';

@Module({
	imports: [
		ConfigModule.forRoot({
			cache: true,
			envFilePath:
				process.env.NODE_ENV === 'development'
					? './.env'
					: './.env.prod',
		}),
		TypeOrmModule.forRoot({
			type: process.env.DB_TYPE as 'mysql',
			host: process.env.DB_HOST,
			port: parseInt(process.env.DB_PORT),
			username: process.env.DB_USER,
			password: process.env.DB_PW,
			database: process.env.DB_NAME,
			entities: [
				Admin,
				Nft,
				NftImage,
				NtfHistory,
				Brand,
				Product,
				ProductImage,
				ProductHistory,
				Inspection,
				InspectionComment,
				InspectionImage,
				InspectionHistory,
				User,
				UserWallet,
				Flex,
				FlexImage,
				FlexComment,
				FlexLike,
				FlexPoll,
				Payment,
			],
			synchronize: false,
			logging: ['query'],
		}),
		AdminModule,
	],
})
export class AppModule {}
