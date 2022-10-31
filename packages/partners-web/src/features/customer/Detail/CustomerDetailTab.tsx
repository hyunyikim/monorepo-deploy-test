import {useState, useCallback} from 'react';
import {Box, Tabs, Tab} from '@mui/material';

import CustomerGuaranteeTable from '@/features/customer/Detail/CustomerGuaranteeTable';

function CustomerDetailTab({idx}: {idx: number}) {
	const [value, setValue] = useState(0);
	const handleChange = useCallback(
		(event: React.SyntheticEvent, newValue: number) => {
			setValue(newValue);
		},
		[]
	);
	return (
		<Box sx={{width: '100%'}}>
			<Box sx={{borderBottom: 1, borderColor: 'divider'}}>
				<Tabs
					value={value}
					onChange={handleChange}
					aria-label="customer detail tab"
					sx={{
						'& .MuiButtonBase-root.MuiTab-root': {
							fontWeight: 700,
							padding: '16px',
						},
					}}>
					<Tab label="개런티" {...a11yProps(0)} />
				</Tabs>
			</Box>
			<TabPanel value={value} index={0}>
				<CustomerGuaranteeTable idx={idx} />
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

function a11yProps(index: number) {
	return {
		id: `tab-${index}`,
		'aria-controls': `tabpanel-${index}`,
	};
}

export default CustomerDetailTab;
