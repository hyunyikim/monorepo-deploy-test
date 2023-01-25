import {Options} from '@/@types';
import {Stack, Tabs, Tab as MuiTab, Theme} from '@mui/material';
import {SystemStyleObject} from '@mui/system';
import {SxProps} from '@mui/system';

interface Props {
	tabLabel: string;
	selected: any;
	options: Options;
	sx?: SystemStyleObject<Theme>;
	children?: React.ReactNode;
	handleChange: (
		event: React.SyntheticEvent<Element, Event>,
		value: any
	) => void;
}

function Tab({
	tabLabel,
	selected,
	options,
	sx = {},
	children,
	handleChange,
}: Props) {
	return (
		// TODO: style 에러
		<Stack
			mt={{
				xs: '16px',
				md: '40px',
			}}
			flexDirection="row"
			justifyContent={children ? 'space-between' : 'flex-start'}
			sx={{
				borderBottom: 1,
				borderColor: 'divider',
				...sx,
			}}>
			<Tabs
				value={selected || options[0].value}
				onChange={handleChange}
				aria-label={tabLabel}
				sx={{
					width: 'fit-content',
					'& .MuiButtonBase-root.MuiTab-root': {
						fontSize: 14,
						lineHeight: 1.45,
						minWidth: '0',
						'&.Mui-selected': {
							fontWeight: 700,
						},
					},
				}}>
				{options?.map((option) => (
					<MuiTab
						key={option.value}
						label={option.label}
						value={option.value}
						{...a11yProps(option.value)}
					/>
				))}
			</Tabs>
			{children}
		</Stack>
	);
}

function a11yProps(value: any) {
	const tabValue = String(value);
	return {
		id: `tab-${tabValue}`,
		'aria-controls': `tabpanel-${tabValue}`,
	};
}

export default Tab;
