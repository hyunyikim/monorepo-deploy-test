import ServiceInterworkCafe24Title from '@/features/service-interwork/Detail/Cafe24/ServiceInterworkCafe24Title';
import ServiceInterworkCafe24IntroduceContent from '@/features/service-interwork/Detail/Cafe24/ServiceInterworkCafe24IntroduceContent';
import {ContentWrapper} from '@/components';

function ServiceInterworkCafe24Introduce() {
	return (
		<ContentWrapper maxWidth="800px">
			<ServiceInterworkCafe24Title />
			<ServiceInterworkCafe24IntroduceContent />
		</ContentWrapper>
	);
}

export default ServiceInterworkCafe24Introduce;
