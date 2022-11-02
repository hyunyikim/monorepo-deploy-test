import {InputLabel, Grid, Box} from '@mui/material';

import {Options} from '@/@types';

import {Select} from '@/components';

interface Props {
	name: string;
	label: string;
	value: any;
	options: Options;
	onChange: (value: any) => void;
}

function SearchSelect({name, label, value, options, onChange}: Props) {
	return (
		<>
			<Box className="flex items-center">
				<InputLabel>{label}</InputLabel>
			</Box>
			<Grid container className="items-center">
				<Select
					height={32}
					width={150}
					name={name}
					options={options}
					value={value}
					onChange={(e) => {
						onChange(e.target.value);
					}}
					displayEmpty={true}
				/>
			</Grid>
		</>
	);
}

export default SearchSelect;
