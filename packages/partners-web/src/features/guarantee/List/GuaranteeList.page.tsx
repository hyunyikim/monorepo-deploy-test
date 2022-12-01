import {useEffect} from 'react';
import {Box, TableRow, Typography} from '@mui/material';

import {useList} from '@/utils/hooks';
import {getGuaranteeList} from '@/api/guarantee.api';
import {
	GuaranteeListRequestParam,
	GuaranteeListResponse,
	GuaranteeListRequestSearchType,
	ListRequestParam,
	ListResponse,
} from '@/@types';
import {
	initialSearchFilter,
	guaranteeListSearchFilter,
	getGuaranteeStatusChip,
} from '@/data';
import {
	formatPhoneNum,
	goToParentUrl,
	trackingToParent,
	downloadGuaranteeExcel,
	goToGuaranteeExcelUploadPage,
} from '@/utils';

import {
	ListTitle,
	SearchFilter,
	TableInfo,
	Table,
	PageSelect,
	Pagination,
	Button,
	TableCell,
} from '@/components';

const menu = 'guarantee';
const menuKo = '개런티';

function GuaranteeList() {
	useEffect(() => {
		trackingToParent('guarantee_pv', {pv_title: '개런티목록 노출'});
	}, []);
	const {
		isLoading,
		data,
		totalSize,
		filter,
		paginationProps,
		handleChangeFilter,
		handleSearch,
		handleReset,
	} = useList<
		ListResponse<GuaranteeListResponse[]>,
		ListRequestParam<GuaranteeListRequestSearchType> &
			GuaranteeListRequestParam
	>({
		apiFunc: getGuaranteeList,
		initialFilter: {
			...initialSearchFilter,
			nft_req_state: '',
		},
	});
	return (
		<>
			<Box>
				<ListTitle title="개런티 목록" />
				<SearchFilter
					menu={menu}
					menuKo={menuKo}
					filter={filter}
					filterComponent={guaranteeListSearchFilter}
					onSearch={handleSearch}
					onReset={handleReset}
					onChangeFilter={handleChangeFilter}
				/>
				<TableInfo totalSize={totalSize} unit="건">
					<PageSelect
						value={filter.pageMaxNum}
						onChange={(value: {
							[key: string]: any;
							pageMaxNum: number;
						}) => {
							trackingToParent(`${menu}_unit_view_click`, {
								button_title: `노출수_${value.pageMaxNum}개씩`,
							});
							handleChangeFilter(value);
						}}
					/>
					<Button
						color="grey-100"
						variant="outlined"
						height={32}
						onClick={goToGuaranteeExcelUploadPage}>
						대량등록
					</Button>
					<Button
						color="primary"
						variant="outlined"
						height={32}
						onClick={() => {
							goToParentUrl('/b2b/interwork');
						}}
						sx={{
							marginRight: '8px',
						}}>
						쇼핑몰 주문 연동하기
					</Button>
					<Button
						color="primary"
						height={32}
						onClick={() => {
							trackingToParent(
								'guarantee_list_firstexcelregistration_click',
								{button_title: `신규등록 클릭`}
							);
							goToParentUrl('/b2b/guarantee/register');
						}}>
						신규등록
					</Button>
				</TableInfo>
				<Table
					isLoading={isLoading}
					totalSize={totalSize}
					headcell={
						<>
							<TableCell>신청일</TableCell>
							<TableCell>신청번호</TableCell>
							<TableCell>판매처</TableCell>
							<TableCell>이름</TableCell>
							<TableCell>연락처</TableCell>
							<TableCell>상품정보</TableCell>
							<TableCell>개런티 상태</TableCell>
						</>
					}>
					{data &&
						data?.data?.length > 0 &&
						data?.data.map((item, idx) => (
							<TableRow key={`item_${idx}`}>
								<TableCell>
									{item.reg_dt
										? item?.reg_dt.substr(0, 10)
										: '-'}
								</TableCell>
								<TableCell>
									{item.nft_req_num ? (
										<Typography
											fontSize={14}
											className="underline"
											onClick={() => {
												trackingToParent(
													'guarantee_list_numberclick_click',
													{
														button_title: `신청번호 클릭`,
													}
												);
												if (
													Number(item.nft_req_state) <
													3
												) {
													goToParentUrl(
														`/b2b/guarantee/edit/${item.nft_req_idx}`
													);
												} else {
													goToParentUrl(
														`/b2b/guarantee/detail/${item.nft_req_idx}`
													);
												}
											}}>
											{item.nft_req_num}
										</Typography>
									) : (
										'-'
									)}
								</TableCell>
								<TableCell>
									{item.platform_text
										? item.platform_text
										: '-'}
								</TableCell>
								<TableCell>
									<Typography
										fontSize={14}
										className="underline"
										onClick={() => {
											const name = item?.orderer_nm;
											const phone = item?.orderer_tel;
											if (!name || !phone) return;
											goToParentUrl(
												`/b2b/customer/${name}/${phone}`
											);
										}}>
										{item.orderer_nm
											? item.orderer_nm
											: '-'}
									</Typography>
								</TableCell>
								<TableCell>
									{item.orderer_tel
										? formatPhoneNum(item.orderer_tel)
										: '-'}
								</TableCell>
								<TableCell width="500px">
									<Typography
										fontSize={14}
										lineHeight={'18px'}>
										[{item.brand_nm_en ?? '-'}
										]
										<br />
										{item.pro_nm ? item.pro_nm : '-'}
									</Typography>
								</TableCell>
								<TableCell>
									{getGuaranteeStatusChip(
										item.nft_req_state,
										item.nft_req_state_text
									)}
								</TableCell>
							</TableRow>
						))}
				</Table>
				<Pagination {...paginationProps} />
			</Box>
		</>
	);
}

export default GuaranteeList;
