import {useState, useCallback} from 'react';
import {parse, format} from 'date-fns';

import {Grid, InputLabel, Box} from '@mui/material';

import {periods, calculatePeriod, defaultPeriodIdx, DATE_FORMAT} from '@/data';

import {Button, DatePicker} from '@/components';
import {PeriodType} from '@/@types';
import {trackingToParent} from '@/utils';

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

// FIXME: filter 없이 useList 훅의 handleChangeFilter에서만 제어하기
function SearchDate({
	menu,
	label = '기간',
	startDate,
	endDate,
	filter,
	periodIdx,
	onChange,
}: Props) {
	const [selected, setSelected] = useState<number | null>(periodIdx);

	const handleClickDateButton = useCallback(
		(type: PeriodType, value: number, idx: number) => {
			const [startDate, endDate] = calculatePeriod(type, value);
			onChange({
				...filter,
				startDate,
				endDate,
			});
			setSelected(idx);

			const periodLabel =
				periods.find((item) => item.type === type)?.label ?? '';
			trackingToParent(`${menu}_period_click`, {
				button_title: `기간선택_${periodLabel}`,
			});
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
			trackingToParent(`${menu}_period_directinput_click`, {
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
