import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import {Checkbox} from '@/components';

import {FormControlLabelProps} from '@mui/material';

interface Props extends Omit<FormControlLabelProps, 'control'> {
	value?: unknown;
}

function LabeledCheckbox({
	label,
	value,
	checked,
	onChange,
	sx = {},
	...props
}: Props) {
	return (
		<FormGroup>
			<FormControlLabel
				sx={{
					margin: 0,
					width: 'fit-content',
					'& .MuiFormControlLabel-label': {
						fontSize: 14,
						color: 'grey.900',
					},
					...sx,
				}}
				label={label}
				value={value}
				checked={checked}
				control={
					<Checkbox
						onChange={onChange}
						sx={{
							paddingRight: '8px',
						}}
					/>
				}
				{...props}
			/>
		</FormGroup>
	);
}

export default LabeledCheckbox;
