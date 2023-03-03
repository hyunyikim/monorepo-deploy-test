import {ExcelError, ExcelErrorType, ExcelInput, Options} from '@/@types';
import {GUARANTEE_EXCEL_COLUMN} from '@/data';
import {Borders, Column, FillPattern, Workbook} from 'exceljs';
import {saveAs} from 'file-saver';
import {read, utils} from 'xlsx';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const generateExcelFile = async ({
	headers,
	requiredColumns,
	optionalColumns,
	sampleData,
}: {
	headers: string[];
	requiredColumns: Array<Partial<Column>>;
	optionalColumns: Array<Partial<Column>>;
	sampleData: any[];
}) => {
	const workbook = new Workbook();
	const worksheet = workbook.addWorksheet('Sheet1');

	worksheet.properties.defaultRowHeight = 18;
	worksheet.mergeCells(`A1:${alphabet[requiredColumns.length - 1]}1`);
	worksheet.mergeCells(
		`${alphabet[requiredColumns.length]}1:${
			alphabet[requiredColumns.length + optionalColumns.length - 1]
		}1`
	);

	worksheet.getCell('A1').value = '필수항목';
	worksheet.getCell(`${alphabet[requiredColumns.length]}1`).value =
		'선택항목';

	worksheet.addRow(headers);
	worksheet.columns = [...requiredColumns, ...optionalColumns];

	sampleData && worksheet.addRows(sampleData);

	worksheet.getRow(1).protection = {locked: true};
	worksheet.getRow(1).alignment = {vertical: 'middle', horizontal: 'center'};
	worksheet.getRow(1).font = {bold: true};
	worksheet.getRow(2).protection = {locked: true};
	worksheet.getRow(2).alignment = {vertical: 'middle', horizontal: 'center'};
	worksheet.getRow(2).font = {bold: true};

	const basicFill = {
		type: 'pattern',
		pattern: 'solid',
		fgColor: {argb: 'F3F3F5'},
	} as FillPattern;

	const requireFill = {
		type: 'pattern',
		pattern: 'solid',
		fgColor: {argb: 'FFD900'},
	} as FillPattern;

	const borderStyle = {
		top: {style: 'thin', color: {argb: 'E2E2E9'}},
		left: {style: 'thin', color: {argb: 'E2E2E9'}},
		bottom: {style: 'thin', color: {argb: 'E2E2E9'}},
		right: {style: 'thin', color: {argb: 'E2E2E9'}},
	} as Partial<Borders>;

	worksheet.getCell('A1').fill = requireFill;
	worksheet.getCell(`${alphabet[requiredColumns.length]}1`).fill = basicFill;

	Array(requiredColumns.length)
		.fill(null)
		.forEach((v, i) => {
			worksheet.getCell(`${alphabet[i]}2`).fill = requireFill;
		});

	Array(optionalColumns.length)
		.fill(null)
		.forEach((v, i) => {
			worksheet.getCell(`${alphabet[i + requiredColumns.length]}2`).fill =
				basicFill;
		});

	Array(requiredColumns.length + optionalColumns.length)
		.fill(null)
		.forEach((v, i) => {
			worksheet.getCell(`${alphabet[i]}1`).border = borderStyle;
			worksheet.getCell(`${alphabet[i]}2`).border = borderStyle;
		});

	return workbook;
};

/**
 * 지정하는 필드를 list로 만듦
 */
export const addWorkbookListValidation = (
	workbook: Workbook,
	listColumns: {
		columnIdx: number;
		options: Options<any>;
	}[]
) => {
	if (!workbook || workbook.worksheets?.length < 1) {
		return workbook;
	}
	const worksheet = workbook.worksheets[0];
	for (const listColumn of listColumns) {
		const {columnIdx, options} = listColumn;
		worksheet.getCell(`${alphabet[columnIdx]}3`).dataValidation = {
			type: 'list',
			allowBlank: true,
			formulae: [`"${options.map((option) => option.label).join(',')}"`], // formulae: ['"One,Two,Three,Four"'],
		};
	}
	return workbook;
};

export const downloadExcel = async (workbook: Workbook, title: string) => {
	const mimeType = {
		type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	};
	const buffer = await workbook.xlsx.writeBuffer();
	const blob = new Blob([buffer], mimeType);
	saveAs(blob, title);
};

export const parseExcelData = async (excelBuffer: ArrayBuffer) => {
	const workbook = read(excelBuffer);
	if (!workbook) {
		return false;
	}
	const worksheet = workbook.Sheets[workbook.SheetNames[0]];
	if (!worksheet) {
		return false;
	}
	const userExcelData = utils.sheet_to_json<string[]>(worksheet, {header: 1});
	return userExcelData;
};

/**
 * string[][] 형태의 유저 엑셀 데이터를 object[] 형태로 변경
 */
export const matchingExcelDataWithKey = <T>(
	userExcelData: string[][],
	inputs: ExcelInput[],
	excelColumn: T
) => {
	// 컬럼 개수 체크 + 유효성 검사
	if (userExcelData?.length < 2) {
		return false;
	}
	const userExcelHeaders = userExcelData[1].filter((header) => !!header);

	// 엑셀에 필드 누락
	if (userExcelHeaders.length !== inputs.length) {
		return false;
	}
	const inputHeaders = inputs.map((input) =>
		String(excelColumn[input.name as keyof T] || input.name).trim()
	);
	const notExistedInput = userExcelHeaders.find(
		(header) => !inputHeaders.includes(header.trim())
	);
	if (notExistedInput) {
		return false;
	}

	/**
	 * 서식 제거
	 *
	 * @param _value
	 * @returns {*|string}
	 */
	const removeRichTextOfExcel = (_value: any) => {
		let result = _value;
		if (typeof _value === 'object' && Object.keys(_value).length > 0) {
			result = _value.hyperlink
				? _value.hyperlink
				: _value.richText
				? _value.richText[0]?.text
				: _value.result
				? _value.result
				: _value.text
				? _value.text
				: '';
		}
		return result || '';
	};

	const data: any[] = [];
	userExcelData.forEach((row, i) => {
		if (i <= 1 || row.length === 0) {
			return;
		}
		const result: Record<string, any> = {};
		inputs.forEach((input, j) => {
			let val = removeRichTextOfExcel(row[j]);
			if (input?.parser && typeof input?.parser === 'function') {
				val = input.parser(val);
			}
			result[input.name] = val || '';
		});
		data.push(result);
	});
	return data;
};

export const checkExcelCellError = async (
	columnValue: unknown,
	input?: ExcelInput
): Promise<ExcelErrorType | null> => {
	if (
		columnValue &&
		input?.validator &&
		typeof input?.validator === 'function' &&
		!(await input.validator(columnValue))
	) {
		return 'invalid';
	}
	if (input?.required && !columnValue) {
		return 'required';
	}
	return null;
};

/**
 * 새롭게 입력된 값의 에러 여부를 판단해 에러 객체의 값을 교체한다
 *
 * @param rowIdx
 * @param columnKey
 * @param invalid
 * @param errors
 * @returns 에러 객체
 */
export const getExcelErrors = (
	rowIdx: number,
	columnKey: string,
	invalid: ExcelErrorType | null,
	errors: ExcelError
) => {
	const rowError = errors?.get(rowIdx);
	if (invalid) {
		if (errors && rowError) {
			rowError[columnKey] = invalid;
		} else {
			errors.set(rowIdx, {
				columnKey: invalid,
			});
		}
	} else {
		if (errors && rowError && rowError[columnKey]) {
			delete (errors.get(rowIdx) as Record<string, ExcelErrorType>)[
				columnKey
			];
			// 해당 로우 에러 없음
			if (Object.keys(rowError).length === 0) {
				errors.delete(rowIdx);
			}
		}
	}
	return errors;
};
