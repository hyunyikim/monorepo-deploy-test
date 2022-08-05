import {Module} from '@nestjs/common';
import {Cafe24InterworkController} from './cafe24Interwork.controller';
import {Cafe24InterworkService} from './cafe24Interwork.service';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {Cafe24API} from './Cafe24ApiService/cafe24Api';
import {InterworkRepository} from './DynamoRepo/interwork.repository';
import {DynamoDB} from 'aws-sdk';
import {HealthCheckController} from './healthcheck.controller';
import {VircleCoreAPI} from './vircleCoreApiService';
import {Cafe24EventController} from './cafe24Event.controller';
import {JwtModule} from '@nestjs/jwt';
import {GuaranteeRequestRepository} from './DynamoRepo';
import {Cafe24EventService} from './cafe24Event.service';
console.log(process.env.NODE_ENV);
@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				secret: configService.getOrThrow('JWT_SECRET_KEY'),
			}),
			inject: [ConfigService],
		}),
		ConfigModule.forRoot({
			envFilePath:
				process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
		}),
	],
	controllers: [
		Cafe24InterworkController,
		HealthCheckController,
		Cafe24EventController,
	],
	providers: [
		{
			provide: Cafe24API,
			useFactory: (configService: ConfigService) => {
				const clientId =
					configService.getOrThrow<string>('CAFE24_CLIENT_ID');
				const secretKey =
					configService.getOrThrow<string>('CAFE24_SECRET_KEY');

				const redirectURL = configService.getOrThrow<string>(
					'CAFE24_REDIRECT_URL'
				);
				return new Cafe24API(clientId, secretKey, redirectURL);
			},
			inject: [ConfigService],
		},
		{
			provide: InterworkRepository,
			useFactory: (configService: ConfigService) => {
				const tableName = configService.getOrThrow<string>(
					'CAFE24_DDB_TABLE_NAME_INTERWORK'
				);
				const ddbClient = new DynamoDB.DocumentClient({
					region: 'ap-northeast-2',
				});
				return new InterworkRepository(ddbClient, tableName);
			},
			inject: [ConfigService],
		},
		{
			provide: GuaranteeRequestRepository,
			useFactory: (configService: ConfigService) => {
				const tableName = configService.getOrThrow<string>(
					'CAFE24_DDB_TABLE_NAME_GUARANTEE_REQ'
				);
				const ddbClient = new DynamoDB.DocumentClient({
					region: 'ap-northeast-2',
				});
				return new GuaranteeRequestRepository(ddbClient, tableName);
			},
			inject: [ConfigService],
		},
		{
			provide: VircleCoreAPI,
			useFactory: (configService: ConfigService) => {
				const baseURL =
					configService.getOrThrow<string>('VIRCLE_API_URL');

				return new VircleCoreAPI(baseURL);
			},
			inject: [ConfigService],
		},
		{
			provide: Cafe24InterworkService,
			useFactory: (
				cafe24Api: Cafe24API,
				repo: InterworkRepository,
				vircleApi: VircleCoreAPI
			) => {
				return new Cafe24InterworkService(cafe24Api, repo, vircleApi);
			},
			inject: [Cafe24API, InterworkRepository, VircleCoreAPI],
		},
		{
			provide: Cafe24EventService,
			useFactory: (
				cafe24Api: Cafe24API,
				interworkRepo: InterworkRepository,
				vircleApi: VircleCoreAPI,
				guaranteeRepo: GuaranteeRequestRepository
			) => {
				return new Cafe24EventService(
					cafe24Api,
					interworkRepo,
					guaranteeRepo,
					vircleApi
				);
			},
			inject: [
				Cafe24API,
				InterworkRepository,
				VircleCoreAPI,
				GuaranteeRequestRepository,
			],
		},
	],
})
export class Cafe24InterworkModule {}
