import {ListResponseV2, Store} from '@/@types';
import {instance} from '@/api';

export const getStoreList = async () => {
	return await instance.get<ListResponseV2<Store[]>>(`/v1/admin/store`);
};
