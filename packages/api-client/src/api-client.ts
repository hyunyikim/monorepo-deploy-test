import {DomainOption} from './domain';
import {Cafe24Domain} from './domain/cafe24';
export interface ApiClientOptions {
	apiUrl: string;
	timeout: number;
	domain: {
		core?: DomainOption;
		cafe24?: DomainOption;
	};
}

export class ApiClient {
	cafe24: Cafe24Domain;
	constructor(private token?: string, readonly option?: ApiClientOptions) {
		this.cafe24 = new Cafe24Domain(this);
	}
}
