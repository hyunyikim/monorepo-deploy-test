import React, {useMemo} from 'react';
import {InputLabel} from '@mui/material';

interface Props {
	required?: boolean;
	sx?: object;
	labelTitle: string;
}

function InputLabelTag({required = false, sx, labelTitle}: Props) {
	const requireSx = useMemo(() => {
		switch (required) {
			case true:
				return {
					content: "'필수'",
				};
			default:
				return {
					content: "''",
					padding: 0,
					display: 'none',
				};
		}
	}, [required]);

	return (
		<InputLabel
			required={required}
			sx={{
				display: 'flex',
				alignItems: 'center',
				color: 'grey.900',
				fontWeight: 700,
				fontSize: '14px',
				lineHeight: '18px',
				marginBottom: '12px',

				'& .MuiFormLabel-asterisk': {
					fontSize: 0,
					color: 'red.main',
				},
				'&::after': {
					color: 'red.main',
					display: 'inline-block',
					backgroundColor: 'red.50',
					fontWeight: 700,
					fontSize: '11px',
					lineHeight: '16px',
					height: '16px',
					padding: '0 5px',
					borderRadius: '4px',
					marginLeft: '8px',
					...requireSx,
				},
				// '& .Mui-required' : {
				//     color : 'blue'
				// }
				...sx,
			}}>
			{labelTitle}
		</InputLabel>
	);
}

export default InputLabelTag;
