import {useMemo} from 'react';

import {Box, Stack} from '@mui/material';

import {PlanType, Options} from '@/@types';

const options: Options<PlanType> = [
	{label: '월 결제 (+20%)', value: 'MONTH'},
	{label: '연 결제', value: 'YEAR'},
];

interface Props {
	planType: PlanType;
	onChangePlanType: (value: PlanType) => void;
}

function SquaredSwitch({planType, onChangePlanType}: Props) {
	const selectedIdx = useMemo(
		() => options.findIndex((option) => option.value === planType),
		[planType]
	);
	return (
		<Stack
			flexDirection="row"
			sx={{
				position: 'relative',
				backgroundColor: 'grey.50',
				borderRadius: '8px',
				padding: '4px',
				width: 'fit-content',
			}}>
			{options.map((option) => (
				<Box
					key={option.value}
					className="flex-center cursor-pointer"
					sx={{
						minWidth: '120px',
						height: '24px',
						fontSize: 13,
						fontWeight: 500,
						color: 'grey.400',
						borderRadius: '8px',
						zIndex: 1,
						...(planType === option.value && {
							color: 'grey.900',
							fontWeight: 700,
						}),
					}}
					onClick={() => onChangePlanType(option.value)}>
					{option.label}
				</Box>
			))}
			<Box
				sx={{
					position: 'absolute',
					minWidth: '120px',
					height: '24px',
					color: 'grey.400',
					borderRadius: '8px',
					backgroundColor: '#FFF',
					transform:
						selectedIdx === 0
							? 'translateX(0px)'
							: 'translateX(120px)',
					transition: 'transform 300ms',
				}}
			/>
		</Stack>
	);
}

export default SquaredSwitch;
