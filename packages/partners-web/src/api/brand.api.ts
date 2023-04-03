import {instance} from '@/api';

import {Brand} from '@/@types';

export const getBrandList = async () => {
	return await instance.get<Brand[]>(`/v1/admin/brand/list`);
};
