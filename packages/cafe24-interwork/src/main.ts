import {NestFactory} from '@nestjs/core';
import {Cafe24InterworkModule} from './cafe24Interwork.module';
import {NestExpressApplication} from '@nestjs/platform-express';
import {LoggerService, ValidationPipe, VersioningType} from '@nestjs/common';
import * as morgan from 'morgan';
import {WINSTON_MODULE_NEST_PROVIDER} from 'nest-winston';
import {IncomingMessage, ServerResponse} from 'http';

async function bootstrap() {
	console.log(process.env.NODE_ENV);

	const app = await NestFactory.create<NestExpressApplication>(
		Cafe24InterworkModule
	);
	if (process.env.NODE_ENV === 'development') {
		app.setGlobalPrefix('cafe24');
	}
	app.enableCors();

	app.enableVersioning({
		type: VersioningType.URI,
		prefix: 'v',
	});
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

	app.use(
		morgan('tiny', {
			stream,
			skip: (req) => {
				// health check용 api는 로깅하지 않는다.
				return req.url === '/' || req.url === '/cafe24';
			},
		})
	);
	await app.listen(3000);
}
bootstrap();
