import {YNType, ListResponseV2} from '@/@types';

export type StoreList = ListResponseV2<Store>;

export interface Store {
	idx: number;
	partnerIdx: number;
	name: string;
	isUsed: YNType;
	registeredAt: string;
	modifiedAt: string | null;
}
