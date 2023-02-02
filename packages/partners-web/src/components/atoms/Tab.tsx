import {Options} from '@/@types';
import {Stack, Tabs, Tab as MuiTab, Theme} from '@mui/material';
import {SxProps} from '@mui/system';

interface Props {
	tabLabel: string;
	selected: any;
	options: Options;
	sx?: SxProps<Theme>;
	children?: React.ReactNode;
	handleChange: (
		event: React.SyntheticEvent<Element, Event> | any,
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
		<Stack
			mt={{
				xs: '16px',
				md: '40px',
			}}
			flexDirection="row"
			justifyContent={children ? 'space-between' : 'flex-start'}
			sx={[
				{
					boxShadow: (theme) =>
						`0px -1px 0px 0px ${theme.palette.grey[100]} inset`,
				},
				...(Array.isArray(sx) ? sx : [sx]),
			]}>
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
						// TODO: 반응형
						minHeight: '60px',
					},
				}}>
				{options?.map((option) => (
					<MuiTab
						key={option.value}
						label={option.label}
						value={option.value}
						onClick={() => {
							handleChange(null, option.value);
						}}
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
