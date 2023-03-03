import {useCallback, useMemo} from 'react';
import {parse, format} from 'date-fns';

import {Grid, InputLabel, Box} from '@mui/material';

import {periods, calculatePeriod, DATE_FORMAT} from '@/data';

import {Button, DatePicker} from '@/components';
import {PeriodType} from '@/@types';
import {sendAmplitudeLog} from '@/utils';

interface Props {
	menu: string;
	label?: string;
	startDate: string;
	endDate: string;
	filter: {[key: string]: any};
	periodIdx: number;
	onChange: (value: {
		[key in 'startDate' | 'endDate']?: string;
	}) => void;
}

function SearchDate({
	menu,
	label = '기간',
	startDate,
	endDate,
	filter,
	periodIdx,
	onChange,
}: Props) {
	const dateList = useMemo(() => {
		return periods.map((period) =>
			calculatePeriod(period.type, period.value)
		);
	}, []);

	const sameDateIndex = dateList.findIndex((date) => {
		if (date[0] === startDate && date[1] === endDate) {
			return true;
		}
		return false;
	});

	const handleClickDateButton = useCallback(
		(type: PeriodType, value: number, idx: number) => {
			const [startDate, endDate] = calculatePeriod(type, value);
			onChange({
				startDate,
				endDate,
			});
			const periodLabel =
				periods.find((item) => item.type === type)?.label ?? '';
			sendAmplitudeLog(`${menu}_period_click`, {
				button_title: `기간선택_${periodLabel}`,
			});
		},
		[filter]
	);

	const handleClickCalander = useCallback(
		(type: 'startDate' | 'endDate', value: Date) => {
			onChange({
				[type]: format(value, DATE_FORMAT),
			});
			sendAmplitudeLog(`${menu}_period_directinput_click`, {
				button_title: '기간선택_직접입력',
			});
		},
		[filter]
	);

	return (
		<>
			<Box className="flex items-center">
				<InputLabel>{label}</InputLabel>
			</Box>
			<Grid
				container
				className="items-center"
				columnGap={0.5}
				rowGap={0.5}>
				{periods.map((item, idx) => (
					<Grid item minWidth="fit-content" key={`date-term-${idx}`}>
						<Button
							color={
								idx === sameDateIndex
									? 'primary-50'
									: 'grey-100'
							}
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
