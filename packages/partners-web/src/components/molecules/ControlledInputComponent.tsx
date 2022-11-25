import React from 'react';
import {
	Input,
	InputProps,
	Typography,
	Grid,
	SxProps,
	Theme,
} from '@mui/material';
import {Controller, FieldValues, FieldError} from 'react-hook-form';
import InputComponent from '../atoms/InputComponent';

type Height = '60px' | '48px' | '40px' | '32px' | 'auto';
interface Props extends Omit<InputProps, 'error'> {
	name: string;
	control: FieldValues | undefined;
	type: string;
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

function ControlledInputComponent({
	type = 'text',
	name,
	control,
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
	...props
}: Props) {
	return (
		<Controller
			control={control}
			name={name}
			defaultValue={defaultValue}
			render={({field: {onChange, value}}) => (
				<InputComponent
					type={type}
					defaultValue={defaultValue}
					placeholder={placeholder}
					height={height}
					maxHeight={maxHeight}
					fullWidth={fullWidth}
					readonly={readonly}
					required={required}
					sx={sx}
					multiline={multiline}
					autoFocus={autoFocus}
					onBlur={onBlur}
					onKeyDown={onKeyDown}
					error={error}
					onChange={onChange}
					value={value}
					{...props}
				/>
			)}
		/>
	);
}

export default ControlledInputComponent;
