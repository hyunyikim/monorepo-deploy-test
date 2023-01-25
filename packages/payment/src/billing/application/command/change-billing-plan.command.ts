import {ICommand} from '@nestjs/cqrs';
import {BillingProps} from '../../domain';

export class ChangeBillingPlanCommand implements ICommand {
	constructor(
		readonly customerKey: string,
		readonly planId: string,
		readonly currentBillingProps: BillingProps
	) {}
}
