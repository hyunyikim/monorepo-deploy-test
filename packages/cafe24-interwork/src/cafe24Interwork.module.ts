import {Module} from '@nestjs/common';
import {Cafe24InterworkController} from './cafe24Interwork';
import {Cafe24InterworkService} from './cafe24Interwork/cafe24Interwork.service';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {Cafe24API} from './cafe24Api/cafe24Api';
import {InterworkRepository} from './dynamo/interwork.repository';
import {DynamoDB} from 'aws-sdk';
import {HealthCheckController} from './healthCheck/healthcheck.controller';
import {VircleCoreAPI} from './vircleCoreApiService';
import {Cafe24EventController} from './cafe24Webhook/cafe24Event.controller';
import {JwtModule} from '@nestjs/jwt';
import {GuaranteeRequestRepository} from './dynamo';
import {Cafe24EventService} from './cafe24Webhook';
import {SlackReporter} from './slackReporter';
import {WinstonModule, utilities} from 'nest-winston';
import {transports, format} from 'winston';
import * as WinstonCloudWatch from 'winston-cloudwatch';
import {TokenRefresher} from './tokenRefresher/tokenRefresher';
import {ScheduleModule} from '@nestjs/schedule';
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
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => {
				const transportList = [
					new WinstonCloudWatch({
						level:
							process.env.NODE_ENV === 'production'
								? 'info'
								: 'silly',
						logGroupName: configService.getOrThrow(
							'AWS_CLOUDWATCH_LOG_GROUP'
						),
						logStreamName: configService.getOrThrow(
							'AWS_CLOUDWATCH_LOG_STREAM'
						),
						jsonMessage: true,
						awsRegion: configService.getOrThrow(
							'AWS_CLOUDWATCH_REGION'
						),
					}),
					new transports.Console({
						level:
							process.env.NODE_ENV === 'production'
								? 'info'
								: 'silly',
						format: format.combine(
							format.timestamp(),
							utilities.format.nestLike('@vircle/cafe24', {
								prettyPrint: true,
							})
						),
					}),
				];
				return {
					transports: transportList,
				};
			},
			inject: [ConfigService],
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
		Cafe24InterworkService,
		Cafe24EventService,
		TokenRefresher,
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
	],
})
export class Cafe24InterworkModule {}
