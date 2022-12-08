import {TableCellProps, Box, Typography, IconButton} from '@mui/material';

import {HeadTableCell} from '@/components';
import {IcSort} from '@/assets/icon';

import {OrderDirectionType} from '@/@types';

interface Props extends Omit<TableCellProps, 'name'> {
	label: string;
	name: string;
	orderBy: string;
	orderDirection: OrderDirectionType;
	defaultOrderDirection?: OrderDirectionType;
	onSortClick: (value: {[key: string]: any}) => void;
	minWidth: number;
}

function TableCellWithSort({
	label,
	name,
	orderBy,
	orderDirection,
	defaultOrderDirection = 'ASC',
	onSortClick,
	minWidth,
	...props
}: Props) {
	return (
		<HeadTableCell minWidth={minWidth} {...props}>
			<Box className="flex justify-between w-full">
				<Typography fontSize={14} noWrap={false}>
					{label}
				</Typography>
				<IconButton
					size="small"
					onClick={() => {
						let newOrderDirection = defaultOrderDirection;
						if (name === orderBy) {
							newOrderDirection =
								orderDirection === 'ASC' ? 'DESC' : 'ASC';
						}
						onSortClick({
							orderBy: name,
							orderDirection: newOrderDirection,
						});
					}}>
					<IcSort className="cursor-pointer" />
				</IconButton>
			</Box>
		</HeadTableCell>
	);
}

export default TableCellWithSort;
