import React, {forwardRef, useMemo, useRef} from 'react';
import {TextField, TextFieldProps, InputAdornment} from '@mui/material';
import {FieldError} from 'react-hook-form';

import {IcEye} from '@/assets/icon';
interface Props extends Omit<TextFieldProps, 'label' | 'placehoder' | 'error'> {
	label: string;
	placeholder: string;
	icon: React.ReactElement;
	error?: FieldError;
}

/**
 *
 * 회원가입에서만 현재 사용 중
 * controlled component
 */
function SignUpTextField(
	{label, placeholder, icon, value, error, type, ...props}: Props,
	ref: any
) {
	const isValueExisted = useMemo(() => (value ? true : false), [value]);
	const inputRef = useRef<React.ReactElement | null>(null);
	return (
		<TextField
			type={type}
			inputRef={inputRef}
			label={isValueExisted ? label : null}
			placeholder={placeholder}
			value={value}
			error={error ? true : false}
			helperText={error?.message || null}
			sx={(theme) => ({
				borderRadius: '8px',
				'.MuiInputBase-root': {
					paddingLeft: '16px',
					'&.Mui-focused fieldset': {
						borderColor: `${theme.palette.primary.main} !important`,
						borderWidth: `1.5px !important`,
					},
				},
			})}
			InputProps={{
				startAdornment: (
					<InputAdornment position="start">{icon}</InputAdornment>
				),
				...(type === 'password' && {
					endAdornment: (
						<InputAdornment position="end">
							<IcEye
								className="cursor-pointer"
								onClick={() => {
									if (inputRef?.current) {
										const type = inputRef.current.type;
										inputRef.current.type =
											type === 'password'
												? 'text'
												: 'password';
									}
								}}
							/>
						</InputAdornment>
					),
				}),
				sx: {
					height: '60px',
					...(isValueExisted && {
						'& .MuiInputBase-input': {
							paddingTop: '34px',
							paddingBottom: '10px',
						},
					}),
					fontSize: '16px',
					color: 'grey.900',
					'& .MuiInputBase-input': {
						...(isValueExisted && {
							paddingTop: '34px',
							paddingBottom: '10px',
						}),
						'&::placeholder': {
							color: 'grey.400',
							fontWeight: 'bold',
							fontSize: {
								xs: 14,
								md: 16,
							},
						},
					},
				},
			}}
			InputLabelProps={{
				focused: false,
				required: false,
				shrink: false,
				sx: (theme) => ({
					display: isValueExisted ? 'block' : 'none',
					top: '-3px',
					left: '38px',
					fontSize: '11px',
					color: `${theme.palette.grey[400]} !important`,
				}),
			}}
			FormHelperTextProps={{
				sx: {
					margin: 0,
					marginTop: '8px',
					fontSize: {
						xs: 11,
						md: 13,
					},
					fontWeight: 'bold',
				},
			}}
			{...props}
		/>
	);
}

export default forwardRef(SignUpTextField);
