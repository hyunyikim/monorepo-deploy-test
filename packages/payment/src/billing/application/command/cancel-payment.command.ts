import {ICommand} from '@nestjs/cqrs';

export class CancelPaymentCommand implements ICommand {
	constructor(readonly key: string) {}
}
