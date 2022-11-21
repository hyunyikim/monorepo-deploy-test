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

import {Dialog} from '@/components';
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
	} = useModalStore((state) => state);

	const closeHandler = () => {
		if (typeof setOpen === 'function') {
			setOpen(false);
		}
	};

	return (
		<Dialog
			open={isOpen}
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
					'& .MuiPaper-root': {
						padding: '24px',
						maxWidth: '700px',
						borderRadius: '16px',
						width: width ? width : 'auto',
					},
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

					<Grid container justifyContent={'center'}>
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
