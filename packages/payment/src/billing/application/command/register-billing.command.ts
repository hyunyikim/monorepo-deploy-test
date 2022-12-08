import {ICommand} from '@nestjs/cqrs';

export class RegisterBillingCommand implements ICommand {
	constructor(
		readonly authKey: string,
		readonly customerKey: string,
		readonly planId: string
	) {}
}

export class UnregisterBillingCommand implements ICommand {
	constructor(readonly customerKey: string) {}
}
