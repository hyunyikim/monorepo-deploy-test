import {VircleDomain, VircleResource} from '../../';

export class InterworkResource extends VircleResource {
	constructor(domain: VircleDomain) {
		super('interwork', domain);
	}
}
