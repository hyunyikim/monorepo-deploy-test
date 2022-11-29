import {Checkbox as MuiCheckbox, CheckboxProps} from '@mui/material';

export default function Checkbox(props: CheckboxProps) {
	return (
		<MuiCheckbox
			sx={{
				padding: 0,
				paddingRight: '8px',
				'& svg': {
					fontSize: '20px',
				},
			}}
			{...props}
		/>
	);
}
