import {Test, TestingModule} from '@nestjs/testing';
import {
	InvalidAPIKey,
	InvalidTrackingInfo,
	SweetTrackerService,
} from './sweet-tracker.service';

describe('Unit Test: SweetTrackerService', () => {
	let service: SweetTrackerService;
	let invalidKeyService: SweetTrackerService;
	const TEST_API_KEY = 'fntF44lJDP7rCv3nasZI1w';
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				{
					provide: 'INVALID_KEY_SERVICE',
					useFactory: () => {
						return new SweetTrackerService('INVALID_KEY');
					},
				},
				{
					provide: SweetTrackerService,
					useFactory: () => {
						return new SweetTrackerService(TEST_API_KEY);
					},
				},
			],
		}).compile();

		service = module.get<SweetTrackerService>(SweetTrackerService);
		invalidKeyService = module.get<SweetTrackerService>(
			'INVALID_KEY_SERVICE'
		);
	});

	it('서비스 인스턴스 생성', () => {
		expect(service).toBeDefined();
		expect(invalidKeyService).toBeDefined();
		expect(service.baseURL).toBe('http://info.sweettracker.co.kr');
	});

	it('택배사 리스트 가져오기', async () => {
		const result = await service.getDeliveryCompanies();
		expect(result.Company).toBeInstanceOf(Array);
		expect(result.Company.length).toBeGreaterThan(0);
		expect(result.Company[0].Code).toBeTruthy();
		expect(result.Company[0].Name).toBeTruthy();
	});

	it('[Error Case] 유효하지 않은 API 키에서 택배사 리스트 가져오기', async () => {
		try {
			await invalidKeyService.getDeliveryCompanies();
		} catch (error) {
			console.log('Error', error);
			expect(error).toBeInstanceOf(InvalidAPIKey);
		}
	});

	it('송장 번호 추적 ', async () => {
		const trackingNo = '513429365643';
		const companyCode = '05';
		const trackingInfo = await service.getTrackingInfo(
			trackingNo,
			companyCode
		);

		expect(trackingInfo.invoiceNo).toBe(trackingNo);
	});

	it('[Error Case] 유효하지 않은 송장번호', async () => {
		try {
			const trackingNo = '!@#!@#@!#';
			const companyCode = '05';
			await service.getTrackingInfo(trackingNo, companyCode);
		} catch (error) {
			expect(error).toBeInstanceOf(InvalidTrackingInfo);
		}
	});

	it('[Error Case] 유효하지 않은 택배사 코드', async () => {
		try {
			const trackingNo = '513429365643';
			const companyCode = '029';
			await service.getTrackingInfo(trackingNo, companyCode);
		} catch (error) {
			expect(error).toBeInstanceOf(InvalidTrackingInfo);
		}
	});
});
