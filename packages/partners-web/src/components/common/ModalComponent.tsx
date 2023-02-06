import {DialogActions, Typography, Stack} from '@mui/material';
import {useModalStore} from '@/stores';
import Button from '../atoms/Button';

import {openChildModal, closeChildModal, sendAmplitudeLog} from '@/utils';

import {Dialog} from '@/components';
import {useEffect} from 'react';

function ModalComponent() {
	const {
		id,
		isOpen,
		title,
		titlePadding,
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
		amplitudeInfo,
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
			onClose={() => {
				if (
					amplitudeInfo?.eventName &&
					amplitudeInfo.eventPropertyKey
				) {
					sendAmplitudeLog(amplitudeInfo.eventName, {
						[amplitudeInfo.eventPropertyKey]:
							amplitudeInfo.eventPropertyValue || '',
					});
				}

				closeHandler();
			}}
			showCloseButton={true}
			titleAlign={titleAlign}
			padding={titlePadding ? titlePadding : 32}
			TitleComponent={
				<Typography
					sx={{
						fontSize: {xs: '16px', sm: '20px'},
					}}
					fontWeight="bold">
					{title}
				</Typography>
			}
			sx={{
				'& .MuiDialog-container': {
					'& .MuiPaper-root': {
						maxWidth: maxWidth ? maxWidth : '700px',
						width: width ? width : 'auto',
						'& .MuiDialogContent-root': {
							paddingTop: {
								xs: '0px !important',
								sm: '4px !important',
							},
						},
					},
					'& .MuiDialogContent-root': {
						paddingBottom: '32px',
						padding: {xs: '0px 20px 24px 20px', sm: '32px'},
					},
				},
				...sx,
			}}>
			<>
				{subtitle && (
					<Typography
						variant="h6"
						sx={{
							fontSize: {xs: '13px', sm: '16px'},
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
