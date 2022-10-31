import {forwardRef, Ref} from 'react';

import {
	FormControl,
	Select as MuiSelect,
	MenuItem,
	SelectProps,
	SvgIcon,
} from '@mui/material';

import {Options} from '@/@types';

import {IcChevronDown} from '@/assets/icon';

type Height = 48 | 32;

interface Props<T> extends SelectProps {
	width?: number | 'auto';
	height?: Height;
	options: Options<T>;
}

/**
 *
 * 제어/비제어 컴포넌트 둘 다 가능
 * 넘겨지는 값으로 정의됨 (value/onChange vs defaultValue)
 */
function Select<T>(
	{
		width = 'auto',
		height = 48,
		options,
		sx = {},
		value,
		defaultValue,
		onChange,
		...props
	}: Props<T>,
	ref: Ref<unknown>
) {
	return (
		<FormControl>
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
						sx={{
							width: '16px',
							height: '16px',
						}}
						{...props}>
						<IcChevronDown />
					</SvgIcon>
				)}
				sx={{
					'& .MuiSelect-select': {
						paddingRight: '50px !important',
					},
					'& .MuiSelect-icon': {
						top: 'auto',
					},
					width: typeof width === 'number' ? `${width}px` : width,
					height: `${height}px`,
					...sx,
				}}
				{...props}>
				{options.map((item, idx) => {
					return (
						<MenuItem
							key={`select-menu-item-${idx}`}
							value={item.value as unknown as string}
							sx={{
								fontSize: '14px',
							}}>
							{item.label}
						</MenuItem>
					);
				})}
			</MuiSelect>
		</FormControl>
	);
}

export default forwardRef(Select);
