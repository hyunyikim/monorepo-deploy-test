import {Dialog as MuiDialog, DialogProps, DialogTitle} from '@mui/material';

import {IcClose} from '@/assets/icon';

interface Props extends Omit<DialogProps, 'open' | 'onclose'> {
	open: boolean;
	showCloseButton?: boolean;
	TitleComponent?: React.ReactElement;
	children: React.ReactElement;
	onClose: () => void;
}

function Dialog({
	open,
	showCloseButton = false,
	TitleComponent,
	sx = {},
	children,
	onClose,
	...props
}: Props) {
	return (
		<MuiDialog
			open={open}
			maxWidth="md"
			onBackdropClick={onClose}
			sx={{
				'& .MuiPaper-root': {
					padding: '32px',
					borderRadius: '16px',
				},
				'& .MuiDialogTitle-root': {
					marginBottom: '8px',
				},
				'& .MuiDialogContent-root': {
					padding: 0,
					marginBottom: '40px',
				},
				...sx,
			}}
			{...props}>
			{(TitleComponent || showCloseButton) && (
				<DialogTitle
					sx={{
						display: 'flex',
						justifyContent:
							TitleComponent && showCloseButton
								? 'space-between'
								: !showCloseButton
								? 'flex-start'
								: 'flex-end',
						alignContent: 'center',
						padding: 0,
					}}>
					{TitleComponent && TitleComponent}
					{showCloseButton && (
						<IcClose cursor="pointer" onClick={onClose} />
					)}
				</DialogTitle>
			)}
			{children}
		</MuiDialog>
	);
}

export default Dialog;
