import {
	CacheInterceptor,
	ClassSerializerInterceptor,
	Controller,
	Get,
	Query,
	UseFilters,
	UseInterceptors,
} from '@nestjs/common';
import {instanceToPlain} from 'class-transformer';
import {HttpExceptionFilter} from './http-exception';
import {SweetTrackerService} from './sweet-tracker/sweet-tracker.service';

@UseFilters(new HttpExceptionFilter())
@Controller('shipping-tracking')
export class ShippingTrackingController {
	constructor(private readonly trackingService: SweetTrackerService) {}

	@Get('companies')
	@UseInterceptors(CacheInterceptor)
	async getCompanies() {
		const companyList = await this.trackingService.getDeliveryCompanies();
		return instanceToPlain(companyList);
	}

	@Get('recommend')
	@UseInterceptors(CacheInterceptor)
	async getRecommend(@Query('tracking') trackingNum: string) {
		const companyList = await this.trackingService.getRecommendCompanies(
			trackingNum
		);
		return instanceToPlain(companyList);
	}

	@Get('')
	@UseInterceptors(CacheInterceptor)
	async getTrackingInfo(
		@Query('tracking') trackingNum: string,
		@Query('company') companyCode: string
	) {
		const info = await this.trackingService.getTrackingInfo(
			trackingNum,
			companyCode
		);
		return instanceToPlain(info);
	}

	@Get('/render')
	@UseInterceptors(CacheInterceptor)
	async getTrackingInfoHtml(
		@Query('tracking') trackingNum: string,
		@Query('company') companyCode: string
		// @Query('theme') theme?: THEME,
	) {
		const html = await this.trackingService.getTrackingInfoHTML(
			trackingNum,
			companyCode
		);
		return html;
	}
}
