import {ChangeEvent, useEffect, useMemo, useState} from 'react';

import {ExcelInput} from '@/@types';
import {Select, TableCell, Autocomplete} from '@/components';
import {InputBase, SelectChangeEvent, Typography} from '@mui/material';

interface Props {
	value: any;
	excelInput: ExcelInput;
	rowIdx: number;
	columnKey: string;
	isError?: boolean;
	onUpdate: (rowIdx: number, columnKey: string, value: any) => void;
	onOpenProductImgModal: () => void;
	setProductImgModalData: (value: any) => void;
}

const DEFAULT_CELL_WIDTH = 180;
function ExcelDataCell({
	value,
	excelInput,
	rowIdx,
	columnKey,
	isError,
	onUpdate,
	onOpenProductImgModal,
	setProductImgModalData,
}: Props) {
	const {width, type} = excelInput;

	const handleUpdate = (value: any) => {
		onUpdate(rowIdx, columnKey, value);
	};

	return (
		<TableCell
			minWidth={width || DEFAULT_CELL_WIDTH}
			width={width || DEFAULT_CELL_WIDTH}
			sx={{
				...(isError && {
					backgroundColor: (theme) => theme.palette.red[50],
				}),
				'& .MuiBox-root': {
					padding: '0 !important',
					'& .MuiInputBase-root': {
						minHeight: 'inherit',
						width: '100%',
						'& input': {
							boxSizing: 'border-box',
							minHeight: 'inherit',
							padding: '14px 16px',
							fontSize: 14,
							color: 'grey.900',
							...(isError && {
								backgroundColor: (theme) =>
									theme.palette.red[50],
							}),
						},
						'& input:focus': {
							border: '1px solid black',
						},
					},
					'& > .MuiTypography-root': {
						padding: '14px 16px',
					},
					// select
					'& .MuiFormControl-root': {
						width: '100%',
						'& .MuiInputBase-root': {
							...(isError && {
								backgroundColor: (theme) =>
									theme.palette.red[50],
							}),
							'& .MuiSelect-select': {
								padding: '14px 16px',
							},
						},
						'& .MuiInputBase-root.Mui-focused': {
							border: '1px solid black',
						},
						'& .MuiOutlinedInput-notchedOutline': {
							border: 'none',
						},
					},
					'& .MuiAutocomplete-root.Mui-focused': {
						'& input': {
							border: 'none',
						},
					},
				},
			}}>
			{type === 'text' && (
				<ExcelDataCellInput
					value={value}
					excelInput={excelInput}
					onUpdate={handleUpdate}
				/>
			)}
			{type === 'select' && (
				<ExcelDataCellSelect
					value={value}
					excelInput={excelInput}
					onUpdate={handleUpdate}
				/>
			)}
			{type === 'link' && (
				<ExcelDataCellLink
					link={value}
					isError={isError}
					rowIdx={rowIdx}
					columnKey={columnKey}
					onOpenProductImgModal={onOpenProductImgModal}
					setProductImgModalData={setProductImgModalData}
				/>
			)}
			{type === 'autocomplete' && (
				<ExcelDataCellAutoComplete
					value={value}
					excelInput={excelInput}
					onUpdate={handleUpdate}
				/>
			)}
		</TableCell>
	);
}

const ExcelDataCellInput = ({
	value,
	excelInput,
	onUpdate,
}: {
	value: string;
	excelInput: ExcelInput;
	onUpdate: (value: any) => void;
}) => {
	const {parser, renderer} = excelInput;
	const [text, setText] = useState('');
	const [isActive, setIsActive] = useState<boolean>(false);

	useEffect(() => {
		setText(value || '');
	}, [value]);

	const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
		let value = e.target.value || '';
		if (parser && typeof parser === 'function') {
			value = parser(value);
		}
		setText(value);
	};

	const handleClick = () => {
		setIsActive(true);
	};

	const handleBlur = () => {
		onUpdate(text);
		setIsActive(false);
	};

	const displayValue = useMemo<string>(() => {
		if (!text) {
			return '-';
		}
		if (renderer && typeof renderer === 'function') {
			return renderer(text);
		}
		return text;
	}, [text, renderer]);

	return (
		<InputBase
			value={isActive ? text : displayValue}
			onChange={handleChangeInput}
			onBlur={handleBlur}
			onClick={handleClick}
		/>
	);
};

const ExcelDataCellSelect = ({
	value,
	excelInput,
	onUpdate,
}: {
	value: string;
	excelInput: ExcelInput;
	onUpdate: (value: any) => void;
}) => {
	const handleUpdate = (e: SelectChangeEvent) => {
		const value = e.target.value;
		onUpdate(value);
	};
	return (
		<Select
			options={excelInput?.options || []}
			value={value}
			onChange={(e) => handleUpdate(e)}
		/>
	);
};

const ExcelDataCellAutoComplete = ({
	value,
	excelInput,
	onUpdate,
}: {
	value: string;
	excelInput: ExcelInput;
	onUpdate: (value: any) => void;
}) => {
	const handleUpdate = (value: any) => {
		onUpdate(value);
	};
	return (
		<Autocomplete
			defaultOptions={
				excelInput?.options?.map((option) => option.label) || []
			}
			value={value || ''}
			onChange={handleUpdate}
			sx={{
				width: '100%',
				'& .MuiAutocomplete-endAdornment': {
					bottom: '10px',
				},
			}}
		/>
	);
};

const ExcelDataCellLink = ({
	link,
	isError,
	rowIdx,
	columnKey,
	onOpenProductImgModal,
	setProductImgModalData,
}: {
	link: string;
	isError?: boolean;
	rowIdx: number;
	columnKey: string;
	onOpenProductImgModal: () => void;
	setProductImgModalData: (value: any) => void;
}) => {
	const handleClickLink = () => {
		setProductImgModalData({
			link,
			rowIdx,
			columnKey,
		});
		onOpenProductImgModal();
	};

	if (isError) {
		return (
			<Typography
				className="cursor-pointer underline"
				fontSize={14}
				color="red.main"
				onClick={handleClickLink}>
				링크오류
			</Typography>
		);
	}
	return (
		<Typography
			className="cursor-pointer underline"
			fontSize={14}
			color="primary.main"
			onClick={handleClickLink}>
			{link ? '미리보기' : '이미지추가'}
		</Typography>
	);
};

export default ExcelDataCell;
