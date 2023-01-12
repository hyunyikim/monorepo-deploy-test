import {DialogActions, Typography, Stack} from '@mui/material';
import {useModalStore} from '@/stores';
import Button from '../atoms/Button';

import {openChildModal, closeChildModal} from '@/utils';

import {Dialog} from '@/components';
import {useEffect} from 'react';

function ModalComponent() {
	const {
		id,
		isOpen,
		title,
		subtitle,
		subtitleFontSize,
		children,
		buttonTitle,
		setIsOpen,
		onClickButton,
		width,
		align,
		titleAlign,
		maxWidth,
		setCloseAndReset,
		customisedButton,
		sx,
		useBackgroundClickClose,
	} = useModalStore((state) => state);

	const closeHandler = () => {
		// 먼저 모달 닫고 닫힌 이후에 모달 데이터 초기화
		if (typeof setIsOpen === 'function') {
			setIsOpen(false);
			if (typeof setCloseAndReset === 'function') {
				setTimeout(() => {
					setCloseAndReset();
				}, 300);
			}
		}
	};

	useEffect(() => {
		if (isOpen) {
			openChildModal();
			return;
		}
		closeChildModal();

		/* 모달이 닫히면 모달옵션 초기화 */
		if (!isOpen && typeof setIsOpen === 'function') {
			closeHandler();
		}
	}, [isOpen]);

	return (
		<Dialog
			open={isOpen}
			useBackgroundClickClose={useBackgroundClickClose}
			onClose={closeHandler}
			showCloseButton={true}
			titleAlign={titleAlign}
			TitleComponent={
				<Typography fontSize={20} fontWeight="bold">
					{title}
				</Typography>
			}
			sx={{
				'& .MuiDialog-container': {
					'& .MuiPaper-root': {
						maxWidth: maxWidth ? maxWidth : '700px',
						width: width ? width : 'auto',
						'& .MuiDialogContent-root': {
							paddingTop: '4px !important',
						},
					},
					'& .MuiDialogContent-root': {
						paddingBottom: '32px',
					},
				},
				...sx,
			}}>
			<>
				{subtitle && (
					<Typography
						variant="h6"
						sx={{
							fontSize: subtitleFontSize
								? subtitleFontSize
								: '16px',
							fontWeight: 500,
							lineHeight: '16px',
							color: 'grey.300',
							marginBottom: '60px',
						}}>
						{subtitle}
					</Typography>
				)}
				<Stack
					justifyContent={align === 'left' ? 'flex-start' : 'center'}
					sx={{
						marginBottom:
							buttonTitle && onClickButton ? '60px' : '0px',
						width: align === 'left' ? ' 100%' : 'auto',
					}}>
					{children && children}
				</Stack>

				{customisedButton
					? customisedButton
					: buttonTitle &&
					  onClickButton && (
							<DialogActions sx={{p: 0}}>
								<Button
									variant="contained"
									width={'100%'}
									color={'gradient'}
									onClick={onClickButton}
									autoFocus>
									{buttonTitle}
								</Button>
							</DialogActions>
					  )}

				{/* {buttonTitle && onClickButton && (
					<DialogActions sx={{p: 0}}>
						<Button
							variant="contained"
							width={'100%'}
							color={'gradient'}
							onClick={onClickButton}
							autoFocus>
							{buttonTitle}
						</Button>
					</DialogActions>
				)} */}
			</>
		</Dialog>
	);
}

export default ModalComponent;
