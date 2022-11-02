import {Box} from '@mui/material';

import {defaultPeriod} from '@/data';

import {
	SearchField,
	SearchDate,
	SearchRadioGroup,
	SearchSelect,
} from '@/components';
import {ListSearchFilters, Options} from '@/@types';

interface Props<F> {
	filter: F & {[key: string]: any};
	filterComponent: ListSearchFilters;
	onChangeFilter: (value: object) => void;
	onSearch: (value: F) => void;
	onReset: () => void;
}

/**
 *
 * 상태가 바뀐 뒤 바로 검색이 되어야 하는 컴포넌트는 제어 컴포넌트로, (SearchDate, SearchRadioGroup)
 * 상태가 바뀐 뒤 바로 검색이 안 되어도 되는 컴포넌트는 비제어 컴포넌트로 개발 (SearchField)
 */
function SearchFilter<F extends object>({
	filter,
	filterComponent,
	onChangeFilter,
	onSearch,
	onReset,
}: Props<F>) {
	return (
		<Box
			display="grid"
			flexDirection="column"
			sx={(theme) => ({
				backgroundColor: 'grey.10',
				borderRadius: '4px',
				gridTemplateColumns: '150px auto',
				// 테이블 좌측 라벨
				'& > .MuiBox-root > .MuiFormLabel-root': {
					fontSize: '14px',
					fontWeight: 'bold',
					color: 'grey.700',
					marginLeft: '16px',
				},
				// border style
				'&': {
					border: `1px solid ${theme.palette.grey[100]}`,
				},
				'& > .MuiBox-root': {
					borderRight: `1px solid ${theme.palette.grey[100]}`,
				},
				'& > .MuiBox-root:not(:nth-last-of-type(-n+2)), & > .MuiGrid-root.MuiGrid-container:not(:nth-last-of-type(1))':
					{
						borderBottom: `1px solid ${theme.palette.grey[100]}`,
					},
				// height, padding
				'& > .MuiGrid-root.MuiGrid-container': {
					minHeight: '46px',
					alignItems: 'center',
					paddingLeft: '16px',
					paddingRight: '16px',
				},
				'& > .MuiGrid-root:not(.search-radio-group-grid-item)': {
					paddingTop: '6px',
					paddingBottom: '6px',
				},
			})}>
			{filterComponent.map((item) => {
				switch (item.component) {
					case 'searchField':
						return (
							<SearchField
								key={`search-field-${item.name[0]}`}
								label={item.label}
								name={item.name as string[]}
								selectValue={
									filter[item.name as string] ??
									(item.options as Options)[0].value
								}
								textValue={filter[item.name[1]]}
								options={item.options as Options}
								onSearch={onSearch}
								onReset={onReset}
							/>
						);
					case 'searchDate':
						return (
							<SearchDate
								key={item.name as string}
								startDate={
									filter?.startDate ?? defaultPeriod[0]
								}
								endDate={filter?.endDate ?? defaultPeriod[1]}
								filter={filter}
								onChange={onChangeFilter}
							/>
						);
					case 'radioGroup':
						return (
							<SearchRadioGroup
								key={item.name as string}
								name={item.name as string}
								label={item.label}
								value={
									filter[item.name as keyof F] ??
									(item.options as Options)[0].value
								}
								options={item.options as Options}
								onChange={(value) =>
									onChangeFilter({
										[item.name as string]: value,
									})
								}
							/>
						);
					case 'select':
						return (
							<SearchSelect
								key={item.name as string}
								name={item.name as string}
								label={item.label}
								value={
									filter[item.name as keyof F] ??
									(item.options as Options)[0].value
								}
								options={item.options as Options}
								onChange={(value) =>
									onChangeFilter({
										[item.name as string]: value,
									})
								}
							/>
						);
				}
			})}
		</Box>
	);
}

export default SearchFilter;
