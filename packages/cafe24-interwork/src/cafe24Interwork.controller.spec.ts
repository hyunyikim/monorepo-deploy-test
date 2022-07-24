import {Test, TestingModule} from '@nestjs/testing';
import {Cafe24InterworkController} from './cafe24Interwork.controller';
import {Cafe24InterworkService} from './cafe24Interwork.service';

describe('GatewayCafe24Controller', () => {
	let cafe24InterworkController: Cafe24InterworkController;

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [Cafe24InterworkController],
			providers: [Cafe24InterworkService],
		}).compile();

		cafe24InterworkController = app.get<Cafe24InterworkController>(
			Cafe24InterworkController
		);
	});

	describe('root', () => {
		it('should return "Hello World!"', () => {
			expect(1 + 1).toBe(2);
		});
	});
});
