import {ICommand} from '@nestjs/cqrs';
import {TokenInfo} from 'src/billing/interface/getToken.decorator';

export class ChangeBillingPlanCommand implements ICommand {
	constructor(readonly planId: string, readonly token: TokenInfo) {}
}
