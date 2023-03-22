import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {NestFactory} from '@nestjs/core';
import {Cafe24InterworkModule} from './cafe24Interwork.module';
import {NestExpressApplication} from '@nestjs/platform-express';
import {LoggerService, ValidationPipe, VersioningType} from '@nestjs/common';
import {WINSTON_MODULE_NEST_PROVIDER} from 'nest-winston';
import {RequestInterceptor} from './common/middleware/request.interceptor';
import {AllExceptionsFilter} from 'src/filter';
import {ResponseInterceptor} from 'src/common/middleware/response.interceptor';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(
		Cafe24InterworkModule
	);

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
	app.useGlobalInterceptors(new RequestInterceptor());
	app.useGlobalInterceptors(new ResponseInterceptor());
	app.useGlobalFilters(new AllExceptionsFilter());

	const config = new DocumentBuilder()
		.setTitle('카페24 연동')
		.setDescription('카페24 연동 문서입니다.')
		.setVersion('1.0')
		.addBearerAuth(
			{
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'Jwt',
				name: 'Token',
				in: 'header',
				description: 'JWT 토큰',
			},
			'Token'
		)
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('cafe24-interwork/api', app, document);

	logger.log(`NODE_ENV: ${process.env.NODE_ENV ?? 'UNDEFINED'}`);

	await app.listen(3000);
}
bootstrap();
