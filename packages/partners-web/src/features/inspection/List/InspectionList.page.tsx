import {format, parse} from 'date-fns';

import {Box, TableRow, TableCell, Typography} from '@mui/material';

import {useList, useOpen} from '@/utils/hooks';
import {
	ListRequestParam,
	InspectionListResponse,
	InspectionListRequestSearchType,
	InspectionListRequestParam,
} from '@/@types';
import {
	initialSearchFilter,
	sortSearchFilter,
	getInspectionStatusChip,
	inspectionListSearchFilter,
} from '@/data';
import {formatPhoneNum, goToParentUrl, openParantModal} from '@/utils';

import {
	ListTitle,
	SearchFilter,
	TableInfo,
	Table,
	PageSelect,
	Pagination,
	ImagePopup,
	ImageModal,
	Select,
} from '@/components';
import {getInspectionList} from '@/api/inspection.api';

function InspectionList() {
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
		{
			data: InspectionListResponse[];
			total: number;
		},
		ListRequestParam<InspectionListRequestSearchType> &
			InspectionListRequestParam
	>({
		apiFunc: getInspectionList,
		initialFilter: {
			...initialSearchFilter,
			inspct_state: '',
		},
	});

	const {open, onOpen, onClose, modalData, onSetModalData} = useOpen({});
	return (
		<>
			<Box>
				<ListTitle title="감정 신청 목록" />
				<SearchFilter
					filter={filter}
					filterComponent={inspectionListSearchFilter}
					onSearch={handleSearch}
					onReset={handleReset}
					onChangeFilter={handleChangeFilter}
				/>
				<TableInfo totalSize={totalSize} unit="건">
					<Select
						height={32}
						value={filter?.sort ?? 'latest'}
						options={sortSearchFilter}
						onChange={(e) =>
							handleChangeFilter({
								sort: e.target.value,
							})
						}
					/>
					<PageSelect
						value={filter.pageMaxNum}
						onChange={(value: {[key: string]: any}) =>
							handleChangeFilter(value)
						}
					/>
				</TableInfo>
				<Table
					isLoading={isLoading}
					totalSize={totalSize}
					headcell={
						<>
							<TableCell>신청일</TableCell>
							<TableCell>신청번호</TableCell>
							<TableCell>이름</TableCell>
							<TableCell>연락처</TableCell>
							<TableCell colSpan={2}>상품정보</TableCell>
							<TableCell>감정 결과</TableCell>
							<TableCell>신청 현황</TableCell>
						</>
					}>
					{data &&
						data?.data?.length > 0 &&
						data?.data.map((item, idx) => (
							<TableRow key={`item_${idx}`}>
								<TableCell>
									{item?.request_dt
										? format(
												parse(
													item.request_dt,
													'yy-MM-dd HH:mm',
													new Date()
												),
												'yyyy-MM-dd'
										  )
										: '-'}
								</TableCell>
								<TableCell>
									{item.inspct_num ? (
										<Typography
											fontSize={14}
											className="underline"
											onClick={() => {
												goToParentUrl(
													`/b2b/inspection/detail/${item.inspct_idx}`
												);
											}}>
											{item.inspct_num}
										</Typography>
									) : (
										'-'
									)}
								</TableCell>
								<TableCell>{item?.return_nm ?? '-'}</TableCell>
								<TableCell>
									{item.return_phone
										? formatPhoneNum(item.return_phone)
										: '-'}
								</TableCell>
								<TableCell width={60}>
									<ImagePopup
										image={item?.product_img}
										alt={item.pro_nm}
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
								</TableCell>
								<TableCell>
									<p>
										[{item.brand_nm_en ?? '-'}
										]
										<br />
										{item.pro_nm ? item.pro_nm : '-'}
									</p>
								</TableCell>
								<TableCell>
									{item?.inspct_result_text || '-'}
								</TableCell>
								<TableCell align="center">
									{getInspectionStatusChip(item.inspct_state)}
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
	);
}

export default InspectionList;
