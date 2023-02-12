import {Suspense, useMemo} from 'react';
import {parse} from 'qs';
import {useLocation} from 'react-router-dom';

import {Skeleton, Stack} from '@mui/material';

import SubscribeHistoryList from './SubscribeHistoryList';
import SubscribeHistoryDetail from './SubscribeHistoryDetail';

function SubscribeHistoryTab() {
	const {search} = useLocation();

	const idx = useMemo(() => {
		return parse(search, {
			ignoreQueryPrefix: true,
		})?.idx;
	}, [search]);

	return (
		<Stack flexDirection="column">
			{idx ? (
				<Suspense
					fallback={
						<Skeleton
							variant="rectangular"
							width="346px"
							height="426px"
							sx={{
								margin: 'auto',
								marginTop: '40px',
								borderRadius: '8px',
							}}
						/>
					}>
					<SubscribeHistoryDetail idx={idx as string} />
				</Suspense>
			) : (
				<SubscribeHistoryList />
			)}
		</Stack>
	);
}

export default SubscribeHistoryTab;
