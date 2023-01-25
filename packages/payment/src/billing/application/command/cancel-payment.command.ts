import {ICommand} from '@nestjs/cqrs';

export class CancelPaymentCommand implements ICommand {
	constructor(readonly partnerIdx: number, readonly key: string) {}
}
