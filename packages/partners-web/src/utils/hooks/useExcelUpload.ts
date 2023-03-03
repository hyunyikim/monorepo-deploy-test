import {ChangeEvent, useCallback, useEffect, useMemo, useState} from 'react';

import {ExcelError, ExcelErrorType, ExcelInput, ExcelProgress} from '@/@types';
import {EXCEL_FILE_TYPE} from '@/data';
import {useGlobalLoading, useMessageDialog} from '@/stores';
import {
	checkExcelCellError,
	getExcelErrors,
	matchingExcelDataWithKey,
	parseExcelData,
} from '@/utils';

interface Props<InputType> {
	excelColumn: {
		[K in keyof InputType]: string;
	};
	excelInput: {
		[K in keyof InputType]: ExcelInput;
	};
	inputs: ExcelInput[];
}

/**
 * 엑셀 업로드 처리 custom hook
 */
const useExcelUpload = <InputType>({
	excelColumn,
	excelInput,
	inputs,
}: Props<InputType>) => {
	const setIsLoading = useGlobalLoading((state) => state.setIsLoading);
	const onOpenMessageDialog = useMessageDialog((state) => state.onOpen);
	const onCloseMessageDialog = useMessageDialog((state) => state.onClose);

	// 엑셀 업로드 진행상황
	const [excelProgress, setExcelProgress] = useState<ExcelProgress | null>(
		null
	);
	// 엑셀 파싱 데이터
	const [excelData, setExcelData] = useState<InputType[] | null>(null);
	// 사용자 입력 데이터
	const [gridData, setGridData] = useState<InputType[] | null>(null);
	// 엑셀 에러
	const [excelErrors, setExcelErrors] = useState<ExcelError | null>(null);

	// 초기화
	useEffect(() => {
		if (!excelData) return;

		const initData = () => {
			setGridData(excelData);
		};
		const initCheckError = async () => {
			setIsLoading(true);
			const errors: ExcelError = new Map();
			for (let i = 0; i < excelData.length; i++) {
				const row = excelData[i];
				const error: Record<string, ExcelErrorType> = {};

				for (const col of Object.entries(row)) {
					const [key, value] = col;
					const invalid = await checkExcelCellError(
						value,
						excelInput[key as keyof InputType]
					);
					if (invalid) {
						error[key] = invalid;
					}
				}
				Object.keys(error)?.length > 0 && errors.set(i, error);
			}
			setExcelErrors(errors);
			setIsLoading(false);
		};

		initData();
		initCheckError();
	}, [excelData]);

	const handleInit = useCallback(() => {
		setExcelData(null);
		setGridData(null);
		setExcelProgress(null);
		onCloseMessageDialog();
	}, []);

	const handleExcelUpload = useCallback(
		async (e: ChangeEvent<HTMLInputElement>) => {
			const setInvalidFileFormat = async () => {
				onOpenMessageDialog({
					title: '올바르지 않은 엑셀파일입니다.',
					message:
						'엑셀양식이 변경되었을 수 있으니 새로운 양식을 다시 다운로드 해주세요.',
					showBottomCloseButton: true,
					closeButtonValue: '확인',
					onCloseFunc: handleInit,
				});
			};

			if (!e?.target?.files || !e.target.files[0]) {
				return;
			}

			const file = e.target.files[0];
			if (!EXCEL_FILE_TYPE.includes(file.type)) {
				await setInvalidFileFormat();
				return;
			}

			setExcelProgress({
				fileName: file.name,
				loaded: 0,
				total: file.size,
			});
			const reader = new FileReader();
			reader.readAsArrayBuffer(file);

			// 업로드
			reader.onload = async (e) => {
				setExcelProgress((prev) => ({
					...(prev as ExcelProgress),
					loaded: e.loaded,
				}));

				const excelData = await parseExcelData(
					reader.result as ArrayBuffer
				);
				if (!excelData) {
					return await setInvalidFileFormat();
				}
				const parsedExcelData = matchingExcelDataWithKey(
					excelData,
					inputs,
					excelColumn
				) as InputType[] | false;

				if (!parsedExcelData || parsedExcelData.length < 1) {
					return await setInvalidFileFormat();
				}
				setTimeout(() => {
					setExcelData(parsedExcelData);
					setExcelProgress(null);
				}, 500);
			};
			reader.onerror = (e) => {
				onOpenMessageDialog({
					title: '파일 업로드에 실패했습니다. 다시 시도해주세요.',
					showBottomCloseButton: true,
					closeButtonValue: '확인',
					onCloseFunc: () => setExcelProgress(null),
				});
			};
		},
		[handleInit, inputs]
	);

	const handleUpdate = async (
		rowIdx: number,
		columnKey: string,
		value: any
	) => {
		const invalid = await checkExcelCellError(
			value,
			excelInput.hasOwnProperty(columnKey)
				? excelInput[columnKey as keyof InputType]
				: undefined
		);
		const tempErrors = getExcelErrors(
			rowIdx,
			columnKey,
			invalid,
			new Map(excelErrors)
		);
		setExcelErrors(tempErrors);

		const newData = gridData as InputType[];
		newData[rowIdx][columnKey as keyof InputType] = value;
		setGridData(newData);
	};

	const excelLackingInfo = useMemo<Record<
		number,
		[string, ExcelErrorType][]
	> | null>(() => {
		if (!excelErrors) {
			return null;
		}
		const data: Record<number, [string, ExcelErrorType][]> = {};
		for (const row of excelErrors) {
			const [rowIdx, col] = row;
			const rowError: [string, ExcelErrorType][] = [];
			Object.entries(col).forEach(([columnKey, errorType]) => {
				const columnName = excelColumn[columnKey as keyof InputType];
				rowError.push([columnName, errorType]);
			});
			if (rowError?.length > 0) {
				data[rowIdx] = rowError;
			}
		}
		if (Object.keys(data)?.length < 1) {
			return null;
		}
		return data;
	}, [excelErrors]);

	return {
		gridData,
		excelProgress,
		excelErrors,
		excelLackingInfo,
		handleInit,
		handleExcelUpload,
		handleUpdate,
	};
};
export default useExcelUpload;
