import {
	FormControl,
	RadioGroup as MuiRadioGroup,
	Radio,
	FormControlLabel,
	RadioGroupProps,
} from '@mui/material';

import {Options} from '@/@types';

import {IcRadioButtonChecked, IcRadioButtonUnchecked} from '@/assets/icon';

interface Props<T> extends Omit<RadioGroupProps, 'onChange'> {
	ariaLabel: string;
	options: Options<T>;
	onChange: (value: any) => void;
}

function RadioGroup<T>({
	ariaLabel,
	options,
	name,
	value,
	onChange,
	sx,
	...props
}: Props<T>) {
	return (
		<FormControl>
			<MuiRadioGroup
				row
				aria-label={ariaLabel}
				name={name}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				sx={{
					'& label': {
						marginRight: '32px',
					},
					...sx,
				}}
				{...props}>
				{options.map((option, idx) => (
					<FormControlLabel
						key={`radio-${idx}`}
						value={option.value}
						control={
							<Radio
								sx={{
									color: 'grey.100',
								}}
								icon={<IcRadioButtonUnchecked />}
								checkedIcon={<IcRadioButtonChecked />}
							/>
						}
						label={option.label}
						sx={{
							'& .MuiFormControlLabel-label': {
								fontSize: '14px',
							},
						}}
					/>
				))}
			</MuiRadioGroup>
		</FormControl>
	);
}

export default RadioGroup;
