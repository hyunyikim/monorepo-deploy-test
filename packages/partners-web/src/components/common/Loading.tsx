import Grid from '@mui/material/Grid';
import {CircularProgress} from '@mui/material';

interface Props {
	loading: boolean;
	showCircularProgress?: boolean;
}

export default function Loading({
	loading = false,
	showCircularProgress = true,
}: Props) {
	return loading ? (
		<Grid
			container
			justifyContent="center"
			alignItems="center"
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				zIndex: 9999,
			}}>
			{showCircularProgress && (
				<Grid item>
					<CircularProgress
						sx={{
							color: 'grey.700',
						}}
					/>
				</Grid>
			)}
		</Grid>
	) : null;
}
