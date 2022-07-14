import {Injectable} from '@nestjs/common';

@Injectable()
export class GatewayCafe24Service {
	getHello(): string {
		return 'Hello World!';
	}

	getCafe24Info(partnerIdx: number) {
		return 'hello';
	}

	createNewPartner(partnerIdx: number) {
		return 'new partner';
	}
}
