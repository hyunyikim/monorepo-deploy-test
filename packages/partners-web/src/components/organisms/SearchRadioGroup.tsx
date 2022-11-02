import {Grid, InputLabel, Box} from '@mui/material';

import {Options} from '@/@types';

import {RadioGroup} from '@/components';

interface Props {
	name: string;
	label: string;
	value: any;
	options: Options;
	onChange: (value: any) => void;
}

function SearchRadioGroup({name, label, value, options, onChange}: Props) {
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
					onChange={onChange}
				/>
			</Grid>
		</>
	);
}

export default SearchRadioGroup;
