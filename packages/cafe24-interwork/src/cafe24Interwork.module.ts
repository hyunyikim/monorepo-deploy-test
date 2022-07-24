import {Module} from '@nestjs/common';
import {Cafe24InterworkController} from './cafe24Interwork.controller';
import {Cafe24InterworkService} from './cafe24Interwork.service';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {Cafe24API} from './Cafe24ApiService/cafe24Api';
import {InterworkRepository} from './DynamoRepo/interwork.repository';
import {DynamoDB} from 'aws-sdk';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath:
				process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
		}),
	],
	controllers: [Cafe24InterworkController],
	providers: [
		{
			provide: Cafe24API,
			useFactory: (configService: ConfigService) => {
				const clientId =
					configService.getOrThrow<string>('CAFE24_CLIENT_ID');
				const secretKey =
					configService.getOrThrow<string>('CAFE24_SECRET_KEY');
				return new Cafe24API(clientId, secretKey);
			},
			inject: [ConfigService],
		},
		{
			provide: InterworkRepository,
			useFactory: (configService: ConfigService) => {
				console.log('INJECTT!!');
				const tableName = configService.getOrThrow<string>(
					'CAFE24_DDB_TABLE_NAME'
				);
				const ddbClient = new DynamoDB.DocumentClient({
					region: 'ap-northeast-2',
				});
				return new InterworkRepository(ddbClient, tableName);
			},
			inject: [ConfigService],
		},
		{
			provide: Cafe24InterworkService,
			useFactory: (cafe24Api: Cafe24API, repo: InterworkRepository) => {
				return new Cafe24InterworkService(cafe24Api, repo);
			},
			inject: [Cafe24API, InterworkRepository],
		},
	],
})
export class Cafe24InterworkModule {}
