import {forwardRef, Ref, useEffect, useState} from 'react';
import {FieldError} from 'react-hook-form';

import {
	FormControl,
	Select as MuiSelect,
	MenuItem,
	SelectProps,
	SvgIcon,
	FormHelperText,
} from '@mui/material';

import {Options} from '@/@types';

import {IcChevronDown} from '@/assets/icon';

import style from '@/assets/styles/style.module.scss';

type Height = 48 | 32;

export interface Props<T> extends Omit<SelectProps, 'error'> {
	width?: number | 'auto' | '100%';
	height?: Height;
	defaultTextColor?: string;
	options: Options<T>;
	error?: FieldError;
}

/**
 *
 * 제어/비제어 컴포넌트 둘 다 가능
 * 넘겨지는 값으로 정의됨 (value/onChange vs defaultValue)  TODO: 타입 A or B로 변경하기
 */
function Select<T>(
	{
		width = 'auto',
		height = 48,
		defaultTextColor,
		options,
		sx = {},
		value,
		defaultValue,
		onChange,
		placeholder,
		error,
		...props
	}: Props<T>,
	ref: Ref<unknown>
) {
	const [textColor, setTextColor] = useState({
		color: '#222227',
	});

	useEffect(() => {
		if (defaultTextColor) {
			setTextColor({
				color: defaultTextColor,
			});
		}
	}, [defaultTextColor]);

	useEffect(() => {
		if (value || defaultValue) {
			setTextColor({
				color: '#222227',
			});
		}
	}, [value, defaultValue]);
	return (
		<FormControl
			error={error ? true : false}
			sx={{
				'& .MuiInputBase-root.Mui-error': {
					backgroundColor: 'red.50',
				},
				...(width === '100%' && {
					width: '100%',
				}),
			}}>
			<MuiSelect
				// 제어
				{...((value || value === '') && {
					value: value as T,
				})}
				{...(onChange && {
					onChange: onChange,
				})}
				// 비제어
				{...(defaultValue && {
					defaultValue: defaultValue as T,
				})}
				{...(ref && {
					inputRef: ref,
				})}
				IconComponent={(props) => (
					<SvgIcon
						{...props}
						sx={{
							width: '16px',
							height: '16px',
							right: `${
								height === 48 ? '16px' : '12px'
							} !important`,
						}}>
						<IcChevronDown color={style.vircleGrey900} />
					</SvgIcon>
				)}
				{...(placeholder && {
					renderValue: (selected) => {
						if (selected || value) {
							const selectedLabel =
								options.find((option) => {
									const optionValue = String(option.value);
									return (
										optionValue === String(selected) ||
										optionValue === String(value)
									);
								})?.label || placeholder;
							return selectedLabel;
						}
						return <>{placeholder}</>;
					},
				})}
				displayEmpty={true}
				sx={{
					'& .MuiSelect-select': {
						paddingRight: '50px !important',
					},
					'& .MuiSelect-icon': {
						top: 'auto',
					},
					width: typeof width === 'number' ? `${width}px` : width,
					height: `${height}px`,
					...textColor,
					...sx,
				}}
				{...props}>
				{placeholder && (
					<MenuItem
						value={''}
						disabled
						sx={{
							fontSize: '14px',
						}}>
						{placeholder}
					</MenuItem>
				)}
				{options.map((item, idx) => {
					return (
						<MenuItem
							key={`select-menu-item-${idx}`}
							value={item.value as unknown as string}
							sx={{
								fontSize: '14px',
							}}
							onClick={() => {
								setTextColor({
									color: '#222227',
								});
							}}>
							{item.label}
						</MenuItem>
					);
				})}
			</MuiSelect>
			{error?.message && (
				<FormHelperText
					sx={{
						marginLeft: 0,
						marginTop: '6px',
						fontSize: '13',
						fontWeight: '500',
						color: 'red.main',
						lineHeight: '13px',
					}}>
					{error?.message}
				</FormHelperText>
			)}
		</FormControl>
	);
}

export default forwardRef(Select);
