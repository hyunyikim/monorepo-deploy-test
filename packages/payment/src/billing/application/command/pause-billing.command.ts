import {ICommand} from '@nestjs/cqrs';

export class PauseBillingCommand implements ICommand {
	constructor(readonly customerKey: string) {}
}

export class ResumeBillingCommand implements ICommand {
	constructor(readonly customerKey: string) {}
}
