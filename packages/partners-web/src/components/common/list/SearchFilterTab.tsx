import {Options} from '@/@types';
import {Stack, SxProps} from '@mui/material';
import {Tab} from '@/components';

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
	return (
		<>
			<Tab
				tabLabel={tabLabel}
				selected={selectedTab || options[0].value}
				options={options}
				handleChange={(e, value) => onChangeTab(value)}>
				<ButtonGroups
					buttons={buttons}
					sx={{
						display: {
							xs: 'none',
							md: 'block',
						},
					}}
				/>
			</Tab>
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
