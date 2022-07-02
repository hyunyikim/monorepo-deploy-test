import {
	CacheInterceptor,
	Controller,
	Get,
	Query,
	UseInterceptors,
} from '@nestjs/common';
import {SweetTrackerService} from './sweet-tracker/sweet-tracker.service';

@Controller('shipping-tracking')
export class ShippingTrackingController {
	constructor(private readonly trackingService: SweetTrackerService) {}

	@Get('companies')
	@UseInterceptors(CacheInterceptor)
	async getCompanies() {
		return await this.trackingService.getDeliveryCompanies();
	}

	@Get('recommend')
	@UseInterceptors(CacheInterceptor)
	async getRecommend(@Query('tracking') trackingNum: string) {
		return await this.trackingService.getRecommendCompanies(trackingNum);
	}

	@Get('')
	@UseInterceptors(CacheInterceptor)
	async getTrackingInfo(
		@Query('tracking') trackingNum: string,
		@Query('company') companyCode: string
	) {
		console.log(trackingNum, companyCode);

		return await this.trackingService.getTrackingInfo(
			trackingNum,
			companyCode
		);
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
			companyCode,
			1
		);
		return html;
	}
}
