import {Typography, DialogContent, DialogActions} from '@mui/material';

import {useMessageDialog} from '@/stores';

import {Button, Dialog} from '@/components';
import {useCallback} from 'react';

function MessageDialog() {
	const open = useMessageDialog((state) => state.open);
	const title = useMessageDialog((state) => state.title);
	const message = useMessageDialog((state) => state.message);
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

		// 모달 닫히는데 0.3초 정도 걸리기 때문에, 0.3초 후에 모달 데이터 초기화 되도록 처리
		setTimeout(() => {
			initMessageDialog();
		}, 350);
	}, [onClose, onCloseFunc, initMessageDialog]);

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			TitleComponent={
				<Typography fontSize={20} fontWeight={700}>
					{title}
				</Typography>
			}
			maxWidth="md">
			<>
				<DialogContent>
					<Typography
						sx={{
							wordBreak: 'break-word',
							minWidth: '300px',
						}}>
						{message}
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button color="black" onClick={handleClose}>
						확인
					</Button>
				</DialogActions>
			</>
		</Dialog>
	);
}

export default MessageDialog;
