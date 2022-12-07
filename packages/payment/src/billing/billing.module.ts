import {Logger, Module, Provider} from '@nestjs/common';
import {BillingController} from './interface/billing.controller';
import {CqrsModule} from '@nestjs/cqrs';
import {TossPaymentsAPI} from './infrastructure/api-client';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {
	CancelPaymentHandler,
	RegisterBillingHandler,
} from './application/command';
import {FindBillingByCustomerKeyHandler} from './application/query';
import {
	BillingRegisteredHandler,
	BillingUnregisteredHandler,
} from './application/event';
import {PlanBillingRepository} from './infrastructure/respository/billing.repository';
import {PlanPaymentRepository} from './infrastructure/respository/payment.repository';
import {PricePlanRepository} from './infrastructure/respository/plan.repository';
import {
	PlanBilling,
	PlanBillingFactory,
	PlanPayment,
	PlanPaymentFactory,
} from './domain';
import {InjectionToken} from '../injection.token';
import {BillingSaga} from './application/sagas';

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

	// Event Handler
	BillingRegisteredHandler,
	BillingUnregisteredHandler,

	// Query Handler
	FindBillingByCustomerKeyHandler,

	// Saga
	BillingSaga,
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
		CqrsModule,
		ConfigModule.forRoot({
			envFilePath:
				process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
		}),
	],
	controllers: [BillingController],
	providers: [Logger, ...domain, ...infra, ...app],
})
export class BillingModule {}
