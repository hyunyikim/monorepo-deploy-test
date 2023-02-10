import {List, ListItem, Theme} from '@mui/material';
import {SxProps} from '@mui/system';
import {useMemo} from 'react';

const defaultData = ['VAT(10%)가 별도 추가됩니다.'];

interface Props {
	useDefaultData?: boolean;
	data?: string[];
	sx?: SxProps<Theme>;
}

function SubscribeNoticeBullet({useDefaultData = true, data, sx = {}}: Props) {
	const dataList = useMemo(() => {
		const filteredDefaultData = useDefaultData ? defaultData : [];
		if (data) {
			return [...filteredDefaultData, ...data];
		}
		return filteredDefaultData;
	}, [useDefaultData, data]);

	return (
		<List
			sx={[
				{
					'& .MuiListItem-root': {
						display: 'list-item',
						listStyleType: 'disc',
						marginLeft: '14px',
						padding: '0 0 0 2px',
						color: 'grey.500',
						fontSize: 11,
						wordBreak: 'keep-all',
						'&::marker': {
							fontSize: 9,
						},
					},
				},
				...(Array.isArray(sx) ? sx : [sx]),
			]}>
			{dataList.map((item, idx) => (
				<ListItem key={idx}>{item}</ListItem>
			))}
		</List>
	);
}

export default SubscribeNoticeBullet;
