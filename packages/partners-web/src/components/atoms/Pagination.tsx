import {
	Pagination as MuiPagination,
	PaginationProps,
	SxProps,
} from '@mui/material';

interface Props extends PaginationProps {
	sx?: SxProps;
}

/**
 *
 * @param count total number of page
 * @param page the current page
 */
function Pagination({
	sx = {marginTop: '24px'},
	count,
	page,
	onChange,
	...props
}: Props) {
	return (
		<MuiPagination
			showFirstButton
			showLastButton
			variant="outlined"
			shape="rounded"
			count={count}
			page={page}
			onChange={onChange}
			sx={{
				display: 'flex',
				justifyContent: 'center',
				'& .MuiPaginationItem-root': {
					fontSize: '13px',
					lineHeight: 1.45,
					borderColor: 'grey.100',
					borderWidth: '0.8px',
					borderRadius: '6.4px',
					height: '24px',
					width: '24px',
					minWidth: '24px',
					padding: '0',
					'&.Mui-selected': {
						background: 'grey.100',
					},
					'&.MuiPaginationItem-previousNext': {
						border: 'none',
					},
				},
				...sx,
			}}
			{...props}
		/>
	);
}

export default Pagination;
