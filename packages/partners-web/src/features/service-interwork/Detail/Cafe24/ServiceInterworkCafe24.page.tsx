import {useCafe24GetInterworkByToken} from '@/stores';

import ServiceInterworkCafe24Introduce from '@/features/service-interwork/Detail/Cafe24/ServiceInterworkCafe24Introduce';
import ServiceInterworkCafe24Setting from '@/features/service-interwork/Detail/Cafe24/ServiceInterworkCafe24Setting';

function ServiceInterworkCafe24() {
	const {data: cafe24Interwork, isLoading} = useCafe24GetInterworkByToken();

	if (isLoading) {
		return <></>;
	}
	return cafe24Interwork ? (
		<ServiceInterworkCafe24Setting data={cafe24Interwork} />
	) : (
		<ServiceInterworkCafe24Introduce />
	);
}

export default ServiceInterworkCafe24;
