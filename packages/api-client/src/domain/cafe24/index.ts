import {ApiClient} from 'src/api-client';
import {VircleDomain} from '../';
import {HealthCheckResponse} from '../domain';
import {InterworkResource} from './resources/interwork';

export class Cafe24Domain extends VircleDomain {
	v1: {
		interwork: InterworkResource;
	};

	constructor(client: ApiClient) {
		super('cafe24', client);
		this.v1.interwork = new InterworkResource(this);
	}

	healthCheck(): HealthCheckResponse {
		return {
			ok: true,
			error: undefined,
		};
	}
}
