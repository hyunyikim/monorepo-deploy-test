import {Checkbox as MuiCheckbox, CheckboxProps} from '@mui/material';

export default function Checkbox({sx = {}, ...props}: CheckboxProps) {
	return (
		<MuiCheckbox
			sx={{
				padding: 0,
				'&.Mui-checked svg': {
					color: 'primary.main',
				},
				'& svg': {
					fontSize: '20px',
					color: 'grey.100',
				},
				...sx,
			}}
			{...props}
		/>
	);
}
