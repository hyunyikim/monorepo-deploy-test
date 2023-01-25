import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {BillingModule} from './billing/billing.module';

@Module({
	imports: [BillingModule],
	controllers: [AppController],
})
export class AppModule {}
