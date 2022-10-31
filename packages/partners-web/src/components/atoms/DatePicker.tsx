import {TextField, SxProps, SvgIcon} from '@mui/material';
import {
	DatePicker as MuiDatePicker,
	DatePickerProps,
	LocalizationProvider,
} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';

import {IcChevronDown} from '@/assets/icon';

interface Props
	extends Omit<
		DatePickerProps<Date, Date>,
		'value' | 'onChange' | 'renderInput'
	> {
	value: Date | null;
	sx?: SxProps;
	onChange: (value: Date) => void;
}

const defaultSx = {
	height: '32px',
	width: '150px',
	'& .MuiInputBase-root': {
		height: 'inherit',
		fontSize: '14px',
	},
};

function DatePicker({value, sx, onChange, ...props}: Props) {
	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<MuiDatePicker
				inputFormat="yyyy-MM-dd"
				views={['day']}
				value={value || null}
				onChange={(newValue) => {
					onChange(newValue ?? new Date());
				}}
				renderInput={(params) => (
					<TextField {...params} sx={sx ?? defaultSx} />
				)}
				components={{
					OpenPickerIcon: IcChevronDownForDate,
				}}
				{...props}
			/>
		</LocalizationProvider>
	);
}

const IcChevronDownForDate = () => {
	return (
		<SvgIcon
			sx={{
				width: '16px',
				height: '16px',
			}}>
			<IcChevronDown />
		</SvgIcon>
	);
};

export default DatePicker;
