import {getBrandList} from '@/api/brand.api';
import {useLoginStore} from '@/stores/auth.store';
import {useQuery} from '@tanstack/react-query';

export const useGetSearchBrandList = () => {
	const token = useLoginStore().token;
	return useQuery({
		queryKey: ['searchBrandList', token],
		queryFn: () => (token ? getBrandList() : null),
		select: (data) =>
			data?.map((item) => ({
				value: item.idx,
				label: item.label,
			})),
	});
};
