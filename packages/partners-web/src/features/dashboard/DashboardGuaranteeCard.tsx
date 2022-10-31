import {Box, Grid, Card} from '@mui/material';

interface Props {
	title: string;
	value: number;
	handleClick: () => void;
	style: string;
	icon: React.ReactElement;
}

function DashboardGuaranteeCard({
	title,
	value,
	handleClick,
	style,
	icon,
}: Props) {
	return (
		<Grid item xs={12} md={3}>
			<Card
				sx={{
					cursor: 'pointer',
					':hover': {
						boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)',
					},
				}}
				onClick={handleClick}>
				<Box
					sx={{
						p: 3,
					}}
					className={style}>
					<Grid
						container
						wrap="nowrap"
						direction="row"
						justifyContent="space-between">
						<Grid item container direction="column">
							<dl className="data-dl">
								<dt className="title">{title}</dt>
								<dt className="desc">지난 2주일 기준</dt>
								<dd className="value">
									<strong>{value.toLocaleString()}</strong>건
								</dd>
							</dl>
						</Grid>
						<Grid item>{icon}</Grid>
					</Grid>
				</Box>
			</Card>
		</Grid>
	);
}

export default DashboardGuaranteeCard;
