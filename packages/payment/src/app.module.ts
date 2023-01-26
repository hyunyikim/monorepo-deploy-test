import {MiddlewareConsumer, Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {BillingModule} from './billing/billing.module';
import {AppLoggerMiddleware} from './middleware/app.logger.middleware';

@Module({
	imports: [BillingModule],
	controllers: [AppController],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(AppLoggerMiddleware).forRoutes('*');
	}
}
