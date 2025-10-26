import { ListEndpoint } from "chanfana";

export class ChanfanaListEndpoint extends ListEndpoint {
	static openapiMeta = {};
	getSchema() {
		const base = super.getSchema();
		return { ...base, ...((this.constructor as any).openapiMeta || {}) };
	}
}
