import {useQuery} from '@tanstack/react-query';

import {getCategoryList, getInterworkByToken} from '@/api/cafe24.api';

export const useCafe24GetInterworkByToken = (
	{
		suspense,
	}: {
		suspense: boolean;
	} = {suspense: false}
) => {
	return useQuery({
		queryKey: ['getInterworkByToken'],
		queryFn: () => getInterworkByToken(),
		suspense,
	});
};

export const useCafe24CategoryList = (mallId: string) => {
	return useQuery({
		queryKey: ['getCategoryList', mallId],
		queryFn: () => getCategoryList(mallId),
	});
};
