import {ApiClient} from 'src/api-client';

export interface HealthCheckResponse {
	ok: boolean;
	error?: string;
}

export interface DomainOption {
	apiUrl: string;
	timeout: number;
	header: Record<string, string>;
}

export abstract class VircleDomain {
	constructor(readonly name: string, private client: ApiClient) {}

	abstract healthCheck(): HealthCheckResponse;
}

export abstract class VircleResource {
	constructor(readonly name: string, private domain: VircleDomain) {}
}
