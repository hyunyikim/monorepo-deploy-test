import {ICommand} from '@nestjs/cqrs';

export class RegisterBillingCommand implements ICommand {
	constructor(readonly authKey: string, readonly customerKey: string) {}
}

export class UnregisterBillingCommand implements ICommand {
	constructor(readonly billingKey: string) {}
}
