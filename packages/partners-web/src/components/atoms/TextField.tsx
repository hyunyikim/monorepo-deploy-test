import {forwardRef, KeyboardEvent, useCallback, Ref} from 'react';

import {TextField as MuiTextField, TextFieldProps} from '@mui/material';

type Height = 48 | 32;

interface Props extends Omit<TextFieldProps, 'size'> {
	width?: number | 'auto';
	height?: Height;
	onEnterPress?: () => void;
}

function TextField(
	{
		width = 'auto',
		height = 48,
		onEnterPress,
		value,
		onChange,
		defaultValue,
		sx,
		...props
	}: Props,
	ref: Ref<unknown>
) {
	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLDivElement>) => {
			if (event.key === 'Enter' && onEnterPress) {
				onEnterPress();
			}
		},
		[onEnterPress]
	);
	return (
		<MuiTextField
			// 제어
			{...(value && {
				value: value,
			})}
			{...(onChange && {
				onChange: onChange,
			})}
			// 비제어
			{...(defaultValue && {
				defaultValue: defaultValue,
			})}
			{...(ref && {
				inputRef: ref,
			})}
			defaultValue={defaultValue}
			sx={{
				width: typeof width === 'number' ? `${width}px` : width,
				height: `${height}px`,
				'& .MuiInputBase-root': {
					height: 'inherit',
				},
				...sx,
			}}
			onKeyDown={handleKeyDown}
			{...props}
		/>
	);
}

export default forwardRef(TextField);
