import {useState} from 'react';
import {Box} from '@mui/material';
import {Tab} from '@/components';

import CustomerGuaranteeTable from '@/features/customer/Detail/CustomerGuaranteeTable';

function CustomerDetailTab({name, phone}: {name: string; phone: string}) {
	const [value, setValue] = useState(0);
	return (
		<Box sx={{width: '100%'}}>
			<Tab
				tabLabel={'개런티'}
				selected={value}
				options={[{label: '개런티', value: 0}]}
				handleChange={(e, value) => setValue(value as number)}
			/>
			<TabPanel value={value} index={0}>
				<CustomerGuaranteeTable name={name} phone={phone} />
			</TabPanel>
		</Box>
	);
}

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const {children, value, index, ...other} = props;
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`tabpanel-${index}`}
			aria-labelledby={`tab-${index}`}
			{...other}>
			{value === index && <>{children}</>}
		</div>
	);
}

export default CustomerDetailTab;
