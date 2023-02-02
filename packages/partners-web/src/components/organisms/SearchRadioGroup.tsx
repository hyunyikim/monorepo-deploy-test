import {Grid, InputLabel, Box} from '@mui/material';

import {Options} from '@/@types';

import {RadioGroup} from '@/components';
import {useCallback} from 'react';
import {sendAmplitudeLog} from '@/utils';

interface Props {
	menu: string;
	menuKo: string;
	name: string;
	label: string;
	value: any;
	options: Options;
	onChange: (value: any) => void;
}

function SearchRadioGroup({
	menu,
	menuKo,
	name,
	label,
	value,
	options,
	onChange,
}: Props) {
	const handleChange = useCallback(
		(value: any) => {
			onChange(value);
			const stateLabel =
				options.find((item) => item.value === value)?.label || '';
			sendAmplitudeLog(`${menu}_state_click`, {
				button_title: `${menuKo}_${stateLabel}`,
			});
		},
		[menu, menuKo, onChange]
	);

	return (
		<>
			<Box className="flex items-center">
				<InputLabel>{label}</InputLabel>
			</Box>
			<Grid
				container
				className="items-center search-radio-group-grid-item">
				<RadioGroup
					ariaLabel="radio-label"
					name={name}
					options={options}
					value={value}
					onChange={handleChange}
				/>
			</Grid>
		</>
	);
}

export default SearchRadioGroup;
