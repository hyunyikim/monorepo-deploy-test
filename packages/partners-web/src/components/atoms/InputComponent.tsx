import {Input, InputProps, Typography, Grid} from '@mui/material';
import {FieldError} from 'react-hook-form';

type Height = '60px' | '48px' | '40px' | '32px' | 'auto';

interface Props extends Omit<InputProps, 'error'> {
	height?: Height;
	maxHeight?: Height;
	desc?: string;
	error?: FieldError;
}

function InputComponent({
	height = '48px',
	maxHeight = 'auto',
	multiline,
	desc,
	error,
	sx,
	...props
}: Props) {
	return (
		<Grid container flexDirection={'column'} gap="6px">
			<Input
				disableUnderline={true}
				multiline={multiline}
				minRows={multiline ? '3' : '0'}
				error={error ? true : false}
				sx={{
					height: multiline ? 'auto' : height,
					minHeight: `${height}`,
					maxHeight: maxHeight,
					border: '1px solid',
					borderColor: 'grey.100',
					borderRadius: '6px',
					padding: multiline ? '17px 16px' : 0,
					input: {
						padding: '0px 16px',
						color: 'grey.900',
						fontSize: '14px',
						lineHeight: '0px',

						'&::placeholder': {
							color: 'grey.300',
						},
					},
					textarea: {
						'&::placeholder': {
							color: 'grey.300',
						},
					},
					'&.Mui-focused': {
						borderColor: 'grey.900',
					},
					'&.Mui-disabled': {
						backgroundColor: 'grey.50',
					},
					'&.Mui-error': {
						borderColor: 'red.main',
						backgroundColor: 'red.50',
					},
					'&.MuiInputBase-readOnly': {
						borderColor: 'grey.100',
						backgroundColor: 'grey.50',
						color: 'grey.300',
						input: {
							color: 'grey.300',
						},
					},
					...sx,
				}}
				{...props}
			/>
			{desc && (
				<Typography variant="caption3" color="grey.500" mt="4px">
					{desc}
				</Typography>
			)}
			{error && (
				<Typography
					fontSize={13}
					fontWeight={500}
					color={'red.main'}
					lineHeight={'13px'}>
					{error.message}
				</Typography>
			)}
		</Grid>
	);
}

export default InputComponent;
