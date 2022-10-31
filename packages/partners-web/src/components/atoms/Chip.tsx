import {useMemo} from 'react';

import {Chip as MuiChip, ChipProps, SxProps, Theme} from '@mui/material';

import {ColorType} from '@/@types';
interface Props extends Omit<ChipProps, 'color'> {
	color?: ColorType;
}

function Chip({color = 'primary', variant = 'filled', sx, ...props}: Props) {
	const colorSx: SxProps<Theme> = useMemo(() => {
		switch (color) {
			case 'grey-50':
				return {
					backgroundColor: 'grey.50',
					color: 'black',
				};
			case 'grey-100':
				if (variant === 'outlined') {
					return {
						backgroundColor: 'white',
						color: 'black',
						borderColor: 'grey.100',
					};
				}
				return;
			case 'green':
				return {
					backgroundColor: 'green.50',
					color: '#2F9E8A',
				};
			case 'red':
				return {
					backgroundColor: 'red.50',
					color: 'red.main',
				};
			case 'primary-50':
				return {
					backgroundColor: 'primary.50',
					color: 'primary.main',
				};
			case 'primary':
				if (variant === 'outlined') {
					return {
						backgroundColor: 'white',
						color: 'primary.main',
						borderColor: 'primary.main',
					};
				}
				if (variant === 'filled') {
					return {
						backgroundColor: 'primary.main',
						color: 'white',
					};
				}
			case 'black':
				return {
					backgroundColor: 'black',
					color: 'white',
				};
		}
	}, [color, variant]);

	return (
		<MuiChip
			sx={{
				width: 'fit-content',
				height: '26px',
				paddingTop: '6px',
				paddingBottom: '6px',
				borderRadius: '4px',
				fontWeight: 'bold',
				...colorSx,
				...sx,
			}}
			variant={variant}
			{...props}
		/>
	);
}

export default Chip;
