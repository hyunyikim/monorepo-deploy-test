import {useRef, useCallback} from 'react';
import {Link} from 'react-router-dom';
// import PropTypes from 'prop-types';

import {Grid, Box, Typography, Stack, GridTypeMap} from '@mui/material';

import {trackingToParent} from '@/utils';

import imgDragAndDrop1 from '@/assets/images/img_drag_and_drop1.png';
import imgDragAndDrop2 from '@/assets/images/img_drag_and_drop2.png';

interface BrandSettingDragDropBoxProps {
	accept: string;
	width?: string;
	height?: string;
	handleFile: (e: React.FormEvent<HTMLInputElement>) => void;
}

function BrandSettingDragDropBox({
	accept = 'image/*',
	width,
	height,
	handleFile,
}: BrandSettingDragDropBoxProps) {
	const wrapperRef = useRef<HTMLDivElement | null>(null);

	const onDragEnter = useCallback(() => {
		(wrapperRef.current as HTMLDivElement).classList.add('dragover');
	}, []);

	const onDragLeave = useCallback(() => {
		(wrapperRef.current as HTMLDivElement).classList.remove('dragover');
	}, []);

	const onDrop = useCallback(() => {
		onDragLeave();
	}, []);

	return (
		<>
			<Grid
				container
				direction="column"
				ref={wrapperRef}
				onDragEnter={onDragEnter}
				onDragLeave={onDragLeave}
				onDrop={onDrop}
				onClick={() =>
					trackingToParent(
						'guaranteesetting_cardcustom_popup_filesearch_click',
						{button_title: '기기에서 검색'}
					)
				}
				sx={{
					position: 'relative',
					border: '2px dashed',
					borderColor: 'primary.200',
					backgroundColor: '#FFF',
					width: width ? width : '100%',
					height: height ? height : '100%',
					borderRadius: '16px',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					'& input': {
						opacity: 0,
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						cursor: 'pointer',
					},
					'&:hover, &.dragover': {
						backgroundColor: '#F7F8FF',
					},
				}}>
				<Stack padding="80px 0">
					<Box
						sx={{
							margin: 'auto',
							position: 'relative',
							'& img': {
								position: 'relative',
								left: '45%',
								transform: 'translateX(-50%)',
							},
						}}>
						<img src={imgDragAndDrop2} alt="drag-and-drop" />
						<img
							src={imgDragAndDrop1}
							alt="drag-and-drop"
							style={{
								left: 0,
							}}
						/>
					</Box>
					<Typography
						sx={{
							fontSize: '21px !important',
							fontWeight: 700,
							color: `grey.900 !important`,
							margin: '10px 0',
						}}
						align="center">
						이미지를 드래그하여 업로드 하세요
					</Typography>
					<Typography
						align="center"
						sx={{
							fontSize: '16px !important',
							fontWeight: 600,
							color: `grey.300 !important`,
							marginBottom: '48px',
						}}>
						(PNG,JPG,JPEG, 최대 파일 크기 2MB)
					</Typography>
					<Typography
						align="center"
						sx={{
							fontSize: '18px',
							fontWeight: 700,
							color: `primary.main`,
							marginBottom: '48px',
							lineHeight: '32px',
							textDecoration: 'underline',
						}}
						/* component={Link} */
					>
						내 기기에서 검색
					</Typography>
				</Stack>
				<input
					type="file"
					accept={accept}
					onChange={(e) => handleFile(e)}
				/>
			</Grid>
		</>
	);
}

// BrandSettingDragDropBox.propTypes = {
// 	accept: PropTypes.string,
// 	width: PropTypes.number,
// 	height: PropTypes.number,
// 	handleFile: PropTypes.func.isRequired,
// };

export default BrandSettingDragDropBox;
