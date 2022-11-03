import {pageSizeSearchFilter, defaultPageSize} from '@/data';

import {Select} from '@/components';

interface Props {
	value: number;
	onChange: ({
		pageMaxNum,
		currentPage,
	}: {
		pageMaxNum: number;
		currentPage: number;
	}) => void;
}

function PageSelect({value, onChange}: Props) {
	return (
		<Select
			height={32}
			options={pageSizeSearchFilter}
			value={value ?? defaultPageSize}
			sx={{
				minWidth: '150px',
			}}
			onChange={(e) =>
				onChange({
					pageMaxNum: e.target.value as number,
					currentPage: 1,
				})
			}
		/>
	);
}

export default PageSelect;
