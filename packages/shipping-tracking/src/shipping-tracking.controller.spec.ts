import {Test, TestingModule} from '@nestjs/testing';
import {ShippingTrackingController} from './shipping-tracking.controller';
import {SweetTrackerService} from './sweet-tracker/sweet-tracker.service';

describe('AppController', () => {
	let appController: ShippingTrackingController;

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [ShippingTrackingController],
			providers: [SweetTrackerService],
		}).compile();

		appController = app.get<ShippingTrackingController>(
			ShippingTrackingController
		);
	});

	describe('root', () => {
		it('should return "Hello World!"', () => {
			expect(1 + 1).toBe(2);
		});
	});
});
