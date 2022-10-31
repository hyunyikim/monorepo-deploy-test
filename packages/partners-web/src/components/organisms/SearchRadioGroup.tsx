import {Grid, InputLabel} from '@mui/material';

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
			<Grid item xs={2} className="flex items-center">
				<InputLabel>{label}</InputLabel>
			</Grid>
			<Grid item xs={10}>
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
