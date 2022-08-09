import {ConfigModule, ConfigService} from '@nestjs/config';
import {Test, TestingModule} from '@nestjs/testing';
import {Store} from '../Cafe24ApiService';
import {Cafe24Interwork} from '../interwork.entity';

import {SlackReporter} from './slackReporter';

describe('SlackReporter Provider 테스트', () => {
	let slackReporter: SlackReporter;
	const testInterwork = new Cafe24Interwork();
	const store = new Store();

	testInterwork.store = store;
	testInterwork.store.address1 = '서울시 어쩌구 저쩌동';
	testInterwork.store.address2 = '123 303';
	testInterwork.store.mall_id = 'massive';
	testInterwork.store.phone = '010-3333-4444';
	testInterwork.store.base_domain = 'massive.cafe24.com';
	testInterwork.store.shop_name = 'massive shop';
	testInterwork.store.shop_no = 123;
	testInterwork.store.company_name = '매시브';
	testInterwork.store.company_registration_no = '232-23232-231';
	testInterwork.store.email = 'team@massive.com';
	testInterwork.reasonForLeave = '테스트 중 입니다.';

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					envFilePath: '.env.dev',
				}),
			],
			providers: [
				{
					provide: SlackReporter,
					useFactory: (configService: ConfigService) => {
						return new SlackReporter(
							configService.getOrThrow<string>('SLACK_BOT_TOKEN'),
							'C03SGDZ4GGP'
						);
					},
					inject: [ConfigService],
				},
			],
		}).compile();

		slackReporter = module.get<SlackReporter>(SlackReporter);
	});

	it('SlackReporter 초기화', () => {
		expect(slackReporter).toBeDefined();
	});

	it('연동 시작 리포트 슬랙 메세지 전송', async () => {
		const res = await slackReporter.sendInterworkReport(testInterwork);
		expect(res.ok).toBeTruthy();
		expect(res.message?.blocks).toHaveLength(5);
		if (res.ts) {
			await slackReporter.sendThreadReply(
				res.ts,
				'이 메세지는 테스트 메세지 입니다.'
			);
		}
	});

	it('연동 해제 슬랙 메세지 전송', async () => {
		const res = await slackReporter.sendLeaveReport(testInterwork);
		expect(res.ok).toBeTruthy();
		expect(res.message?.blocks).toHaveLength(5);
		if (res.ts) {
			await slackReporter.sendThreadReply(
				res.ts,
				'이 메세지는 테스트 메세지 입니다.'
			);
		}
	});

	it('슬랙 메세지 삭제', async () => {
		const {ts} = await slackReporter.sendLeaveReport(testInterwork);
		if (!ts) {
			throw new Error('테스트 실패');
		}
		const res = await slackReporter.deleteReport(ts);
		expect(res.ok).toBeTruthy();
		expect(res.ts).toBe(ts);
	});
});
