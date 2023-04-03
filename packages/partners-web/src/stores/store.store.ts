import {useQuery} from '@tanstack/react-query';

import {getStoreList} from '@/api/store.api';
import {useLoginStore} from '@/stores/auth.store';

export const useGetStoreList = () => {
	const token = useLoginStore().token;
	return useQuery({
		queryKey: ['storeList', token],
		queryFn: getStoreList,
		select: (data) =>
			data.data
				.map((item) => ({
					value: item.idx,
					label: item.name,
				}))
				.sort((a, b) => {
					const aLabel = a.label.toUpperCase();
					const bLabel = b.label.toUpperCase();
					return aLabel === bLabel ? 0 : aLabel < bLabel ? -1 : 1;
				}),
	});
};
