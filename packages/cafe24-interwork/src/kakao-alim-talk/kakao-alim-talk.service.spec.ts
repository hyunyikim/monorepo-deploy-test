import {Test, TestingModule} from '@nestjs/testing';
import {KakaoAlimTalkService} from './kakao-alim-talk.service';

describe('KakaoAlimTalkService', () => {
	let service: KakaoAlimTalkService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [KakaoAlimTalkService],
		}).compile();

		service = module.get<KakaoAlimTalkService>(KakaoAlimTalkService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
