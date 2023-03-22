import {useQuery} from '@tanstack/react-query';

import {getCategoryList, getInterworkByToken} from '@/api/cafe24.api';
import {useLoginStore} from '@/stores/auth.store';

export const useCafe24GetInterworkByToken = (
	{
		suspense,
	}: {
		suspense: boolean;
	} = {suspense: false}
) => {
	const token = useLoginStore().token;
	return useQuery({
		queryKey: ['getInterworkByToken', token],
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
