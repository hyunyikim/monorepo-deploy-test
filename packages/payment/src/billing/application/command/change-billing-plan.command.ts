import {ICommand} from '@nestjs/cqrs';
import {BillingProps} from '../../domain';

export class ChangeBillingPlanCommand implements ICommand {
	constructor(readonly planId: string, readonly partnerIdx: number) {}
}
