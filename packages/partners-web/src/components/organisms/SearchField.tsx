import {useCallback, useRef} from 'react';
import {Grid, InputLabel} from '@mui/material';

import {Options} from '@/@types';

import {Select, TextField, Button} from '@/components';

interface Props {
	label?: string;
	name: string[];
	options: Options;
	selectValue: any;
	textValue: string;
	onSearch: (param: any) => void;
	onReset: () => void;
}

function SearchField({
	label = '검색어',
	name,
	options,
	selectValue,
	textValue,
	onSearch,
	onReset,
}: Props) {
	const selectRef = useRef<HTMLSelectElement>();
	const textRef = useRef<HTMLInputElement>();

	const handleSearch = useCallback(() => {
		const param = {
			[name[0]]: selectRef.current?.value,
			[name[1]]: textRef.current?.value ?? '',
		};
		onSearch(param);
	}, [name, onSearch]);

	const handleReset = useCallback(() => {
		const selectEle = selectRef.current;
		const textEle = textRef.current;
		if (!selectEle || !textEle) return;

		selectEle.value = options[0].value;
		// selectEle의 라벨명 변경
		const selectNodeList = document.getElementsByName(name[0]);
		if (
			selectNodeList?.length > 0 &&
			selectNodeList[0].previousSibling?.textContent
		) {
			selectNodeList[0].previousSibling.textContent = options[0].label;
		}
		textEle.value = '';

		onReset();
	}, [onReset]);

	return (
		<>
			<Grid item xs={2} className="flex items-center">
				<InputLabel>{label}</InputLabel>
			</Grid>
			<Grid
				item
				container
				xs={10}
				columnGap={0.5}
				rowGap={0.5}
				className="items-center">
				<Select
					ref={selectRef}
					width={150}
					height={32}
					name={name[0]}
					options={options}
					defaultValue={selectValue}
				/>
				<TextField
					ref={textRef}
					name={name[1]}
					height={32}
					defaultValue={textValue}
					onEnterPress={handleSearch}
				/>
				<Button color="black" height={32} onClick={handleSearch}>
					검색
				</Button>
				<Button
					color="grey-100"
					height={32}
					variant="outlined"
					onClick={handleReset}>
					초기화
				</Button>
			</Grid>
		</>
	);
}

export default SearchField;
