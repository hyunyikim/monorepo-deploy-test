import {useEffect, useCallback} from 'react';

import {
	Dialog,
	DialogContent,
	DialogActions,
	DialogTitle,
	Box,
} from '@mui/material';

import {useMessageDialog} from '@/stores';
import {openChildModal, closeChildModal} from '@/utils';

import {Button} from '@/components';
import {IcClose} from '@/assets/icon';

function MessageDialog() {
	const open = useMessageDialog((state) => state.open);
	const title = useMessageDialog((state) => state.title);
	const message = useMessageDialog((state) => state.message);
	const useCloseIcon = useMessageDialog((state) => state.useCloseIcon);
	const sendCloseModalControlToParent = useMessageDialog(
		(state) => state.sendCloseModalControlToParent
	);
	const disableClickBackground = useMessageDialog(
		(state) => state.disableClickBackground
	);
	const showBottomCloseButton = useMessageDialog(
		(state) => state.showBottomCloseButton
	);
	const closeButtonValue: '확인' | '취소' | '닫기' = useMessageDialog(
		(state) => state.closeButtonValue
	);
	const buttons = useMessageDialog((state) => state.buttons);
	const onClose = useMessageDialog((state) => state.onClose);
	const onCloseFunc = useMessageDialog((state) => state.onCloseFunc);
	const initMessageDialog = useMessageDialog(
		(state) => state.initMessageDialog
	);

	useEffect(() => {
		if (open) {
			openChildModal();
			return;
		}
		sendCloseModalControlToParent && closeChildModal();
	}, [open, sendCloseModalControlToParent]);

	const handleClose = useCallback(() => {
		if (onCloseFunc) {
			onCloseFunc();
		}
		onClose();

		// 모달 닫히는데 0.3초 정도 걸리기 때문에, 0.3초 후에 모달 데이터 초기화 되도록 처리
		setTimeout(() => {
			initMessageDialog();
		}, 350);
	}, [onClose, onCloseFunc, initMessageDialog]);

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
						}}>
						{title}
					</DialogTitle>
					{useCloseIcon && (
						<IcClose
							style={{cursor: 'pointer'}}
							onClick={handleClose}
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
