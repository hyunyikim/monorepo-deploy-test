import {TestingModule, Test} from '@nestjs/testing';

import {VircleCoreAPI} from './vircleCoreApi';

const token =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjQ1MiwidHlwZSI6IkIiLCJiMmJUeXBlIjoiQiIsImlhdCI6MTY1OTQ5MzI4NywiZXhwIjo0ODEzMDkzMjg3fQ.7ZObwT4w8bKcGFlMddHSVl1NxFFEwR35dIiICI3qzj8';

describe('Vircle Core Api Test', () => {
	let vircleApi: VircleCoreAPI;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				{
					provide: VircleCoreAPI,
					useFactory: () => {
						return new VircleCoreAPI(
							'https://dev-api.vircle.co.kr'
						);
					},
				},
			],
		}).compile();

		vircleApi = module.get<VircleCoreAPI>(VircleCoreAPI);
	});

	it('partner 정보 가져오기', async () => {
		const result = await vircleApi.getPartnerInfo(token);
		expect(result).toBeInstanceOf(Object);
	});
});
