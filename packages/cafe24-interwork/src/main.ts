import {NestFactory} from '@nestjs/core';
import {Cafe24InterworkModule} from './cafe24Interwork.module';
import {NestExpressApplication} from '@nestjs/platform-express';
import {ValidationPipe} from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(
		Cafe24InterworkModule
	);
	app.setGlobalPrefix('/cafe24');
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
		})
	);

	await app.listen(80);
}
bootstrap();
