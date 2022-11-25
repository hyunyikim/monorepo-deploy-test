import {
	DialogTitle,
	DialogContent,
	DialogActions,
	Grid,
	Typography,
} from '@mui/material';
import {IcClose} from '@/assets/icon';
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
		children,
		buttonTitle,
		setOpen,
		onClickButton,
		width,
		align,
		maxWidth,
		setCloseAndReset,
	} = useModalStore((state) => state);

	const closeHandler = () => {
		if (typeof setOpen === 'function') {
			if (typeof setCloseAndReset === 'function') {
				setCloseAndReset();
			}
			setOpen(false);
		}
	};

	useEffect(() => {
		if (isOpen) {
			openChildModal();
			return;
		}
		closeChildModal();

		/* 모달이 닫히면 모달옵션 초기화 */
		if (!isOpen && typeof setCloseAndReset === 'function') {
			setCloseAndReset();
		}
	}, [isOpen]);

	return (
		<Dialog
			open={isOpen}
			onClose={closeHandler}
			showCloseButton={true}
			TitleComponent={
				<DialogTitle
					fontSize={20}
					fontWeight="bold"
					padding={'0 !important'}>
					{title}
				</DialogTitle>
			}
			sx={{
				'& .MuiDialog-container': {
					marginBottom: '60px',
					'& .MuiPaper-root': {
						padding: '24px',
						borderRadius: '16px',
						// height: '100%',
						maxWidth: maxWidth ? maxWidth : '700px',
						width: width ? width : 'auto',
					},
				},
				'& .MuiDialogContent-root': {
					marginBottom: 0,
					padding: 0,
					paddingBottom: 0,
				},
			}}
			onClose={closeHandler}>
			<>
				<DialogContent sx={{padding: 0, paddingBottom: '60px'}}>
					{subtitle && (
						<Typography
							variant="h6"
							sx={{
								fontSize: '16px',
								fontWeight: 500,
								lineHeight: '16px',
								color: 'grey.300',
								marginBottom: '60px',
							}}>
							{subtitle}
						</Typography>
					)}

					<Grid
						container
						justifyContent={
							align === 'left' ? 'flex-start' : 'center'
						}
						sx={{
							marginBottom:
								buttonTitle && onClickButton ? '60px' : '0px',
							width: align === 'left' ? ' 100%' : 'auto',
						}}>
						{children && children}
					</Grid>
				</DialogContent>

				{buttonTitle && onClickButton && (
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
			</>
		</Dialog>
	);
}

export default ModalComponent;
