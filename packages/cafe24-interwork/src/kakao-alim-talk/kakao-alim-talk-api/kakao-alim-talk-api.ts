import {Injectable} from '@nestjs/common';
import {Axios} from 'axios';

@Injectable()
export class KaKaoAlimTalkApi {
	private httpAgent: Axios;
	constructor(
		private senderKey: string,
		keys: {
			appKey: string;
			secretKey: string;
		}
	) {
		this.httpAgent = new Axios({
			baseURL: `https://api-alimtalk.cloud.toast.com/alimtalk/v2.2/appkeys/${keys.appKey}`,
			headers: {
				'X-Secret-Key': keys.secretKey,
				'Content-Type': 'application/json;charset=UTF-8',
			},
		});
	}

	async sendMessages(
		templateCode: string,
		recipients: {
			phoneNo: string;
			params: Record<string, string>;
			buttons?: {
				ordering: number;
				chatExtra: string;
				chatEvent: string;
				target: string;
			}[];
		}[]
	) {
		const body: AlimTalkMessageBody = {
			senderKey: this.senderKey,
			templateCode: templateCode,
			recipientList: recipients.map((recipient) => ({
				recipientNo: recipient.phoneNo,
				templateParameter: recipient.params,
			})),
		};

		const {data} = await this.httpAgent.post<AlimTalkMessageResponse>(
			'/messages',
			JSON.stringify(body)
		);
		return data;
	}
}

interface AlimTalkMessageBody {
	senderKey: string;
	templateCode: string;
	requestDate?: string;
	senderGroupingKey?: string;
	createUser?: string;
	recipientList: {
		recipientNo: string;
		templateParameter: Record<string, string>;
		resendParameter?: {
			isResend: boolean;
			resendType: string;
			resendTitle: string;
			resendContent: string;
			resendSendNo: string;
		};
		buttons?: {
			ordering: number;
			chatExtra: string;
			chatEvent: string;
			target: string;
		}[];
		recipientGroupingKey?: string;
	}[];

	messageOption?: {
		price: number;
		currencyType: string;
	};
	statsId?: string;
}

interface AlimTalkMessageResponse {
	header: {
		resultCode: number;
		resultMessage: string;
		isSuccessful: boolean;
	};
	message: {
		requestId: string;
		senderGroupingKey: string;
		sendResults: {
			recipientSeq: number;
			recipientNo: string;
			resultCode: number;
			resultMessage: string;
			recipientGroupingKey: string;
		}[];
	};
}
