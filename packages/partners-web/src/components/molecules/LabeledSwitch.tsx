import {useEffect, useState} from 'react';

import {FormControlLabel, SwitchProps} from '@mui/material';

import {Options} from '@/@types';

import {Switch} from '@/components';

interface Props extends SwitchProps {
	options: Options<boolean>;
}

function LabeledSwitch({options, checked, onChange, sx, ...props}: Props) {
	const [label, setLabel] = useState<string>();
	useEffect(() => {
		setLabel(
			options?.find((option) => option.value === checked)?.label ?? ''
		);
	}, [options, checked]);

	return (
		<FormControlLabel
			control={
				<Switch checked={checked} onChange={onChange} {...props} />
			}
			label={label}
			sx={[
				{
					margin: 0,
					'& .MuiTypography-root': {
						marginLeft: '6px',
						fontSize: 11,
						color: checked ? 'green.main' : 'grey.100',
						transition: 'color linear 100ms',
					},
				},
				sx && sx,
			]}
		/>
	);
}

export default LabeledSwitch;
