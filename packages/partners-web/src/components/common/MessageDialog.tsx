import {Typography, DialogContent, DialogActions} from '@mui/material';

import {useMessageDialog} from '@/stores';

import {Button, Dialog} from '@/components';

function MessageDialog() {
	const open = useMessageDialog((state) => state.open);
	const message = useMessageDialog((state) => state.message);
	const onClose = useMessageDialog((state) => state.onClose);

	return (
		<Dialog
			open={open}
			onClose={onClose}
			TitleComponent={
				<Typography fontSize={20} fontWeight={700}>
					알림
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
					<Button color="black" onClick={onClose}>
						확인
					</Button>
				</DialogActions>
			</>
		</Dialog>
	);
}

export default MessageDialog;
