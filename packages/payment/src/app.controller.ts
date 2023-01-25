import {Controller, Get} from '@nestjs/common';
import {arch, hostname, networkInterfaces, type, userInfo} from 'os';

@Controller()
export class AppController {
	private readonly devMode: boolean;
	constructor() {
		this.devMode = process.env.NODE_ENV == 'development';
	}

	@Get('health')
	healthCheck() {
		return {
			hostname: hostname(),
			mode: process.env.NODE_ENV,
			userInfo: this.devMode ? userInfo() : undefined,
			type: this.devMode ? type() : undefined,
			cpuArchitecture: this.devMode ? arch() : undefined,
			networkInterfaces: this.devMode ? networkInterfaces() : undefined,
		};
	}
}
