import {Grid} from '@mui/material';

import {AutocompleteInputType, Options} from '@/@types';
import {Autocomplete} from '@/components';
import InputLabelTag from '../atoms/InputLabelTag';

interface Props extends AutocompleteInputType {
	defaultOptions: string[];
	height?: 48 | 32;
	width?: 300 | 150 | number | '100%';
	value: string;
	onChange: (value: any) => void;
}

function LabeledAutocomplete(props: Props) {
	const {
		label,
		required,
		defaultOptions,
		height,
		width,
		value,
		onChange,
		placeholder,
	} = props;
	return (
		<Grid container sx={{marginBottom: '24px'}}>
			<InputLabelTag required={!!required} labelTitle={label as string} />
			<Autocomplete
				placeholder={placeholder}
				defaultOptions={defaultOptions}
				height={height}
				width={width}
				value={value}
				onChange={onChange}
			/>
		</Grid>
	);
}

export default LabeledAutocomplete;
