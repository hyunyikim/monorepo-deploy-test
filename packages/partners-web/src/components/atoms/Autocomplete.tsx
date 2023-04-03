import {KeyboardEvent, useCallback, useEffect, useMemo, useState} from 'react';

import {
	Autocomplete as MuiAutoComplete,
	Stack,
	Typography,
} from '@mui/material';
import {SxProps} from '@mui/system';

import {IcChevronDown} from '@/assets/icon';
import {TextField} from '@/components';

import style from '@/assets/styles/style.module.scss';

interface Props {
	placeholder?: string;
	defaultOptions: string[];
	height?: 48 | 32;
	width?: 300 | 150 | number | '100%';
	value: string;
	onChange: (value: any) => void;
	sx?: SxProps;
}

// 제어 컴포넌트
function Autocomplete({
	placeholder,
	defaultOptions,
	height = 48,
	width = 300,
	value,
	onChange,
	sx = {},
}: Props) {
	const [text, setText] = useState<string>('');
	const trimedText = useMemo(() => (text ? text.trim() : ''), [text]);

	// 값 초기화
	useEffect(() => {
		setText(value);
	}, [value]);

	const isNewOption = useCallback((options: string[], value: string) => {
		return !options.some((item) => item.trim() === value.trim());
	}, []);

	const totalOptions = useMemo(() => {
		if (!text) {
			return defaultOptions;
		}

		const existed = !isNewOption(defaultOptions, text);
		return existed ? defaultOptions : [...defaultOptions, `${text} `]; // text가 autocomplete의 값을 가리키기 때문에, 신규로 입력된 상태의 경우 onChange에 걸리지 않고 있음. onChange 이벤트에 걸리기 위해 임의로 공백 한칸 추가
	}, [defaultOptions, text]);

	return (
		<MuiAutoComplete
			disablePortal
			disableClearable
			value={text}
			options={totalOptions}
			popupIcon={
				<IcChevronDown
					width={16}
					height={16}
					color={style.vircleGrey900}
				/>
			}
			renderInput={(params) => (
				<TextField {...params} {...(placeholder && {placeholder})} />
			)}
			onInputChange={(e, value, reason) => {
				setText(value);
			}}
			onChange={(e, value) => {
				onChange(value.trim());
			}}
			onClose={(e, reason) => {
				if (reason === 'selectOption') {
					return;
				}
				onChange(trimedText || null);
			}}
			onBlur={(e) => {
				if (!trimedText) {
					onChange(null); // 초기화
				}
			}}
			onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
				if (e.key === 'Enter') {
					onChange(text);
				}
			}}
			isOptionEqualToValue={(option, value) => {
				return option.trim() === value.trim();
			}}
			renderOption={(props, value, {selected}) => {
				const isNew = isNewOption(defaultOptions, value);
				return (
					<li {...props} key={value}>
						<Stack flexDirection="row">
							<Typography
								color={isNew ? 'primary.main' : 'grey.900'}
								fontSize={14}>
								{value}
							</Typography>
							{isNew && (
								<Typography
									color="grey.900"
									fontSize={14}
									ml="4px">
									추가
								</Typography>
							)}
						</Stack>
					</li>
				);
			}}
			sx={[
				{
					width: 'inherit',
					'& .MuiFormControl-root': {
						height: `${height}px`,
						width: typeof width === 'number' ? `${width}px` : width,
						// mui 기본 라벨
						'& .MuiFormLabel-root, & .MuiOutlinedInput-notchedOutline legend':
							{
								display: 'none',
							},
						// 우측 화살표
						'& .MuiAutocomplete-endAdornment': {
							right: height === 48 ? '16px' : '12px',
						},
						// input
						'& .MuiAutocomplete-inputRoot': {
							padding: `${
								height === 48 ? '14px 16px' : '12px 6px'
							} !important`,
							'& .MuiInputBase-input': {
								padding: 0,
								'&::placeholder': {
									color: `${style.vircleGrey300} !important`,
								},
							},
						},
						'& .MuiOutlinedInput-notchedOutline': {
							top: 0,
						},
					},
				},
				...(Array.isArray(sx) ? sx : [sx]),
			]}
		/>
	);
}

export default Autocomplete;
