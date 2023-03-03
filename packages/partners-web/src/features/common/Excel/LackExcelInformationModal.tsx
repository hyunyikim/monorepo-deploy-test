import {Box, TableRow, Typography} from '@mui/material';

import {Dialog, TableInfo, Table, TableCell} from '@/components';

import style from '@/assets/styles/style.module.scss';
import {ExcelErrorType} from '@/@types';
import {isEndWithConsonant} from '@/utils';

interface Props {
	open: boolean;
	onClose: () => void;
	title: string;
	desc: string;
	data: Record<number, [string, ExcelErrorType][]>;
}

function LackExcelInformationModal({open, onClose, title, desc, data}: Props) {
	const totalSize = Object.entries(data).length;
	return (
		<Dialog
			open={open}
			onClose={onClose}
			TitleComponent={
				<Typography fontSize={24} fontWeight={700}>
					{title} 정보 부족
				</Typography>
			}
			showCloseButton={true}
			useBackgroundClickClose={true}
			width={800}
			sx={{
				'& .MuiDialogContent-root': {
					paddingBottom: '40px',
				},
			}}>
			<>
				<Typography variant="body3" color="grey.600">
					{title} 대량발급을 위해 누락된 필수항목이 있어요.
					<br />
					아래 이슈를 해결하고 {desc}하세요.
				</Typography>
				<Box>
					<TableInfo
						info="부족개수"
						totalSize={totalSize}
						unit="개"
						sx={{
							marginY: '16px',
							'& .table-info-count': {
								fontSize: 13,
								'& .MuiBox-root': {
									color: style.vircleRed500,
								},
							},
						}}
					/>
					<Table
						isLoading={false}
						totalSize={totalSize}
						headcell={
							<>
								<TableCell width={100}>엑셀 행번호</TableCell>
								<TableCell>실패사유</TableCell>
							</>
						}>
						{Object.entries(data).map((item, idx) => {
							const [key, value] = item;
							return (
								<TableRow key={`item_${idx}`}>
									<TableCell
										sx={{
											'& > .MuiBox-root': {
												justifyContent: 'center',
											},
										}}>
										<Typography variant="body3">
											{Number(item[0]) + 1}
										</Typography>
									</TableCell>
									<TableCell
										sx={{
											'& > .MuiBox-root': {
												flexDirection: 'column',
												justifyContent: 'center',
												alignItems:
													'flex-start !important',
											},
										}}>
										{value.map((item, idx) => {
											const columnName = item[0];
											const errorType = item[1];
											return (
												<Typography
													variant="body3"
													key={idx}>
													<Typography
														variant="body3"
														fontWeight="bold"
														component="span">
														`{columnName}`
													</Typography>
													&nbsp;
													{errorType === 'required' &&
														`${
															isEndWithConsonant(
																columnName[
																	columnName.length -
																		1
																]
															)
																? '을'
																: '를'
														} 입력해주세요.`}
													{errorType === 'invalid' &&
														`형식이 잘못되었습니다.`}
												</Typography>
											);
										})}
									</TableCell>
								</TableRow>
							);
						})}
					</Table>
				</Box>
			</>
		</Dialog>
	);
}

export default LackExcelInformationModal;
