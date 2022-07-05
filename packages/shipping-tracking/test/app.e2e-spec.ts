import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication, ValidationPipe} from '@nestjs/common';
import * as request from 'supertest';
import {ShippingTrackingModule} from '../src/shipping-tracking.module';
import {HttpExceptionFilter} from '../src/http-exception';
import {TransformInterceptor} from '../src/transform.interceptor';

describe('AppController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [ShippingTrackingModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.setGlobalPrefix('v1');
		app.useGlobalFilters(new HttpExceptionFilter());
		app.useGlobalInterceptors(new TransformInterceptor());
		app.useGlobalPipes(
			new ValidationPipe({
				transform: true,
			})
		);
		await app.init();
	});

	it('(GET) /v1/shipping-tracking/companies ', async () => {
		const res = await request(app.getHttpServer())
			.get('/v1/shipping-tracking/companies')
			.expect(200);

		expect(res.body.companyList).toBeInstanceOf(Array);
		const company = res.body.companyList.pop();
		expect(company).toHaveProperty('name');
		expect(company).toHaveProperty('code');
		expect(company).toHaveProperty('international');
	});

	it('(GET) /v1/shipping-tracking/recommend', async () => {
		const res = await request(app.getHttpServer())
			.get('/v1/shipping-tracking/recommend')
			.query({tracking: '513429365643'})
			.expect(200);
		expect(res.body.recommendList).toBeInstanceOf(Array);
		const company = res.body.recommendList.pop();
		expect(company).toHaveProperty('name');
		expect(company).toHaveProperty('code');
		expect(company).toHaveProperty('international');
	});

	it('(GET) /v1/shipping-tracking', async () => {
		const res = await request(app.getHttpServer())
			.get('/v1/shipping-tracking')
			.query({tracking: '530426042882', company: '05'})
			.expect(200);

		const trackingInfo = res.body;
		expect(trackingInfo).toHaveProperty('result');
		expect(trackingInfo).toHaveProperty('trackingNo');
		expect(trackingInfo).toHaveProperty('trackingStep');
		expect(trackingInfo.complete).toBeTruthy();
		expect(trackingInfo.trackingDetails).toBeInstanceOf(Array);
	});
});
