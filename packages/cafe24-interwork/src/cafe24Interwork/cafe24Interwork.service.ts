import {
	Inject,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import {Cafe24Interwork, IssueSetting} from './interwork.entity';
import {Cafe24API} from '../cafe24Api/cafe24Api';
import {InterworkRepository} from '../dynamo/interwork.repository';
import {DateTime} from 'luxon';
import {VircleCoreAPI} from '../vircleCoreApiService';
import {TokenInfo} from '../getToken.decorator';
import {SlackReporter} from '../slackReporter';
import {IsNumber, IsOptional, IsString} from 'class-validator';
@Injectable()
export class Cafe24InterworkService {
	constructor(
		@Inject(Cafe24API) private readonly cafe24Api: Cafe24API,
		@Inject(InterworkRepository)
		private readonly interworkRepo: InterworkRepository,
		@Inject(VircleCoreAPI) private readonly vircleCoreApi: VircleCoreAPI,
		@Inject(SlackReporter) private readonly slackReporter: SlackReporter
	) {}

	async getAll() {
		return await this.interworkRepo.getAll();
	}

	/**
	 * cafe24에 특정 mall이 연동 되어 있는지를 확인합니다.
	 * @param mallId 연동 정보를 얻고자 하는 파트너스의 cafe24 mallId
	 * @returns 연동 = true, 비연동 = false
	 */
	async isConfirmed(mallId: string) {
		const interwork = await this.interworkRepo.getInterwork(mallId);
		if (interwork === null) {
			return false;
		} else if (interwork.leavedAt) {
			return false;
		} else if (interwork.confirmedAt) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * cafe24 interwork 정보를 파트너 mallId 조회합니다.
	 * @param mallId 연동 정보를 얻고자 하는 파트너스의 cafe24 mallId
	 * @returns
	 */
	async getInterworkInfo(mallId: string) {
		return await this.interworkRepo.getInterwork(mallId);
	}

	/**
	 * cafe24 interwork 정보를 파트너 ID로 조회합니다.
	 * @param partnerIdx Cafe24 Mall과 연동된 파트너스 계정의 인덱스 값
	 * @returns 연동 정보를 담은 Interwork 객체
	 */
	async getInterworkInfoByIdx(partnerIdx: number) {
		const interwork = await this.interworkRepo.getInterworkByPartner(
			partnerIdx
		);
		// 연동을 한적이 없거나 연동을 해재한 경우
		if (!interwork || interwork.leavedAt) {
			return null;
		}
		return interwork;
	}

	/**
	 * Cafe24와 연동을 생성합니다.
	 * @param partnerIdx Cafe24 Mall과 연동을 생성하고자 하는 파트너스의 인덱스 값
	 * @returns 연동 정보를 담은 Interwork 객체
	 */
	async requestNewInterwork(mallId: string, authCode: string) {
		const result = await this.getInterworkInfo(mallId);

		// 중복된 연동 프로세스를 방지
		if (result && result.authCode === authCode) {
			return result;
		}

		const interwork = new Cafe24Interwork();

		const accessToken = await this.cafe24Api.getAccessToken(
			mallId,
			authCode
		);

		const store = await this.cafe24Api.getStoreInfo(
			mallId,
			accessToken.access_token
		);

		interwork.authCode = authCode;
		interwork.mallId = mallId;
		interwork.accessToken = accessToken;
		interwork.store = store;
		interwork.joinedAt = DateTime.now().toISO();
		interwork.leavedAt = undefined;

		await this.interworkRepo.putInterwork(interwork);

		return interwork;
	}

	async completeInterwork(mallId: string, {token, partnerIdx}: TokenInfo) {
		const interwork = await this.getInterworkInfo(mallId);
		if (interwork === null) {
			throw new NotFoundException('NOT_FOUND_INTERWORK');
		}

		const partnership = await this.vircleCoreApi.getPartnerInfo(token);

		interwork.partnerIdx = partnerIdx;
		interwork.coreApiToken = token;
		interwork.updatedAt = DateTime.now().toISO();
		interwork.confirmedAt = DateTime.now().toISO();
		interwork.issueSetting = {
			issueAll: true,
			manually: false,
			issueCategories: [],
			issueTiming: 'AFTER_DELIVERED',
		};

		interwork.partnerInfo = partnership;

		await this.interworkRepo.putInterwork(interwork);
		this.slackReporter.sendInterworkReport(interwork);
		return interwork;
	}

	/**
	 * Cafe24 연동을 중지함
	 * @param mallId
	 * @returns
	 */
	async inactivateInterwork(mallId: string) {
		const interwork = await this.interworkRepo.getInterwork(mallId);

		if (interwork === null) {
			throw new NotFoundException('NOT_FOUND_INTERWORK');
		}

		interwork.leavedAt = DateTime.now().toISO();
		await this.interworkRepo.putInterwork(interwork);
		this.slackReporter.sendLeaveReport(interwork);
		return interwork;
	}

	async changeInterworkSetting(
		mallId: string,
		token: TokenInfo,
		setting: Partial<IssueSetting>
	) {
		const interwork = await this.interworkRepo.getInterwork(mallId);

		if (interwork === null) {
			throw new NotFoundException('NOT_FOUND_INTERWORK');
		}
		if (interwork.partnerIdx !== token.partnerIdx) {
			throw new UnauthorizedException('NOT_ALLOWED_RESOURCE_ACCESS');
		}

		interwork.issueSetting = {
			...interwork.issueSetting,
			...setting,
		};
		interwork.updatedAt = DateTime.now().toISO();
		await this.interworkRepo.putInterwork(interwork);
		return interwork;
	}

	async changeLeaveReason(mallId: string, reasons: string) {
		const interwork = await this.getInterworkInfo(mallId);

		if (!interwork) {
			throw new NotFoundException('NOT_FOUND_INTERWORK');
		}

		interwork.reasonForLeave = reasons;
		await this.interworkRepo.putInterwork(interwork);
		return interwork;
	}

	async getCategories(mallId: string, option: CategoryListParams) {
		return this.cafe24Api.getCategoryListFront(mallId, option);
	}
}

export class CategoryListParams {
	@IsOptional()
	@IsString()
	name?: string;

	@IsNumber()
	limit: number;

	@IsNumber()
	offset: number;

	@IsOptional()
	@IsNumber()
	depth?: number;
}
