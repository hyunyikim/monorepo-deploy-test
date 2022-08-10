import {NestFactory} from '@nestjs/core';
import {Cafe24InterworkModule} from './cafe24Interwork.module';
import {NestExpressApplication} from '@nestjs/platform-express';
import {LoggerService, ValidationPipe} from '@nestjs/common';
import * as morgan from 'morgan';
import {WINSTON_MODULE_NEST_PROVIDER} from 'nest-winston';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(
		Cafe24InterworkModule
	);
	if (process.env.NODE_ENV === 'development') {
		app.setGlobalPrefix('cafe24');
	}
	app.enableCors();

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
		})
	);

	const logger = app.get<LoggerService>(WINSTON_MODULE_NEST_PROVIDER);
	app.useLogger(logger);

	const stream: morgan.StreamOptions = {
		write: (msg: string) => {
			logger.log(msg);
		},
	};

	app.use(morgan('tiny', {stream}));

	await app.listen(3000);
}
bootstrap();
