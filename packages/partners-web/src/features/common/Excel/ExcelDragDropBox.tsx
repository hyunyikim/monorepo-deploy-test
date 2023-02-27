import {ChangeEvent, useRef} from 'react';

import {Stack, Typography, LinearProgress} from '@mui/material';

import {ExcelProgress} from '@/@types';
import {EXCEL_FILE_TYPE} from '@/data';

import {Button} from '@/components';
import {IcList2} from '@/assets/icon';

import style from '@/assets/styles/style.module.scss';
import DragDropBox from '@/features/common/DragDropBox';

interface Props {
	progress: ExcelProgress | null;
	onUploadFile: (e: ChangeEvent<HTMLInputElement>) => void;
}

function ExcelDragDropBox({progress, onUploadFile}: Props) {
	const dragDropBoxRef = useRef(null);
	return progress ? (
		<Stack
			justifyContent="center"
			alignItems="center"
			sx={{
				minHeight: '300px',
				backgroundColor: 'primary.50',
				border: (theme) =>
					`1px solid ${theme.palette.primary[100] as string}`,
				borderRadius: '8px',
			}}>
			<Stack
				flexDirection="row"
				p="12px 16px"
				mb="32px"
				sx={{
					backgroundColor: '#FFF',
					borderRadius: '8px',
					filter: `drop-shadow(0px 0px 20px rgba(82, 110, 255, 0.2))`,
				}}>
				<IcList2 color={style.vircleGreen500} width={24} height={24} />
				<Typography variant="body1" ml="8px">
					{progress?.fileName}
				</Typography>
			</Stack>
			<LinearProgress
				variant="determinate"
				value={(progress.loaded / progress.total) * 100}
				sx={{
					height: '8px',
					minWidth: '200px',
					backgroundColor: '#FFF',
					borderRadius: '24px',
					'& .MuiLinearProgress-bar': {
						backgroundColor: 'primary.main',
						borderRadius: '24px',
					},
				}}
			/>
			<Typography variant="body1" mt="20px">
				업로드중..
			</Typography>
		</Stack>
	) : (
		<DragDropBox ref={dragDropBoxRef}>
			<Stack
				ref={dragDropBoxRef}
				justifyContent="center"
				alignItems="center"
				sx={{
					minHeight: '300px',
					backgroundColor: 'primary.50',
					border: (theme) =>
						`1px solid ${theme.palette.primary[100] as string}`,
					borderRadius: '8px',
					'&:hover, &.dragover': {
						backgroundColor: 'primary.200',
					},
				}}>
				<Typography variant="subtitle2" fontWeight={700} mb="12px">
					첨부할 파일을 드래그해주세요.
				</Typography>
				<Button height={40}>파일 선택</Button>
				<input
					type="file"
					accept={EXCEL_FILE_TYPE.join(',')}
					onChange={onUploadFile}
				/>
			</Stack>
		</DragDropBox>
	);
}

export default ExcelDragDropBox;
