import {ICommand} from '@nestjs/cqrs';
import {TokenInfo} from 'src/billing/interface/getToken.decorator';
import {BillingProps} from '../../domain';

export class ChangeBillingPlanCommand implements ICommand {
	constructor(readonly planId: string, readonly token: TokenInfo) {}
}
