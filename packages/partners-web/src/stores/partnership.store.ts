import {useQuery} from '@tanstack/react-query';

import {getPartnershipInfo} from '@/api/partnership.api';
import {useLoginStore} from '@/stores/auth.store';

export const useGetPartnershipInfo = () => {
	const token = useLoginStore().token;
	return useQuery({
		queryKey: ['partnershipInfo', token],
		queryFn: async () => (token ? await getPartnershipInfo() : null),
	});
};

export const useGetGuaranteeSettingCompleted = () => {
	const token = useLoginStore().token;
	return useQuery({
		queryKey: ['partnershipInfo', token],
		queryFn: async () => (token ? await getPartnershipInfo() : null),
		select: (data) => {
			return data?.profileImage ? true : false;
		},
	});
};
