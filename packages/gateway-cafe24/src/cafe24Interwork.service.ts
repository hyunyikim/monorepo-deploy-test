import {Injectable} from '@nestjs/common';
import {Cafe24Interwork} from './interwoking.entity';

@Injectable()
export class Cafe24InterworkService {
	getInterworkInfo(partnerIdx: number) {
		return new Cafe24Interwork();
	}

	/**
	 * Cafe24와 연동을 생성합니다.
	 * @param partnerIdx
	 * @returns
	 */
	createNewInterwork(partnerIdx: number) {
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
