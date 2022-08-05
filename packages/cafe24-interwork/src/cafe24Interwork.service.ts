import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {Cafe24Interwork, IssueSetting} from './interwork.entity';
import {Cafe24API} from './Cafe24ApiService/cafe24Api';
import {InterworkRepository} from './DynamoRepo/interwork.repository';
import {DateTime} from 'luxon';
import {VircleCoreAPI} from './vircleCoreApiService';
import {TokenInfo} from './getToken.decorator';
@Injectable()
export class Cafe24InterworkService {
	constructor(
		@Inject() private readonly cafe24Api: Cafe24API,
		@Inject() private readonly interworkRepo: InterworkRepository,
		@Inject() private readonly vircleCoreApi: VircleCoreAPI
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
		return await this.interworkRepo.getInterworkByPartner(partnerIdx);
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
			throw new NotFoundException('The interwork dose not exist.');
		}

		const partnership = await this.vircleCoreApi.getPartnerInfo(token);

		interwork.partnerIdx = partnerIdx;
		interwork.coreApiToken = token;
		interwork.updatedAt = DateTime.now().toISO();
		interwork.confirmedAt = DateTime.now().toISO();
		interwork.issueSetting = {
			issueCategories: ['ALL'],
			issueCustomerGroups: ['ALL'],
			issueProducts: ['ALL'],
			issueTiming: 'AFTER_DELIVERED',
		};
		interwork.partnerInfo = partnership;

		await this.interworkRepo.putInterwork(interwork);
		return interwork;
	}

	/**
	 * refreshToken으로 AccessToken을 재발급
	 * @param partnerIdx
	 * @returns
	 */
	async refreshAccessToken(partnerIdx: number) {
		const interwork = await this.interworkRepo.getInterworkByPartner(
			partnerIdx
		);

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
	 * Cafe24 연동을 중지함
	 * @param mallId
	 * @returns
	 */
	async inactivateInterwork(mallId: string) {
		const interwork = await this.interworkRepo.getInterwork(mallId);

		if (interwork === null) {
			throw new NotFoundException('The interwork dose not exist.');
		}

		interwork.leavedAt = DateTime.now().toISO();
		await this.interworkRepo.putInterwork(interwork);
		return interwork;
	}

	async changeInterworkSetting(mallId: string, setting: IssueSetting) {
		const interwork = await this.interworkRepo.getInterwork(mallId);

		if (interwork === null) {
			throw new NotFoundException('The interwork dose not exist.');
		}
		interwork.issueSetting = setting;
		interwork.updatedAt = DateTime.now().toISO();
		await this.interworkRepo.putInterwork(interwork);
		return interwork;
	}

	async changeLeaveReason(mallId: string, reasons: string[]) {
		const interwork = await this.getInterworkInfo(mallId);

		if (!interwork) {
			throw new NotFoundException('The interwork dose not exist.');
		}

		interwork.reasonForLeave = reasons;
		await this.interworkRepo.putInterwork(interwork);
		return interwork;
	}
}
