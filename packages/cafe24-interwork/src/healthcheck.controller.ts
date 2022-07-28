import {Controller, Get} from '@nestjs/common';
import {hostname, networkInterfaces, userInfo, type, arch} from 'os';

@Controller()
export class HealthCheckController {
	private devMode: boolean;
	constructor() {
		this.devMode = process.env.NODE_ENV == 'development';
	}
	@Get('')
	healthCheck() {
		return {
			hostname: hostname(),
			userInfo: this.devMode ? userInfo() : undefined,
			type: this.devMode ? type() : undefined,
			cpuArchitecture: this.devMode ? arch() : undefined,
			networkInterfaces: this.devMode ? networkInterfaces() : undefined,
		};
	}
}
