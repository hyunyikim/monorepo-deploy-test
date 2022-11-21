import {useEffect, useCallback} from 'react';

import {
	Typography,
	Dialog,
	DialogContent,
	DialogActions,
	DialogTitle,
} from '@mui/material';

import {useMessageDialog} from '@/stores';
import {openChildModal, closeChildModal} from '@/utils';

import {Button} from '@/components';

function MessageDialog() {
	const open = useMessageDialog((state) => state.open);
	const title = useMessageDialog((state) => state.title);
	const message = useMessageDialog((state) => state.message);
	const showBottomCloseButton = useMessageDialog(
		(state) => state.showBottomCloseButton
	);
	const closeButtonValue: '확인' | '취소' = useMessageDialog(
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
		closeChildModal();
	}, [open]);

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
			onClose={handleClose}
			sx={{
				'& .MuiPaper-root': {
					padding: '32px',
					width: '520px',
					minHeight: '197px',
				},
			}}>
			<DialogTitle
				fontSize={{
					xs: 16,
					md: 21,
				}}
				fontWeight={700}
				sx={{
					padding: 0,
					marginBottom: '16px',
				}}>
				{title}
			</DialogTitle>
			<DialogContent
				sx={{
					padding: 0,
					marginBottom: '40px',
				}}>
				<Typography
					color="grey.600"
					fontSize={{
						xs: 12,
						md: 16,
					}}
					sx={{
						wordBreak: 'break-word',
					}}>
					{message}
				</Typography>
			</DialogContent>
			<DialogActions
				sx={{
					padding: 0,
				}}>
				{showBottomCloseButton && (
					<Button
						color="grey-100"
						variant="outlined"
						onClick={handleClose}>
						{closeButtonValue}
					</Button>
				)}
				{buttons && buttons}
			</DialogActions>
		</Dialog>
	);
}

export default MessageDialog;
