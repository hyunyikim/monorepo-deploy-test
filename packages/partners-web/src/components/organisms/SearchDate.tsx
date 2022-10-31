import {useState, useCallback} from 'react';
import {parse, format} from 'date-fns';

import {Grid, InputLabel} from '@mui/material';

import {periods, calculatePeriod, defaultPeriodIdx, DATE_FORMAT} from '@/data';

import {Button, DatePicker} from '@/components';
import {PeriodType} from '@/@types';

interface Props {
	label?: string;
	startDate: string;
	endDate: string;
	filter: {[key: string]: any};
	onChange: (value: {
		[key in 'startDate' | 'endDate']?: string;
	}) => void;
}

// FIXME: filter 없이 useList 훅의 handleChangeFilter에서만 제어하기
function SearchDate({
	label = '기간',
	startDate,
	endDate,
	filter,
	onChange,
}: Props) {
	const [selected, setSelected] = useState<number | null>(defaultPeriodIdx);

	const handleClickDateButton = useCallback(
		(type: PeriodType, value: number, idx: number) => {
			const [startDate, endDate] = calculatePeriod(type, value);
			onChange({
				...filter,
				startDate,
				endDate,
			});
			setSelected(idx);
		},
		[filter]
	);

	const handleClickCalander = useCallback(
		(type: 'startDate' | 'endDate', value: Date) => {
			setSelected(null);
			onChange({
				...filter,
				[type]: format(value, DATE_FORMAT),
			});
		},
		[filter]
	);

	return (
		<>
			<Grid item xs={2} className="flex items-center">
				<InputLabel>{label}</InputLabel>
			</Grid>
			<Grid item container xs={10} columnGap={0.5} rowGap={0.5}>
				{periods.map((item, idx) => (
					<Grid item minWidth="fit-content" key={`date-term-${idx}`}>
						<Button
							color={selected === idx ? 'blue-50' : 'grey-100'}
							variant="outlined"
							width={54}
							height={32}
							onClick={() =>
								handleClickDateButton(
									item.type,
									item.value,
									idx
								)
							}>
							{item.label}
						</Button>
					</Grid>
				))}
				<Grid item>
					<DatePicker
						disableFuture
						value={
							startDate
								? parse(startDate, DATE_FORMAT, new Date())
								: null
						}
						InputProps={{
							'aria-label': 'start date',
						}}
						onChange={(value) =>
							handleClickCalander('startDate', value)
						}
					/>
				</Grid>
				<Grid item>
					<DatePicker
						value={parse(endDate, DATE_FORMAT, new Date())}
						minDate={parse(startDate, DATE_FORMAT, new Date())}
						InputProps={{
							'aria-label': 'end date',
						}}
						onChange={(value) =>
							handleClickCalander('endDate', value)
						}
					/>
				</Grid>
			</Grid>
		</>
	);
}

export default SearchDate;
