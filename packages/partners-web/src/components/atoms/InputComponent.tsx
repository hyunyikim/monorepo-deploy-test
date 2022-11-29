import React from 'react';
import {
	Input,
	InputProps,
	Typography,
	Grid,
	SxProps,
	Theme,
} from '@mui/material';
import {FieldError} from 'react-hook-form';

type Height = '60px' | '48px' | '40px' | '32px' | 'auto';

interface Props extends Omit<InputProps, 'control' | 'name' | 'error'> {
	type: string;
	value?: string;
	onChange?(e: React.ChangeEvent<HTMLInputElement>): void;
	defaultValue?: string;
	height?: Height;
	maxHeight?: Height;
	placeholder: string;
	fullWidth?: boolean;
	readonly?: boolean;
	required?: boolean;
	sx?: SxProps<Theme>;
	multiline?: boolean;
	autoFocus?: boolean;
	error?: FieldError;
	onBlur?: (
		event: React.FocusEventHandler<HTMLInputElement> | undefined
	) => void;
	onKeyDown?: (
		event: React.KeyboardEventHandler<HTMLInputElement> | undefined
	) => void;
}

function InputComponent({
	type,
	defaultValue = '',
	placeholder,
	height = '48px',
	maxHeight = 'auto',
	fullWidth = true,
	readonly = false,
	required = false,
	sx,
	multiline = false,
	autoFocus = false,
	onBlur,
	onKeyDown,
	error,
	value,
	onChange,
	...props
}: Props) {
	return (
		<Grid container flexDirection={'column'} gap="6px">
			<Input
				type={type}
				readOnly={readonly}
				placeholder={placeholder}
				disableUnderline={true}
				fullWidth={fullWidth}
				required={required}
				multiline={multiline}
				minRows={multiline ? '3' : '0'}
				value={value}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
					onChange(e);
				}}
				onBlur={onBlur}
				autoFocus={autoFocus}
				onKeyDown={onKeyDown}
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
						padding: '17px 16px',
						color: 'grey.900',
						fontSize: '14px',
						lineHeight: '18px',

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
