import {Logger, Module, Provider} from '@nestjs/common';
import {BillingController} from './interface/billing.controller';
import {CqrsModule} from '@nestjs/cqrs';
import {TossPaymentsAPI} from './infrastructure/api-client';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {WinstonModule, utilities} from 'nest-winston';
import {transports, format} from 'winston';
import WinstonCloudWatch from 'winston-cloudwatch';
import {JwtModule} from '@nestjs/jwt';

import {
	CancelPaymentHandler,
	RegisterBillingHandler,
	ApproveBillingPaymentHandler,
	ChangeBillingPlanHandler,
} from './application/command';
import {
	FindBillingByCustomerKeyHandler,
	FindPaymentsQuery,
} from './application/query';
import {
	BillingRegisteredHandler,
	BillingUnregisteredHandler,
	BillingApprovedHandler,
	BillingPlanChangedHandleHandler,
} from './application/event';
import {
	PlanBillingRepository,
	PlanPaymentRepository,
	PricePlanRepository,
} from './infrastructure/respository';
import {
	PlanBilling,
	PlanBillingFactory,
	PlanPayment,
	PlanPaymentFactory,
} from './domain';
import {InjectionToken} from '../injection.token';
import {BillingSaga} from './application/sagas';
import {JwtService} from '@nestjs/jwt';
import {ScheduleModule} from '@nestjs/schedule';
import {FindPaymentsHandler} from './application/query/find-payments.query';

const infra: Provider[] = [
	{
		provide: TossPaymentsAPI,
		useFactory: (configService: ConfigService) => {
			return new TossPaymentsAPI({
				secretKey: configService.getOrThrow('TOSS_PAYMENTS_SECRET_KEY'),
				baseURL: configService.getOrThrow('TOSS_PAYMENTS_API'),
			});
		},
		inject: [ConfigService],
	},
	PlanPaymentRepository,
	PlanBillingRepository,
	PricePlanRepository,
];

const app: Provider[] = [
	// Command Handler
	CancelPaymentHandler,
	RegisterBillingHandler,
	ApproveBillingPaymentHandler,
	ChangeBillingPlanHandler,
	// Event Handler
	BillingRegisteredHandler,
	BillingUnregisteredHandler,
	BillingApprovedHandler,
	BillingPlanChangedHandleHandler,

	// Query Handler
	FindBillingByCustomerKeyHandler,
	FindPaymentsHandler,
	// Saga
	BillingSaga,

	// Service
	JwtService,
];

const domain: Provider[] = [
	{
		provide: InjectionToken.PLAN_TABLE_NAME,
		useFactory: (configService: ConfigService) =>
			configService.getOrThrow('PLAN_TABLE_NAME'),
		inject: [ConfigService],
	},
	{
		provide: InjectionToken.PAYMENT_TABLE_NAME,
		useFactory: (configService: ConfigService) =>
			configService.getOrThrow('PAYMENT_TABLE_NAME'),
		inject: [ConfigService],
	},
	{
		provide: InjectionToken.BILLING_TABLE_NAME,
		useFactory: (configService: ConfigService) =>
			configService.getOrThrow('BILLING_TABLE_NAME'),
		inject: [ConfigService],
	},
	{
		provide: InjectionToken.AWS_REGION,
		useFactory: (configService: ConfigService) =>
			configService.getOrThrow('AWS_CLOUDWATCH_REGION'),
		inject: [ConfigService],
	},
	PlanBilling,
	PlanPayment,
	PlanPaymentFactory,
	PlanBillingFactory,
];

@Module({
	imports: [
		ScheduleModule.forRoot(),
		CqrsModule,
		ConfigModule.forRoot({
			envFilePath:
				process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
		}),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				secret: configService.getOrThrow('JWT_SECRET_KEY'),
			}),
			inject: [ConfigService],
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
							utilities.format.nestLike('@vircle/payment', {
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
	controllers: [BillingController],
	providers: [Logger, ...domain, ...infra, ...app],
})
export class BillingModule {}
