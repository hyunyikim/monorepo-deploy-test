import {NestFactory} from '@nestjs/core';
import {VersioningType, ValidationPipe, LoggerService} from '@nestjs/common';
import {AppModule} from './app.module';
import {NestExpressApplication} from '@nestjs/platform-express';
import {WINSTON_MODULE_NEST_PROVIDER} from 'nest-winston';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

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

	logger.log(`NODE_ENV: ${process.env.NODE_ENV ?? 'UNDEFINED'}`, 'Bootstrap');

	await app.listen(9000);
}
bootstrap();
