import {useCallback, useEffect} from 'react';

import {
	Dialog,
	DialogContent,
	DialogActions,
	DialogTitle,
	Box,
} from '@mui/material';

import {useMessageDialog} from '@/stores';

import {Button} from '@/components';
import {IcClose} from '@/assets/icon';

function MessageDialog() {
	const open = useMessageDialog((state) => state.open);
	const title = useMessageDialog((state) => state.title);
	const message = useMessageDialog((state) => state.message);
	const useCloseIcon = useMessageDialog((state) => state.useCloseIcon);
	const disableClickBackground = useMessageDialog(
		(state) => state.disableClickBackground
	);
	const disableScroll = useMessageDialog((state) => state.disableScroll);
	const showBottomCloseButton = useMessageDialog(
		(state) => state.showBottomCloseButton
	);
	const closeButtonValue: '확인' | '취소' | '닫기' | '아니오' =
		useMessageDialog((state) => state.closeButtonValue);
	const buttons = useMessageDialog((state) => state.buttons);
	const onClose = useMessageDialog((state) => state.onClose);
	const onCloseFunc = useMessageDialog((state) => state.onCloseFunc);
	const initMessageDialog = useMessageDialog(
		(state) => state.initMessageDialog
	);

	const handleClose = useCallback(() => {
		if (onCloseFunc) {
			onCloseFunc();
		}
		onClose();
	}, [onClose, onCloseFunc]);

	return (
		<Dialog
			open={open}
			{...(!disableClickBackground && {
				onClose: handleClose,
			})}
			sx={{
				'& .MuiPaper-root': {
					padding: '32px',
					width: '520px',
					minHeight: '197px',
					borderRadius: '16px',
				},
				...(disableScroll && {
					'& .MuiDialogContent-root': {
						overflowY: 'visible',
					},
				}),
			}}>
			{
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'flex-start',
					}}>
					<DialogTitle
						fontSize={{
							xs: 16,
							md: 21,
						}}
						lineHeight={1.45}
						fontWeight={700}
						sx={{
							padding: 0,
							marginBottom: '8px',
							width: useCloseIcon ? 'calc(100% - 24px)' : '100%',
						}}>
						{title}
					</DialogTitle>
					{useCloseIcon && (
						<IcClose
							style={{cursor: 'pointer'}}
							onClick={handleClose}
							color="#000000"
						/>
					)}
				</Box>
			}
			<DialogContent
				sx={{
					padding: 0,
					marginBottom: '40px',
				}}>
				<Box
					color="grey.600"
					fontSize={{
						xs: 12,
						md: 16,
					}}
					lineHeight={1.45}
					sx={{
						wordBreak: 'keep-all',
					}}>
					{message}
				</Box>
			</DialogContent>
			<DialogActions
				sx={{
					padding: 0,
				}}>
				{showBottomCloseButton &&
					(!buttons ? (
						<Button
							color="black"
							variant="contained"
							onClick={handleClose}>
							{closeButtonValue}
						</Button>
					) : (
						<Button
							color="grey-100"
							variant="outlined"
							onClick={handleClose}>
							{closeButtonValue}
						</Button>
					))}
				{buttons && buttons}
			</DialogActions>
		</Dialog>
	);
}

export default MessageDialog;
