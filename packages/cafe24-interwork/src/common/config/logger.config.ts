import {Inject, Injectable} from '@nestjs/common';
import {
	utilities,
	WinstonModuleOptions,
	WinstonModuleOptionsFactory,
} from 'nest-winston';
import {ConfigService} from '@nestjs/config';
import * as winston from 'winston';
import * as WinstonCloudwatch from 'winston-cloudwatch';

@Injectable()
export class WinstonLoggerService implements WinstonModuleOptionsFactory {
	constructor(@Inject(ConfigService) private configService: ConfigService) {}

	createWinstonModuleOptions():
		| Promise<WinstonModuleOptions>
		| WinstonModuleOptions {
		const {errors, combine, json, timestamp, ms, splat, prettyPrint} =
			winston.format;

		const cloudWatchTransport = new WinstonCloudwatch({
			level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
			logGroupName: this.configService.getOrThrow(
				'AWS_CLOUDWATCH_LOG_GROUP'
			),
			logStreamName: this.configService.getOrThrow(
				'AWS_CLOUDWATCH_LOG_STREAM'
			),
			jsonMessage: true,
			awsRegion: this.configService.getOrThrow('AWS_CLOUDWATCH_REGION'),
		});
		const consoleTransport = new winston.transports.Console({
			level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
			format: winston.format.combine(
				winston.format.timestamp(),
				utilities.format.nestLike('@vircle/cafe24', {
					prettyPrint: true,
					colors: true,
				})
			),
		});

		return {
			format: combine(
				errors({stack: true}),
				json(),
				timestamp(),
				ms(),
				splat(),
				prettyPrint()
			),
			transports: [consoleTransport, cloudWatchTransport],
		};
	}
}
