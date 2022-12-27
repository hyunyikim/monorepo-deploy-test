import {useEffect} from 'react';
import {format, parse} from 'date-fns';

import {Box, TableRow, Typography} from '@mui/material';

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
import {
	formatPhoneNum,
	goToParentUrl,
	openParantModal,
	trackingToParent,
} from '@/utils';

import {
	TitleTypography,
	SearchFilter,
	TableInfo,
	Table,
	PageSelect,
	Pagination,
	ImagePopup,
	ImageModal,
	Select,
	HeadTableCell,
	TableCell,
} from '@/components';
import {getInspectionList} from '@/api/inspection.api';

const menu = 'appraisal';
const menuKo = '감정';

function InspectionList() {
	useEffect(() => {
		trackingToParent(`${menu}_pv`, {pv_title: '감정신청목록 진입'});
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
				<TitleTypography title="감정 신청 목록" />
				<SearchFilter
					menu={menu}
					menuKo={menuKo}
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
						onChange={(e) => {
							const sortLabel =
								sortSearchFilter.find(
									(item) => item.value === e.target.value
								)?.label || '';
							trackingToParent(`${menu}_unit_view_click`, {
								button_title: `정렬_${sortLabel}`,
							});
							handleChangeFilter({
								sort: e.target.value,
							});
						}}
						sx={{
							minWidth: '150px',
						}}
					/>
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
				</TableInfo>
				<Table
					isLoading={isLoading}
					totalSize={totalSize}
					headcell={
						<>
							<HeadTableCell minWidth={180}>신청일</HeadTableCell>
							<HeadTableCell minWidth={180}>
								신청번호
							</HeadTableCell>
							<HeadTableCell minWidth={180}>이름</HeadTableCell>
							<HeadTableCell minWidth={180}>연락처</HeadTableCell>
							<HeadTableCell minWidth={480}>
								상품정보
							</HeadTableCell>
							<HeadTableCell minWidth={100}>
								감정 결과
							</HeadTableCell>
							<HeadTableCell minWidth={180}>
								신청 현황
							</HeadTableCell>
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
											fontSize={14}
											lineHeight={'18px'}
											ml="12px">
											{item?.pro_nm ?? '-'}
										</Typography>
									</Box>
								</TableCell>
								<TableCell>
									{item?.inspct_result_text || '-'}
								</TableCell>
								<TableCell>
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
