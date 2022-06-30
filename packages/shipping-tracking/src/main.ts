import {ValidationPipe} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {ShippingTrackingModule} from './shipping-tracking.module';
import {NestExpressApplication} from '@nestjs/platform-express';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(
		ShippingTrackingModule
	);
	app.setGlobalPrefix('v1');

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
		})
	);
	await app.listen(5005);
}
bootstrap();
