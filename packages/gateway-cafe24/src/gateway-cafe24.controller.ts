import {Controller, Get, Post} from '@nestjs/common';
import {GatewayCafe24Service} from './gateway-cafe24.service';

@Controller()
export class GatewayCafe24Controller {
	constructor(private readonly gatewayCafe24Service: GatewayCafe24Service) {}

	@Get(':ver')
	getHello(): string {
		return this.gatewayCafe24Service.getHello();
	}
}
