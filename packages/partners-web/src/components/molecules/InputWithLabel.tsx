import React, {ReactElement} from 'react';
import {Grid, Button, InputLabel, SxProps, Theme} from '@mui/material';
import InputComponent from '../atoms/InputComponent';
import InputLabelTag from '../atoms/InputLabelTag';

import {FieldValues, FieldError} from 'react-hook-form';
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
	error?: FieldError;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	value?: string;
	fullWidth?: boolean;
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
					error={error}
				/>
			) : (
				<InputComponent
					type={inputType}
					placeholder={placeholder}
					fullWidth={fullWidth}
					required={required}
					multiline={multiline}
					error={error}
					onChange={onChange}
					value={value}
				/>
			)}
		</Grid>
	);
}

export default InputWithLabel;
