import {Checkbox as MuiCheckbox, CheckboxProps, Box} from '@mui/material';

export default function Checkbox({sx = {}, disabled, ...props}: CheckboxProps) {
	return (
		<MuiCheckbox
			{...(disabled && {
				icon: (
					// disabled checkbox icon
					<Box
						className="flex-center"
						sx={{
							width: '20px',
							height: '20px',
						}}>
						<Box
							sx={(theme) => ({
								width: '15px',
								height: '15px',
								border: `1px solid ${theme.palette.grey[100]}`,
								borderRadius: '2px',
								backgroundColor: theme.palette.grey[50],
							})}
						/>
					</Box>
				),
			})}
			disabled={disabled}
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
