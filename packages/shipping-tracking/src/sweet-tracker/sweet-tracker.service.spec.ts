import {Test, TestingModule} from '@nestjs/testing';
import {SweetTrackerService} from './sweet-tracker.service';

describe('SweetTrackerService', () => {
	let service: SweetTrackerService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [SweetTrackerService],
		}).compile();

		service = module.get<SweetTrackerService>(SweetTrackerService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
