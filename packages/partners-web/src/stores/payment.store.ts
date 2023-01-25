import {useQuery} from '@tanstack/react-query';

import {getPaymentPriceList} from '@/api/payment.api';

export const useGetPricePlanList = (
	{
		suspense,
	}: {
		suspense: boolean;
	} = {suspense: false}
) => {
	return useQuery({
		queryKey: ['pricePlanList'],
		queryFn: getPaymentPriceList,
		suspense,
	});
};
