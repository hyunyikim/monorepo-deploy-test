import React from 'react';
import {Input, InputProps, Typography, Grid} from '@mui/material';
import {Controller, FieldValues, FieldError} from 'react-hook-form';

type Height = '60px' | '48px' | '40px' | '32px' | 'auto';
interface Props {
	type: string;
	name?: string;
	defaultValue?: string;
	height?: Height;
	maxHeight?: Height;
	placeholder: string;
	fullWidth?: boolean;
	readonly?: boolean;
	required?: boolean;
	sx?: object;
	multiline?: boolean;
	autoFocus?: boolean;
	error?: FieldError;
	control?: FieldValues | undefined;
	onBlur?: () => void;
	onKeyDown?: () => void;
}

/* TODO: 삭제 예졍입니다!! InputComponent로 이사갔습니다!! */
/* TODO: 삭제 예졍입니다!! InputComponent로 이사갔습니다!! */
/* TODO: 삭제 예졍입니다!! InputComponent로 이사갔습니다!! */
/* TODO: 삭제 예졍입니다!! InputComponent로 이사갔습니다!! */
/* TODO: 삭제 예졍입니다!! InputComponent로 이사갔습니다!! */
function InputBox({
	type,
	name,
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
	control,
	error,
}: Props) {
	return (
		<Controller
			control={control}
			name={name}
			defaultValue={defaultValue}
			render={({field: {onChange, value}}) => (
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
						onChange={(e) => {
							// e.target.value = renderer(e.target.value);
							onChange(e);
							// handleChange(e);
						}}
						onBlur={onBlur}
						autoFocus={autoFocus}
						onKeyDown={onKeyDown}
						error={error ? true : false}
						sx={{
							minHeight: `${height}px`,
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
									// textOverflow: 'ellipsis !important',
									color: 'grey.300',
								},
							},

							'&.Mui-focused': {
								borderColor: 'grey.900',
							},
							'&.Mui-error': {
								borderColor: 'red.main',
								backgroundColor: 'red.50',
							},
							...sx,
						}}
					/>
					{error && (
						<Typography
							fontSize={13}
							fontWeight={500}
							color={'red.main'}
							lineHeight={'13px'} /*  mt='6px' */
						>
							{error.message}
						</Typography>
					)}
				</Grid>
			)}
		/>
	);
}

export default InputBox;
