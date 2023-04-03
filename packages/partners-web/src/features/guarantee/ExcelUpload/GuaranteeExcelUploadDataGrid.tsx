import {Stack, TableRow, Typography, Button as MuiButton} from '@mui/material';

import {
	ExcelError,
	ExcelField,
	ExcelInput,
	RegisterGuaranteeRequestExcelFormData,
} from '@/@types';
import {GUARANTEE_EXCEL_COLUMN, GUARANTEE_EXCEL_INPUT} from '@/data';

import {Table, HeadTableCell, TableCell} from '@/components';
import {IcInformation} from '@/assets/icon';

import style from '@/assets/styles/style.module.scss';
import ExcelDataCell from '@/features/common/Excel/ExcelDataCell';

interface Props {
	inputs: ExcelInput[];
	fields: ExcelField<RegisterGuaranteeRequestExcelFormData>[];
	data: RegisterGuaranteeRequestExcelFormData[];
	excelErrors: ExcelError | null;
	onUpdate: (rowIdx: number, columnKey: string, value: any) => void;
	onOpenLackExcelInformationModal: () => void;
	onOpenProductImgModal: () => void;
	setProductImgModalData: (value: any) => void;
	ExcelFormatDownloadButton: React.ReactNode;
}

function GuaranteeExcelUploadDataGrid({
	inputs,
	fields,
	data,
	excelErrors,
	onUpdate,
	onOpenLackExcelInformationModal,
	onOpenProductImgModal,
	setProductImgModalData,
	ExcelFormatDownloadButton,
}: Props) {
	return (
		<>
			<Stack
				flexDirection="row"
				mb="20px"
				justifyContent="space-between"
				flexWrap="wrap"
				gap="10px">
				<Stack
					flexDirection="row"
					alignItems="center"
					flexWrap="wrap"
					gap="10px">
					<Typography
						fontSize={14}
						color="grey.900"
						fontWeight="bold"
						mr="24px">
						전체{' '}
						<Typography
							fontSize={14}
							color="primary.main"
							fontWeight="bold"
							component="span">
							{data?.length || 0}
						</Typography>
						건
					</Typography>
					{excelErrors && excelErrors?.size > 0 && (
						<>
							<MuiButton
								startIcon={
									<IcInformation color={style.vircleRed500} />
								}
								sx={(theme) => ({
									borderRadius: '4px',
									padding: '8px 12px',
									color: theme.palette.red.main,
									backgroundColor: theme.palette.red[50],
									'&:hover': {
										backgroundColor: theme.palette.red[100],
									},
									marginRight: '16px',
								})}
								onClick={onOpenLackExcelInformationModal}
								data-tracking={`guarantee_excelpublish_infodeficiency_click,{'button_title': '개런티 정보부족 버튼 클릭'}`}>
								개런티 정보 부족{' '}
								{(excelErrors?.size ?? 0).toLocaleString()}건
							</MuiButton>
							<Typography variant="body3" margin="auto">
								아래 항목을 편집할 수 있습니다. 입력창을
								클릭해보세요.
							</Typography>
						</>
					)}
				</Stack>
				<Stack flexDirection="row" alignItems="center">
					<Typography
						fontWeight={400}
						fontSize={14}
						color="red.main"
						marginRight="32px">
						*: 필수항목
					</Typography>
					{ExcelFormatDownloadButton}
				</Stack>
			</Stack>
			<Table
				isLoading={false}
				totalSize={data?.length ?? 0}
				headcell={
					<>
						<HeadTableCell width={52} minWidth={52} />
						{fields.map((field, idx) => (
							<HeadTableCell
								key={`head_${idx}`}
								required={
									!!GUARANTEE_EXCEL_INPUT[
										field.key as keyof RegisterGuaranteeRequestExcelFormData
									]?.required
								}>
								{GUARANTEE_EXCEL_COLUMN[
									field.key as keyof RegisterGuaranteeRequestExcelFormData
								] || field.key}
							</HeadTableCell>
						))}
					</>
				}>
				{data.length === 0 && (
					<TableRow>
						<TableCell align="center" colSpan={20}>
							데이터가 존재하지 않습니다.
						</TableCell>
					</TableRow>
				)}
				{data.map((row, i) => {
					return (
						<TableRow key={`row_${i}`}>
							<TableCell width={52} minWidth={52}>
								<Typography variant="body3" m="auto">
									{i + 1}
								</Typography>
							</TableCell>

							{inputs.map((input, j) => {
								const key = input.name;
								const value =
									row[
										key as keyof RegisterGuaranteeRequestExcelFormData
									];
								const isError =
									excelErrors?.has(i) &&
									excelErrors.get(i)?.hasOwnProperty(key);
								return (
									<ExcelDataCell
										key={`col_${i}_${key}`}
										value={value}
										excelInput={input}
										rowIdx={i}
										columnKey={key}
										isError={isError}
										onUpdate={onUpdate}
										onOpenProductImgModal={
											onOpenProductImgModal
										}
										setProductImgModalData={
											setProductImgModalData
										}
									/>
								);
							})}
						</TableRow>
					);
				})}
			</Table>
		</>
	);
}

export default GuaranteeExcelUploadDataGrid;
