import {
	Inject,
	Injectable,
	LoggerService,
	NotFoundException,
} from '@nestjs/common';
import {Cafe24API} from 'src/cafe24Api';
import {WINSTON_MODULE_NEST_PROVIDER} from 'nest-winston';
import {Cafe24Interwork} from 'src/cafe24Interwork/interwork.entity';
import {InterworkRepository} from 'src/dynamo/interwork.repository';
import {Cron} from '@nestjs/schedule';

@Injectable()
export class TokenRefresher {
	constructor(
		@Inject(Cafe24API) private cafe24Api: Cafe24API,
		@Inject(InterworkRepository) private interworkRepo: InterworkRepository,
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: LoggerService,
		@Inject('CRON_TASK_ON') private cronTask: boolean
	) {}

	@Cron('0 0 0 * * *', {name: 'ACCESS_TOKEN_REFRESH'})
	async refreshAll() {
		if (!this.cronTask) return;
		const interworkList = await this.interworkRepo.getAll();
		const mallIdList: string[] = [];
		const failedList: string[] = [];
		for (const interwork of interworkList) {
			try {
				const refreshed = await this.refreshAccessToken(interwork);
				mallIdList.push(refreshed.mallId);
			} catch (error) {
				this.logger.error(error);
				failedList.push(interwork.mallId);
			}
		}
		this.logger.log({
			task: 'ACCESS_TOKEN_REFRESH',
			successMallIds: mallIdList,
			failureMallIds: failedList,
		});
	}

	/**
	 * refreshToken으로 AccessToken을 재발급
	 * @param interwork
	 * @returns
	 */
	async refreshAccessToken(interwork: Cafe24Interwork) {
		if (interwork === null) {
			throw new NotFoundException('The interwork dose not exist.');
		}

		const {mallId, accessToken} = interwork;
		const token = await this.cafe24Api.refreshAccessToken(
			mallId,
			accessToken.refresh_token
		);
		interwork.accessToken = token;
		await this.interworkRepo.putInterwork(interwork);
		return interwork;
	}

	/**
	 * 만료된 토큰을 초기화함
	 * @param interwork 연동 정보
	 * @param cutoffMin expired 까지 남은 시간 (분)
	 * @returns
	 */
	async refreshExpiredAccessToken(interwork: Cafe24Interwork, cutoffMin = 0) {
		const expiredTime = new Date(interwork.accessToken.expires_at);
		const now = new Date();
		// expiredTime에 10분 이하로 남았을때 토크 리프레쉬
		if ((expiredTime.valueOf() - now.valueOf()) / 60 / 1000 < cutoffMin) {
			return await this.refreshAccessToken(interwork);
		}
		return interwork;
	}
}
