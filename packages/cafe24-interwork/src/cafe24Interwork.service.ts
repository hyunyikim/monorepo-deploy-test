import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {Cafe24Interwork, IssueSetting} from './interwork.entity';
import {Cafe24API} from './Cafe24ApiService/cafe24Api';
import {InterworkRepository} from './DynamoRepo/interwork.repository';
import {DateTime} from 'luxon';
@Injectable()
export class Cafe24InterworkService {
	constructor(
		@Inject() private cafe24Api: Cafe24API,
		@Inject() private interworkRepo: InterworkRepository
	) {}

	/**
	 * cafe24 interwork 정보를 파트너 mallId 조회합니다.
	 * @param mallId 연동 정보를 얻고자 하는 파트너스의 인덱스 값
	 * @returns
	 */
	async getInterworkInfo(mallId: string) {
		return await this.interworkRepo.getInterwork(mallId);
	}

	/**
	 * cafe24 interwork 정보를 파트너 ID로 조회합니다.
	 * @param idx
	 * @returns
	 */
	async getInterworkInfoByIdx(idx: number) {
		return await this.interworkRepo.getInterworkByPartner(idx);
	}

	/**
	 * Cafe24와 연동을 생성합니다.
	 * @param partnerIdx Cafe24 Mall과 연동을 생성하고자 하는 파트너스의 인덱스 값
	 * @returns 연동 정보를 담은 Interwork 객체
	 */
	async createNewInterwork(mallId: string, authCode: string) {
		const interwork = new Cafe24Interwork();

		const accessToken = await this.cafe24Api.getAccessToken(
			mallId,
			authCode
		);

		const store = await this.cafe24Api.getStoreInfo(
			mallId,
			accessToken.access_token
		);

		interwork.mallId = mallId;
		interwork.accessToken = accessToken;
		interwork.store = store;
		interwork.joinedAt = DateTime.now().toISO();
		interwork.leavedAt = undefined;

		await this.interworkRepo.putInterwork(interwork);

		return interwork;
	}

	async completeInterwork(mallId: string, partnerIdx: number) {
		const interwork = await this.getInterworkInfo(mallId);
		if (interwork === null) {
			throw new NotFoundException('The interwork dose not exist.');
		}
		interwork.partnerIdx = partnerIdx;
		interwork.updatedAt = DateTime.now().toISO();
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
}
