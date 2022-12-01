import React, {ReactElement} from 'react';
import {Grid, Button, InputLabel, SxProps, Theme} from '@mui/material';
import InputComponent from '../atoms/InputComponent';
import InputLabelTag from '../atoms/InputLabelTag';

import {FieldValues, FieldError, Merge, FieldErrorsImpl} from 'react-hook-form';
import ControlledInputComponent from './ControlledInputComponent';

interface Props {
	labelTitle: string;
	placeholder: string;
	required?: boolean;
	inputType?: string;
	isLast?: boolean;
	sx?: SxProps<Theme>;
	multiline?: boolean;
	name: string;
	control: FieldValues;
	error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	value?: string;
	fullWidth?: boolean;
	disabled?: boolean;
	defaultValue?: string;
}

function InputWithLabel({
	sx = {},
	required = false,
	labelTitle,
	placeholder,
	inputType = 'text',
	multiline,
	isLast = false,
	control,
	name,
	error,
	onChange,
	value,
	fullWidth,
	disabled,
	defaultValue,
	...props
}: Props) {
	return (
		<Grid container sx={{marginBottom: isLast ? 0 : '24px'}}>
			<InputLabelTag
				required={required}
				labelTitle={labelTitle}
				sx={sx}
			/>
			{control ? (
				<ControlledInputComponent
					type={inputType}
					name={name}
					control={control}
					placeholder={placeholder}
					fullWidth={fullWidth}
					required={required}
					multiline={multiline}
					disabled={disabled}
					error={error}
					onChange={onChange}
					defaultValue={defaultValue}
					{...props}
				/>
			) : (
				<InputComponent
					type={inputType}
					defaultValue={defaultValue}
					placeholder={placeholder}
					fullWidth={fullWidth}
					required={required}
					multiline={multiline}
					disabled={disabled}
					error={error}
					onChange={onChange}
					value={value}
					{...props}
				/>
			)}
		</Grid>
	);
}

export default InputWithLabel;
