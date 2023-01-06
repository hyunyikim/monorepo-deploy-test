import {useParams} from 'react-router-dom';

import {Box} from '@mui/material';

import CustomerDetailInfo from './CustomerDetailInfo';
import CustomerDetailTab from './CustomerDetailTab';

function CustomerDetail() {
	const params = useParams();
	const name = params?.name;
	const phone = params?.phone;
	if (!name || !phone) return null;

	return (
		<Box p={5}>
			<CustomerDetailInfo name={name} phone={phone} />
			<CustomerDetailTab name={name} phone={phone} />
		</Box>
	);
}

export default CustomerDetail;
