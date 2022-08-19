import {TestingModule, Test} from '@nestjs/testing';
import {InterworkRepository} from './interwork.repository';
import {DynamoDB} from 'aws-sdk';
import {Cafe24Interwork} from '../interwork.entity';
import {plainToInstance} from 'class-transformer';

const REGION = 'ap-northeast-2';
const TEST_TABLE_NAME = 'dev_interwork_cafe24';

describe('Interwork Repository Provider 테스트', () => {
	let interworkRepo: InterworkRepository;

	beforeAll(async () => {
		const ddbClient = new DynamoDB.DocumentClient({
			region: REGION,
		});
		const tableName = TEST_TABLE_NAME;
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				{
					provide: InterworkRepository,
					useFactory: () => {
						return new InterworkRepository(ddbClient, tableName);
					},
				},
			],
		}).compile();

		interworkRepo = module.get<InterworkRepository>(InterworkRepository);
	});

	it('테이블 확인', async () => {
		const ddb = new DynamoDB({region: REGION});
		const table = await ddb
			.describeTable({TableName: TEST_TABLE_NAME})
			.promise();
		console.log(table.Table?.KeySchema);
	});

	it('interworkRepo 생성', () => {
		expect(interworkRepo).toBeDefined();
	});

	it('Make new Interwork', async () => {
		const interwork = new Cafe24Interwork();
		interwork.mallId = 'MASS_ADOPTION_TEST';
		interwork.joinedAt = new Date().toISOString();
		await interworkRepo.putInterwork(interwork);
		const item = await interworkRepo.getInterwork('MASS_ADOPTION_TEST');
		expect(item).not.toBeNull();
		if (item === null) return;
		expect(item.mallId).toBe(interwork.mallId);
		expect(item.joinedAt).toBe(interwork.joinedAt);
	});

	it('Update Interwork', async () => {
		const before = await interworkRepo.getInterwork('MASS_ADOPTION_TEST');

		expect(before).not.toBeNull();
		if (before === null) return;
		before.partnerIdx = 123;
		await interworkRepo.putInterwork(before);
		const after = await interworkRepo.getInterworkByPartner(123);
		expect(after).not.toBeNull();
		if (after === null) return;
		expect(after.partnerIdx).toBe(123);
	});

	it('Get All Interwork', async () => {
		const list = await interworkRepo.getAll();
		expect(list.length).toBeGreaterThan(0);
	});

	it('Delete Interwork', async () => {
		await interworkRepo.deleteInterworkItem('MASS_ADOPTION_TEST');
		const item = await interworkRepo.getInterwork('MASS_ADOPTION_TEST');
		expect(item).toBeNull();
	});
});
