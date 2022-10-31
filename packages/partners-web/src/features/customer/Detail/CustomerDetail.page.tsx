import {useParams} from 'react-router-dom';

import {Box} from '@mui/material';

import CustomerDetailInfo from './CustomerDetailInfo';
import CustomerDetailTab from './CustomerDetailTab';

function CustomerDetail() {
	const params = useParams();
	return (
		<Box>
			<CustomerDetailInfo idx={Number(params.idx)} />
			<CustomerDetailTab idx={Number(params.idx)} />
		</Box>
	);
}

export default CustomerDetail;
