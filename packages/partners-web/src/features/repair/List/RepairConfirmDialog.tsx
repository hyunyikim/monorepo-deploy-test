import {Typography} from '@mui/material';
import {makeStyles} from '@mui/styles';

import {Button, Dialog} from '@/components';
import {RepairListResponse} from '@/@types';

const useStyles = makeStyles({
	table: {
		'& th': {
			paddingLeft: 20,
			paddingRight: 20,
			border: '1px solid #3d39351a',
		},
		'& td': {
			padding: 10,
			border: '1px solid #3d39351a',
		},
		fontSize: '14px',
		fontWeight: 600,
	},
	label: {
		height: 48,
		fontWeight: 600,
		textAlign: 'left',
		color: 'primary',
		backgroundColor: '#fbfbfb',
	},
	content: {
		height: 48,
		padding: '7px',
	},
});

interface Props {
	open: boolean;
	onClose: () => void;
	modalData: RepairListResponse;
	onCancelRepair: () => void;
	onAcceptRepair: () => void;
}

function RepairConfirmDialog({
	open,
	onClose,
	modalData,
	onCancelRepair,
	onAcceptRepair,
}: Props) {
	const classes = useStyles();

	return (
		<Dialog
			open={open}
			onClose={onClose}
			showCloseButton={true}
			height={200}
			TitleComponent={
				<Typography fontSize={20} fontWeight={700} mb={'8px'}>
					수선 견적 확인
				</Typography>
			}
			ActionComponent={
				<>
					<Button
						color="grey-100"
						variant="outlined"
						onClick={onCancelRepair}
						sx={{
							marginRight: '8px',
						}}>
						수선취소
					</Button>
					<Button color="black" onClick={onAcceptRepair}>
						견적승인
					</Button>
				</>
			}
			sx={{
				'& .MuiDialogActions-root': {
					justifyContent: 'flex-end',
				},
			}}>
			<>
				<table
					className={classes.table}
					style={{
						minWidth: '500px',
						border: '1px solid #3d39351a',
						borderCollapse: 'collapse',
					}}>
					<tbody>
						<tr>
							<th align="center" className={classes.label}>
								견적금액
							</th>
							<td align="left" className={classes.content}>
								{`${modalData?.inspct_fee.toLocaleString()}원` ??
									'0원'}
							</td>
						</tr>
						<tr>
							<th align="center" className={classes.label}>
								소요기간
							</th>
							<td align="left" className={classes.content}>
								{modalData?.estimated_time}
							</td>
						</tr>
						<tr>
							<th align="center" className={classes.label}>
								견적의견
							</th>
							<td align="left" className={classes.content}>
								<div
									dangerouslySetInnerHTML={{
										__html: modalData?.cstmg_memo.replaceAll(
											'\n',
											'<br />'
										),
									}}
								/>
							</td>
						</tr>
					</tbody>
				</table>
			</>
		</Dialog>
	);
}

export default RepairConfirmDialog;
