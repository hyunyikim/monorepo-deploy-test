import {Stack} from '@mui/material';

import ServiceInterworkCafe24Title from '@/features/service-interwork/Detail/Cafe24/ServiceInterworkCafe24Title';
import ServiceInterworkCafe24IntroduceContent from '@/features/service-interwork/Detail/Cafe24/ServiceInterworkCafe24IntroduceContent';

function ServiceInterworkCafe24Introduce() {
	return (
		<Stack
			flexDirection="column"
			width="100%"
			maxWidth="800px"
			margin="auto"
			my={5}>
			<ServiceInterworkCafe24Title />
			<ServiceInterworkCafe24IntroduceContent />
		</Stack>
	);
}

export default ServiceInterworkCafe24Introduce;
