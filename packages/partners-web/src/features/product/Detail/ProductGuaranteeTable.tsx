import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {format} from 'date-fns';

import {Box, TableRow, Typography} from '@mui/material';

import {useList} from '@/utils/hooks';
import {
	ListResponseV2,
	ProductGuarantee,
	ProductGuaranteeRequestParam,
} from '@/@types';
import {
	initialSearchFilter,
	DATE_FORMAT,
	productGuaranteeStatus,
	getGuaranteeStatusChip,
	sortSearchFilter,
} from '@/data';
import {formatPhoneNum} from '@/utils';

import {
	TableInfo,
	Table,
	PageSelect,
	Pagination,
	Select,
	HeadTableCell,
	TableCell,
	Tab,
	Button,
} from '@/components';

import {getProductGuaranteeList} from '@/api/product.api';

const {sort, pageMaxNum, currentPage} = initialSearchFilter;
function ProductGuaranteeTable({idx}: {idx: number}) {
	const navigate = useNavigate();
	const [value, setValue] = useState(0);
	const {
		isLoading,
		data,
		totalSize,
		filter,
		paginationProps,
		handleChangeFilter,
	} = useList<
		ListResponseV2<ProductGuarantee[]>,
		ProductGuaranteeRequestParam
	>({
		apiFunc: getProductGuaranteeList,
		apiRestParam: [idx],
		initialFilter: {
			sort,
			pageMaxNum,
			currentPage,
			nftStatus: '',
		},
	});

	return (
		<>
			<Box sx={{width: '100%'}}>
				<Tab
					tabLabel={'개런티'}
					selected={value}
					options={[{label: '개런티', value: 0}]}
					handleChange={(e, value) => setValue(value as number)}
				/>
				<Box>
					<TableInfo totalSize={totalSize} unit="개">
						<Select
							height={32}
							value={filter?.nftStatus ?? ''}
							options={productGuaranteeStatus}
							onChange={(e) =>
								handleChangeFilter({
									nftStatus: e.target.value,
								})
							}
							sx={{
								minWidth: '150px',
							}}
						/>
						<Select
							height={32}
							value={filter.sort ?? initialSearchFilter.sort}
							options={sortSearchFilter}
							onChange={(e) =>
								handleChangeFilter({
									sort: e.target.value,
								})
							}
							sx={{
								minWidth: '150px',
							}}
						/>
						<PageSelect
							value={filter.pageMaxNum}
							onChange={(value: {[key: string]: any}) => {
								handleChangeFilter(value);
							}}
						/>
						<Button
							height={32}
							color="black"
							onClick={() => {
								navigate(
									`/b2b/guarantee/register?productIdx=${idx}`
								);
							}}>
							개런티 발급
						</Button>
					</TableInfo>
					<Table
						isLoading={isLoading}
						totalSize={totalSize}
						headcell={
							<>
								<HeadTableCell width={150}>
									신청일
								</HeadTableCell>
								<HeadTableCell width={150}>
									신청번호
								</HeadTableCell>
								<HeadTableCell width={200}>이름</HeadTableCell>
								<HeadTableCell minWidth={400}>
									연락처
								</HeadTableCell>
								<HeadTableCell width={180}>
									개런티 상태
								</HeadTableCell>
							</>
						}>
						{data &&
							data?.data?.length > 0 &&
							data?.data.map((item, idx) => (
								<TableRow key={`item_${idx}`}>
									<TableCell>
										{item?.registeredAt
											? format(
													new Date(
														item?.registeredAt
													),
													DATE_FORMAT
											  )
											: '-'}
									</TableCell>
									<TableCell>
										<Typography
											variant="body3"
											className="underline"
											onClick={() => {
												if (
													Number(item.nftStatusCode) <
													3
												) {
													navigate(
														`/b2b/guarantee/edit/${item.idx}`
													);
												} else {
													navigate(
														`/b2b/guarantee/${item.idx}`
													);
												}
											}}>
											{item.nftNumber}
										</Typography>
									</TableCell>
									<TableCell>
										{item?.ordererName ? (
											<Typography
												variant="body3"
												className="underline"
												onClick={() => {
													const name =
														item?.ordererName;
													const phone =
														item?.ordererTel;
													if (!name || !phone) return;
													navigate(
														`/b2b/customer/${name}/${phone}`
													);
												}}>
												{item.ordererName}
											</Typography>
										) : (
											'-'
										)}
									</TableCell>
									<TableCell>
										<Typography
											fontSize={14}
											lineHeight={'18px'}>
											{item.ordererTel
												? formatPhoneNum(
														item.ordererTel
												  )
												: '-'}
										</Typography>
									</TableCell>
									<TableCell>
										{getGuaranteeStatusChip(
											item.nftStatusCode,
											item.nftStatus
										)}
									</TableCell>
								</TableRow>
							))}
					</Table>
					<Pagination {...paginationProps} />
				</Box>
			</Box>
		</>
	);
}

export default ProductGuaranteeTable;
