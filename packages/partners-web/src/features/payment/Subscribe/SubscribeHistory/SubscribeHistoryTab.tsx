import {useMemo} from 'react';
import {parse} from 'qs';
import {useLocation} from 'react-router-dom';

import {Stack} from '@mui/material';

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
				<SubscribeHistoryDetail idx={Number(idx)} />
			) : (
				<SubscribeHistoryList />
			)}
		</Stack>
	);
}

export default SubscribeHistoryTab;
