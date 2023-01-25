import {
	Dialog as MuiDialog,
	DialogProps,
	DialogTitle,
	DialogContent,
	DialogActions,
} from '@mui/material';

import {IcClose} from '@/assets/icon';
import {useMemo} from 'react';

interface Props extends Omit<DialogProps, 'open' | 'onClose'> {
	open: boolean;
	showCloseButton?: boolean;
	showBottomLine?: boolean;
	width?: number | string;
	height?: number | string;
	padding?: number | string;
	TitleComponent?: React.ReactElement;
	ActionComponent?: React.ReactElement;
	children: React.ReactElement;
	titleAlign?: string;
	onClose?: (
		event: object,
		reason: 'backdropClick' | 'escapeKeyDown'
	) => void;
	useBackgroundClickClose?: boolean;
}

const DIALOG_PADDING = '32px';

function Dialog({
	open,
	showCloseButton = false,
	showBottomLine = false,
	width,
	height,
	padding = DIALOG_PADDING,
	TitleComponent,
	ActionComponent,
	sx = {},
	children,
	onClose,
	titleAlign,
	useBackgroundClickClose,
	...props
}: Props) {
	const dialogPadding = useMemo(() => {
		return typeof padding === 'number' ? `${padding}px` : padding;
	}, [padding]);

	return (
		<MuiDialog
			open={open}
			maxWidth="md"
			onClose={useBackgroundClickClose && onClose}
			sx={[
				{
					'& .MuiPaper-root': {
						borderRadius: '16px',
						isolation: 'isolate',
						...(width && {
							width:
								typeof width === 'number'
									? `${width}px`
									: width,
						}),
					},
					'& .MuiDialogTitle-root': {
						marginBottom: '8px',
					},
				},
				showBottomLine && {
					'& .MuiDialogContent-root': {
						marginBottom: '65px',
					},
					'& .MuiDialogActions-root': {
						backgroundColor: 'grey.10',
						paddingY: '16px',
						paddingX: '24px',
						borderTop: (theme) =>
							`1px solid ${theme.palette.grey[100]}`,
					},
				},
				...(Array.isArray(sx) ? sx : [sx]),
			]}
			{...props}>
			{(TitleComponent || showCloseButton) && (
				<DialogTitle
					sx={{
						display: 'flex',
						justifyContent:
							titleAlign === 'center'
								? 'center'
								: TitleComponent && showCloseButton
								? 'space-between'
								: !showCloseButton
								? 'flex-start'
								: 'flex-end',
						alignContent: 'center',
						position: 'absolute',
						width: '100%',
						zIndex: 1,
						paddingTop: '32px',
						paddingBottom: '16px',
						paddingX: dialogPadding,
						background: '#FFF',
					}}>
					{TitleComponent && TitleComponent}
					{titleAlign !== 'center' && showCloseButton && (
						<IcClose cursor="pointer" onClick={onClose} />
					)}
				</DialogTitle>
			)}
			<DialogContent
				sx={{
					marginTop: '74px',
					...(ActionComponent && {
						marginBottom: '70px',
					}),
					paddingX: dialogPadding,
					paddingTop: `calc(${dialogPadding} / 2) !important`,
					paddingBottom: `calc(${dialogPadding} / 2)`,
					...(height && {
						height:
							typeof height === 'number' ? `${height}px` : height,
					}),
				}}>
				{children}
			</DialogContent>
			{ActionComponent && (
				<DialogActions
					sx={{
						width: '100%',
						justifyContent: 'center',
						columnGap: '12px',
						paddingX: dialogPadding,
						paddingTop: `calc(${dialogPadding} / 2)`,
						paddingBottom: dialogPadding,
						position: 'absolute',
						bottom: '0px',
						'& > *:not(:first-of-type)': {
							marginLeft: '0',
						},
						backgroundColor: '#FFF',
					}}>
					{ActionComponent}
				</DialogActions>
			)}
		</MuiDialog>
	);
}

export default Dialog;
