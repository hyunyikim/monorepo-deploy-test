import {Controller, Get, Post} from '@nestjs/common';
import {Cafe24InterworkService} from './cafe24Interwork.service';

@Controller()
export class Cafe24InterworkController {
	constructor(
		private readonly cafe24InterworkService: Cafe24InterworkService
	) {}

	@Get(':ver')
	getHello() {
		return '';
	}
}
