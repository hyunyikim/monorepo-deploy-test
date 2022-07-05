import {ValidationPipe} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {ShippingTrackingModule} from './shipping-tracking.module';
import {NestExpressApplication} from '@nestjs/platform-express';
import {HttpExceptionFilter} from './http-exception';
import {TransformInterceptor} from './transform.interceptor';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(
		ShippingTrackingModule
	);
	app.setGlobalPrefix('v1');
	app.useGlobalFilters(new HttpExceptionFilter());
	app.useGlobalInterceptors(new TransformInterceptor());
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
		})
	);
	await app.listen(5005);
}
bootstrap();
