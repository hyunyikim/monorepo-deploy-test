import {NestFactory} from '@nestjs/core';
import {GatewayCafe24Module} from './gateway-cafe24.module';
import {NestExpressApplication} from '@nestjs/platform-express';
import {ValidationPipe} from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(
		GatewayCafe24Module
	);
	app.setGlobalPrefix('/cafe24');
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
		})
	);

	await app.listen(3000);
}
bootstrap();
