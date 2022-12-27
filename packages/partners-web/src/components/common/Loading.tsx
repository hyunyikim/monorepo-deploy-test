import Grid from '@mui/material/Grid';
import {CircularProgress} from '@mui/material';

import {useGlobalLoading} from '@/stores';

export default function Loading() {
	const isLoading = useGlobalLoading((state) => state.isLoading);
	const showCircularProgress = useGlobalLoading(
		(state) => state.showCircularProgress
	);

	return isLoading ? (
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
