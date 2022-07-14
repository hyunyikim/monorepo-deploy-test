import {Test, TestingModule} from '@nestjs/testing';
import {GatewayCafe24Controller} from './gateway-cafe24.controller';
import {GatewayCafe24Service} from './gateway-cafe24.service';

describe('GatewayCafe24Controller', () => {
	let gatewayCafe24Controller: GatewayCafe24Controller;

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [GatewayCafe24Controller],
			providers: [GatewayCafe24Service],
		}).compile();

		gatewayCafe24Controller = app.get<GatewayCafe24Controller>(
			GatewayCafe24Controller
		);
	});

	describe('root', () => {
		it('should return "Hello World!"', () => {
			expect(gatewayCafe24Controller.getHello()).toBe('Hello World!');
		});
	});
});
