import {Box, TableRow, Typography} from '@mui/material';

import {useList, useOpen} from '@/utils/hooks';
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
	openParantModal,
} from '@/utils';

import {
	ListTitle,
	SearchFilter,
	TableInfo,
	Table,
	PageSelect,
	Pagination,
	ImagePopup,
	ImageModal,
	Button,
	TableCell,
} from '@/components';

function GuaranteeList() {
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
	const {open, onOpen, onClose, modalData, onSetModalData} = useOpen({});
	return (
		<>
			<Box>
				<ListTitle title="개런티 목록" />
				<SearchFilter
					filter={filter}
					filterComponent={guaranteeListSearchFilter}
					onSearch={handleSearch}
					onReset={handleReset}
					onChangeFilter={handleChangeFilter}
				/>
				<TableInfo totalSize={totalSize} unit="건">
					<Button
						color="grey-100"
						variant="outlined"
						height={32}
						onClick={downloadGuaranteeExcel}>
						엑셀양식 다운로드
					</Button>
					<Button
						color="grey-100"
						variant="outlined"
						height={32}
						onClick={goToGuaranteeExcelUploadPage}>
						엑셀 등록
					</Button>
					<PageSelect
						value={filter.pageMaxNum}
						onChange={(value: {[key: string]: any}) =>
							handleChangeFilter(value)
						}
					/>
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
														`/b2b/guarantee/modify/${item.nft_req_idx}`
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
									{item.orderer_nm ? item.orderer_nm : '-'}
								</TableCell>
								<TableCell>
									{item.orderer_tel
										? formatPhoneNum(item.orderer_tel)
										: '-'}
								</TableCell>
								<TableCell>
									<Box>
										<ImagePopup
											image={item?.product_img}
											alt={item?.pro_nm}
											onClick={(value) => {
												// 부모창 이미지 모달 오픈
												openParantModal({
													title: '이미지',
													content: `<img src=${value.imgSrc} alt=${value.imgAlt} style={maxHeight: '70vh'} />`,
												});
												// onSetModalData(value);
												// onOpen();
											}}
										/>
										<Typography
											fontSize={16}
											lineHeight="16px"
											ml="12px">
											[{item.brand_nm_en ?? '-'}
											]
											<br />
											{item.pro_nm ? item.pro_nm : '-'}
										</Typography>
									</Box>
								</TableCell>
								<TableCell align="center">
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
			<ImageModal
				open={open}
				onClose={onClose}
				imgSrc={modalData?.imgSrc}
				imgAlt={modalData?.imgAlt}
			/>
		</>
		// TODO: error -> modal
	);
}

export default GuaranteeList;
