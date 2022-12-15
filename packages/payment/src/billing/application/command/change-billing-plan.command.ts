import {ICommand} from '@nestjs/cqrs';

export class ChangeBillingPlanCommand implements ICommand {
	constructor(readonly customerKey: string, readonly planId: string) {}
}
