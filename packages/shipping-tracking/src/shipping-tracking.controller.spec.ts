import {CacheModule} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {ShippingTrackingController} from './shipping-tracking.controller';
import {SweetTrackerService} from './sweet-tracker/sweet-tracker.service';
import {DeliveryCompanies, TrackingInfo} from './sweet-tracker/type';

describe('AppController', () => {
	let appController: ShippingTrackingController;

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			imports: [
				CacheModule.register({
					ttl: 3000,
					max: 10,
				}),
			],
			controllers: [ShippingTrackingController],
			providers: [
				{
					provide: SweetTrackerService,
					useValue: new SweetTrackerService('x83AAYKy606RKk81KvlbgA'),
				},
			],
		}).compile();

		appController = app.get<ShippingTrackingController>(
			ShippingTrackingController
		);
	});

	describe('root', () => {
		it('should return "Hello World!"', async () => {
			const response = await appController.getCompanies();
			expect(response).toBeInstanceOf(DeliveryCompanies);
		});

		it('should return "Hello World!"', async () => {
			const response = await appController.getRecommend('513429365643');
			expect(response).toBeInstanceOf(DeliveryCompanies);
		});

		it('should return "Hello World!"', async () => {
			const response = await appController.getTrackingInfo(
				'513429365643',
				'05'
			);
			expect(response).toBeInstanceOf(TrackingInfo);
			expect(response.trackingDetails).toBeInstanceOf(Array);
		});

		it('should return "Hello World!"', async () => {
			const response = await appController.getTrackingInfoHtml(
				'513429365643',
				'05'
			);
			expect(typeof response).toBe('string');
		});
	});
});
