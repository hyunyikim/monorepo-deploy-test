import {NestFactory} from '@nestjs/core';
import {Cafe24InterworkModule} from './cafe24Interwork.module';
import {NestExpressApplication} from '@nestjs/platform-express';
import {ValidationPipe} from '@nestjs/common';
import * as morgan from 'morgan';
import {DateTime} from 'luxon';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(
		Cafe24InterworkModule,
		{
			logger: ['log', 'error', 'warn', 'debug', 'verbose'],
		}
	);
	if (process.env.NODE_ENV === 'development') {
		app.setGlobalPrefix('cafe24');
	}
	app.enableCors();

	morgan.token('date', () => {
		return DateTime.now().toISO();
	});
	app.use(
		morgan(
			`:remote-addr - :remote-user [:date] ":method :url HTTP/:http-version" :status :res[content-length]`
		)
	);

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
		})
	);

	await app.listen(3000);
}
bootstrap();
