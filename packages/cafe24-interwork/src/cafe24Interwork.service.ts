import {Inject, Injectable} from '@nestjs/common';
import {Cafe24Interwork} from './interwork.entity';
import {CreateNewInterwork} from './cafe24Interwork.dto';
import {Cafe24API} from './Cafe24ApiService/cafe24Api';

@Injectable()
export class Cafe24InterworkService {
	constructor(@Inject() private cafe24Api: Cafe24API) {}

	/**
	 *
	 * @param partnerIdx 연동 정보를 얻고자 하는 파트너스의 인덱스 값
	 * @returns
	 */
	getInterworkInfo(partnerIdx: number) {
		return new Cafe24Interwork();
	}

	/**
	 * Cafe24와 연동을 생성합니다.
	 * @param partnerIdx Cafe24 Mall과 연동을 생성하고자 하는 파트너스의 인덱스 값
	 * @returns 연동 정보를 담은 Interwork 객체
	 */
	createNewInterwork(partnerIdx: number, dto: CreateNewInterwork) {
		return new Cafe24Interwork();
	}

	/**
	 * refreshToken으로 AccessToken을 재발급
	 * @param partnerIdx
	 * @returns
	 */
	refreshAccessToken(partnerIdx: number) {
		return 'refresh';
	}

	/**
	 * Cafe24 연동을 중지함
	 * @param partnerIdx
	 * @returns
	 */
	inactivateInterwork(partnerIdx: number) {
		// REMOVE ACCESS & REFRESH TOKEN
		return '';
	}

	changeInterworkSetting() {
		return new Cafe24Interwork();
	}

	/**
	 * Cafe24 API를 통해서 Access Token 과 Refresh Token을 획득한다.
	 * @param authCode
	 * @returns
	 */
	private requestAccessToken(authCode: string) {
		return 'ACCESS TOKEN';
	}
}
