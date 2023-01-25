import {pricePlanExample} from '@/data';
import {PricePlan} from '@/@types';

export const getPaymentPriceList = () => {
	return new Promise<PricePlan[]>((resolve) => {
		setTimeout(() => {
			resolve(pricePlanExample);
		}, 100);
	});
};
