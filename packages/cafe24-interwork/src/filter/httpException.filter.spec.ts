/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {TestingModule, Test} from '@nestjs/testing';
import {HttpExceptionFilter} from './httpException.filter';
import {WINSTON_MODULE_NEST_PROVIDER} from 'nest-winston';
import {NotFoundException} from '@nestjs/common';

describe('HttpExceptionFilter Unit Test', () => {
	let filter: HttpExceptionFilter;
	const logger = {
		error: jest.fn(),
	};
	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				HttpExceptionFilter,
				{
					provide: WINSTON_MODULE_NEST_PROVIDER,
					useValue: logger,
				},
			],
		}).compile();

		filter = module.get<HttpExceptionFilter>(HttpExceptionFilter);
	});

	it('Initialize Exception Filter', () => {
		expect(filter).toBeDefined();
	});

	it('handle exception with HttpException', () => {
		const error = new NotFoundException('TEST_ERROR');
		const host: any = {
			switchToHttp: () => ({
				getRequest: jest.fn(() => 'TEST_REQ'),
				getResponse: jest.fn(() => ({
					status: jest.fn(() => ({json: jest.fn()})),
				})),
			}),
		};

		filter.catch(error, host);

		expect(logger.error).toHaveBeenCalled();
		expect(logger.error.mock.calls[0]).toEqual([
			{exception: error, req: 'TEST_REQ'},
		]);
	});

	it('handle exception with Non-HttpException', () => {
		const error = new Error('TEST_ERROR');
		const host: any = {
			switchToHttp: () => ({
				getRequest: jest.fn(() => 'TEST_REQ'),
				getResponse: jest.fn(() => ({
					status: jest.fn(() => ({json: jest.fn()})),
				})),
			}),
		};

		filter.catch(error, host);

		expect(logger.error).toHaveBeenCalled();
		expect(logger.error.mock.calls[0]).toEqual([
			{exception: error, req: 'TEST_REQ'},
		]);
	});
});
