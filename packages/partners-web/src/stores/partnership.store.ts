import {useQuery} from '@tanstack/react-query';

import {getPartnershipInfo} from '@/api/partnership.api';
import {useLoginStore} from '@/stores/auth.store';

export const useGetPartnershipInfo = () => {
	const token = useLoginStore().token;
	return useQuery({
		queryKey: ['partnershipInfo', token],
		queryFn: () => (token ? getPartnershipInfo() : null),
	});
};

// TODO: react-query 정책 다시 확인
