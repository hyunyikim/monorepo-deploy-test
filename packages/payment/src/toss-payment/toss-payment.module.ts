import {Module, Logger, Provider} from '@nestjs/common';
import {TossPaymentController} from './interface/toss-payment.controller';
import {CqrsModule} from '@nestjs/cqrs';

const infra: Provider[] = [];

const app: Provider[] = [];

const domain: Provider[] = [];

@Module({
	imports: [CqrsModule],
	controllers: [TossPaymentController],
	providers: [Logger, ...infra, ...app, ...domain],
})
export class TossPaymentModule {}
