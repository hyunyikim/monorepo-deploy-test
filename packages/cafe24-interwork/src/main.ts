import {NestFactory} from '@nestjs/core';
import {Cafe24InterworkModule} from './cafe24Interwork.module';
import {NestExpressApplication} from '@nestjs/platform-express';
import {ValidationPipe} from '@nestjs/common';
import * as morgan from 'morgan';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(
		Cafe24InterworkModule,
		{
			logger: ['log', 'error', 'warn', 'debug', 'verbose'],
		}
	);

	app.use(morgan('common'));

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
		})
	);

	await app.listen(3000);
}
bootstrap();
