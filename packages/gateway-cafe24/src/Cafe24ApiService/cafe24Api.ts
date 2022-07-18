import {Injectable} from '@nestjs/common';
import {} from 'src/interwoking.entity';
import {AccessToken} from './type';

@Injectable()
export class Cafe24API {
	getAccessToken(authCode: string) {
		return new AccessToken();
	}
}
