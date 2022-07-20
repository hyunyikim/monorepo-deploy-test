import {Module} from '@nestjs/common';
import {Cafe24InterworkController} from './cafe24Interwork.controller';
import {Cafe24InterworkService} from './cafe24Interwork.service';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {Cafe24API} from './Cafe24ApiService/cafe24Api';
@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath:
				process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
		}),
	],
	controllers: [Cafe24InterworkController],
	providers: [
		Cafe24InterworkService,
		{
			provide: Cafe24API,
			useFactory: (configService: ConfigService) => {
				const clientId = configService.get<string>('CAFE24_CLIENT_ID');
				const secretKey =
					configService.get<string>('CAFE24_SECRET_KEY');
				return new Cafe24API(clientId, secretKey);
			},
			inject: [ConfigService],
		},
	],
})
export class Cafe24InterworkModule {}
