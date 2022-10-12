import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {TossPaymentModule} from './toss-payment/toss-payment.module';
import {TossPaymentController} from './toss-payment/interface/toss-payment.controller';

@Module({
	imports: [TossPaymentModule],
	controllers: [AppController, TossPaymentController],
	providers: [AppService],
})
export class AppModule {}
