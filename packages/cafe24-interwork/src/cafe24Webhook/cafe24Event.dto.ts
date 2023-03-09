import {OrderItem} from 'src/cafe24Api';
import {WEBHOOK_ACTION} from 'src/common/constant/constant';

export class WebhookResponse {
	action: WEBHOOK_ACTION;
	nftReqIdx: number | undefined;
	orderItemCode: string;
	status: string;

	constructor({
		action,
		nftReqIdx,
		item,
	}: {
		action: WEBHOOK_ACTION;
		nftReqIdx: number | undefined;
		item: OrderItem;
	}) {
		this.action = action;
		this.nftReqIdx = nftReqIdx;
		this.orderItemCode = item.order_item_code;
		this.status = item.order_status;
	}
}
