import {Module, CacheModule} from '@nestjs/common';
import {ShippingTrackingController} from './shipping-tracking.controller';
import {SweetTrackerService} from './sweet-tracker/sweet-tracker.service';
import {ConfigModule, ConfigService} from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
		}),
		CacheModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				ttl: parseInt(configService.get('CACHE_TTL')),
				max: parseInt(configService.get('CACHE_MAX')),
			}),
			inject: [ConfigService],
		}),
	],
	controllers: [ShippingTrackingController],
	providers: [
		{
			provide: SweetTrackerService,
			useFactory: (configService: ConfigService) => {
				return new SweetTrackerService(
					configService.get('SWEET_TRACKING_KEY')
				);
			},
			inject: [ConfigService],
		},
	],
})
export class ShippingTrackingModule {}
