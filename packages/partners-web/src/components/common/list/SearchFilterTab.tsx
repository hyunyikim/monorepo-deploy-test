import {useCallback} from 'react';

import {Options} from '@/@types';
import {Stack, Tabs, Tab, SxProps} from '@mui/material';

interface Props {
	options: Options<any>;
	selectedTab: any;
	tabLabel: string;
	onChangeTab: (value: any) => void;
	buttons?: React.ReactElement;
}

function SearchFilterTab({
	options,
	selectedTab,
	tabLabel,
	onChangeTab,
	buttons,
}: Props) {
	const handleChange = useCallback(
		(event: React.SyntheticEvent, newValue: any) => {
			onChangeTab(newValue);
		},
		[]
	);
	return (
		<>
			<Stack
				mt={{
					xs: '16px',
					md: '50px',
				}}
				flexDirection="row"
				justifyContent={buttons ? 'space-between' : 'flex-start'}
				sx={{
					borderBottom: 1,
					borderColor: 'divider',
				}}>
				<Tabs
					value={selectedTab || options[0].value}
					onChange={handleChange}
					aria-label={tabLabel}
					sx={{
						width: 'fit-content',
						'& .MuiButtonBase-root.MuiTab-root': {
							fontSize: 14,
							padding: '24px 4px',
							marginX: '8px',
							minWidth: '0',
							'&.Mui-selected': {
								fontWeight: 700,
							},
						},
					}}>
					{options?.map((option) => (
						<Tab
							key={option.value}
							label={option.label}
							value={option.value}
							{...a11yProps(option.value)}
						/>
					))}
				</Tabs>
				<ButtonGroups
					buttons={buttons}
					sx={{
						display: {
							xs: 'none',
							md: 'block',
						},
					}}
				/>
			</Stack>
			{/* 반응형 버튼 그룹 */}
			<ButtonGroups
				buttons={buttons}
				sx={{
					display: {
						xs: 'block',
						md: 'none',
					},
					marginTop: '16px',
				}}
			/>
		</>
	);
}

function a11yProps(value: any) {
	const tabValue = String(value);
	return {
		id: `tab-${tabValue}`,
		'aria-controls': `tabpanel-${tabValue}`,
	};
}

const ButtonGroups = ({
	buttons,
	sx = {},
}: {
	buttons: React.ReactNode;
	sx: SxProps;
}) => {
	return buttons ? (
		<Stack
			flexDirection="row"
			marginY="auto"
			sx={{
				'& button:not(:nth-last-of-type(1))': {
					marginRight: '8px',
				},
				...sx,
			}}>
			{buttons}
		</Stack>
	) : null;
};

export default SearchFilterTab;
