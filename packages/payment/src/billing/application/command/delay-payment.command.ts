import {ICommand} from '@nestjs/cqrs';
import {Billing} from '../../domain';

export class DelayPaymentCommand implements ICommand {
	constructor(
		readonly partnerIdx: number,
		readonly billing: Billing,
		readonly orderId: string,
		readonly payAmount: number
	) {}
}
