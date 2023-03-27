import {WinstonLoggerService} from './common/config/logger.config';
import {Logger, Module} from '@nestjs/common';
import {Cafe24InterworkController} from './cafe24Interwork';
import {Cafe24InterworkService} from './cafe24Interwork/cafe24Interwork.service';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {Cafe24API} from './cafe24Api/cafe24Api';
import {InterworkRepository} from './dynamo/interwork.repository';
import * as AWS from 'aws-sdk';
import {HealthCheckController} from './healthCheck/healthcheck.controller';
import {VircleCoreAPI} from './vircleCoreApiService';
import {Cafe24EventController} from './cafe24Webhook/cafe24Event.controller';
import {JwtModule} from '@nestjs/jwt';
import {GuaranteeRequestRepository} from './dynamo';
import {Cafe24EventService} from './cafe24Webhook';
import {SlackReporter} from './slackReporter';
import {WinstonModule} from 'nest-winston';
import {TokenRefresher} from './tokenRefresher/tokenRefresher';
import {ScheduleModule} from '@nestjs/schedule';
import {
	Cafe24GuaranteeController,
	Cafe24GuaranteeService,
} from './cafe24Guarantee';
import {KakaoAlimTalkModule} from './kakao-alim-talk/kakao-alim-talk.module';
import {KakaoAlimTalkService} from './kakao-alim-talk';
import {Cafe24OrderEventHandler} from './cafe24Webhook/cafe24OrderEvent.handler';
import {MasterCafe24InterworkController} from './cafe24Interwork/cafe24intework.master.controller';
import {SqsService} from './sqs/sqs.service';
@Module({
	imports: [
		ScheduleModule.forRoot(),
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
		WinstonModule.forRootAsync({
			useClass: WinstonLoggerService,
			imports: [ConfigModule],
			inject: [ConfigService],
		}),
		KakaoAlimTalkModule,
	],
	controllers: [
		Cafe24InterworkController,
		HealthCheckController,
		Cafe24EventController,
		Cafe24GuaranteeController,
		MasterCafe24InterworkController,
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
				return new Cafe24API(clientId, secretKey, redirectURL, Logger);
			},
			inject: [ConfigService],
		},
		{
			provide: InterworkRepository,
			useFactory: (configService: ConfigService) => {
				const tableName = configService.getOrThrow<string>(
					'CAFE24_DDB_TABLE_NAME_INTERWORK'
				);
				const ddbClient = new AWS.DynamoDB.DocumentClient({
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
				const ddbClient = new AWS.DynamoDB.DocumentClient({
					region: 'ap-northeast-2',
				});
				return new GuaranteeRequestRepository(ddbClient, tableName);
			},
			inject: [ConfigService],
		},
		{
			provide: SqsService,
			useFactory: (config: ConfigService) => {
				const sqs = new AWS.SQS({
					region: config.getOrThrow(
						'CAFE24_SQS_WEBHOOK_FAILED_QUEUE_REGION'
					),
				});
				return new SqsService(sqs, config);
			},
			inject: [ConfigService],
		},
		{
			provide: VircleCoreAPI,
			useFactory: (configService: ConfigService) => {
				const baseURL =
					configService.getOrThrow<string>('VIRCLE_API_URL');

				return new VircleCoreAPI(baseURL, Logger);
			},
			inject: [ConfigService],
		},
		Cafe24InterworkService,
		Cafe24EventService,
		Cafe24GuaranteeService,
		TokenRefresher,
		Cafe24OrderEventHandler,
		{
			provide: SlackReporter,
			useFactory: (configService: ConfigService) => {
				const token =
					configService.getOrThrow<string>('SLACK_BOT_TOKEN');
				const channel =
					configService.getOrThrow<string>('SLACK_CHANEL_ID');
				const nodeEnv = configService.getOrThrow<string>('NODE_ENV');

				return new SlackReporter(
					token,
					channel,
					nodeEnv === 'development'
				);
			},
			inject: [ConfigService],
		},
		{
			provide: 'CRON_TASK_ON',
			useFactory: (configService: ConfigService) => {
				const env = configService.getOrThrow<string>('CRON_TASK_ON');
				return env === 'ON';
			},
			inject: [ConfigService],
		},
		KakaoAlimTalkService,
	],
})
export class Cafe24InterworkModule {}
