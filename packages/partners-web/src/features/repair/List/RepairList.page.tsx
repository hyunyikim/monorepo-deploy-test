import {useEffect, useMemo} from 'react';
import {format, parse} from 'date-fns';

import {Box, TableRow, Typography} from '@mui/material';

import {useChildModalOpen, useList, useOpen} from '@/utils/hooks';
import {
	ListRequestParam,
	RepairListResponse,
	RepairListRequestSearchType,
	RepairListRequestParam,
} from '@/@types';
import {
	initialSearchFilter,
	getRepairStatusChip,
	repairListSearchFilter,
} from '@/data';
import {
	formatPhoneNum,
	goToParentUrl,
	openParantModal,
	trackingToParent,
} from '@/utils';
import {useMessageDialog} from '@/stores';
import {acceptRepair, cancelRepair, getRepairList} from '@/api/repair.api';
import {useGetPartnershipInfo} from '@/stores';

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
	HeadTableCell,
} from '@/components';
import RepairConfirmDialog from './RepairConfirmDialog';

const menu = 'repair';
const menuKo = '수선';

function RepairList() {
	useEffect(() => {
		trackingToParent('repair_pv', {pv_title: '수선신청목록 진입'});
	}, []);

	const {data: partnershipInfo} = useGetPartnershipInfo();
	const email = useMemo(() => {
		return partnershipInfo?.email || '';
	}, [partnershipInfo]);

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
			data: RepairListResponse[];
			total: number;
		},
		ListRequestParam<RepairListRequestSearchType> & RepairListRequestParam
	>({
		apiFunc: getRepairList,
		initialFilter: {
			...initialSearchFilter,
			inspct_state: '',
		},
	});

	const {open, onOpen, onClose, modalData, onSetModalData} =
		useChildModalOpen({});
	const {
		open: confirmOpen,
		onOpen: onConfirmOpen,
		onClose: onConfirmClose,
		modalData: confirmModalData,
		onSetModalData: onSetConfirmModalData,
	} = useOpen({});

	const onMessageDialogOpen = useMessageDialog((state) => state.onOpen);
	const handleCancelRepair = () => {
		if (!confirmModalData.inspct_idx) return;
		(async () => {
			try {
				const res = await cancelRepair(
					Number(confirmModalData.inspct_idx)
				);
				onMessageDialogOpen(res?.message);
				onConfirmClose();
				handleSearch(filter);
			} catch (e) {
				console.log('e :>> ', e);
			}
		})();
	};

	const handleAcceptRepair = () => {
		if (!confirmModalData.inspct_idx) return;
		(async () => {
			try {
				const res = await acceptRepair(
					Number(confirmModalData.inspct_idx)
				);
				onMessageDialogOpen(res?.message);
				onConfirmClose();
				handleSearch(filter);
			} catch (e) {
				console.log('e :>> ', e);
			}
		})();
	};

	return (
		<>
			<Box>
				<ListTitle title="수선 신청 목록" />
				<SearchFilter
					menu={menu}
					menuKo={menuKo}
					filter={filter}
					filterComponent={repairListSearchFilter}
					onSearch={handleSearch}
					onReset={handleReset}
					onChangeFilter={handleChangeFilter}
				/>
				<TableInfo totalSize={totalSize} unit="건">
					<PageSelect
						value={filter.pageMaxNum}
						onChange={(value: {[key: string]: any}) =>
							handleChangeFilter(value)
						}
					/>
					{email === 'copamilnew' && (
						<Button
							color="primary"
							height={32}
							onClick={() => {
								goToParentUrl('/b2b/repair/register');
							}}>
							신규 등록
						</Button>
					)}
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
							<HeadTableCell minWidth={180}>
								신청현황
							</HeadTableCell>
							<HeadTableCell minWidth={180}>
								수선견적
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
													`/b2b/repair/detail/${item.inspct_idx}`
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
												// openParantModal({
												// 	title: '이미지',
												// 	content: `<img src=${value.imgSrc} alt=${value.imgAlt} style={maxHeight: '70vh'} />`,
												// });
												onSetModalData(value);
												onOpen();
											}}
										/>
										<Typography
											fontSize={14}
											lineHeight={'18px'}
											ml="12px">
											[{item.brand_nm_en ?? '-'}
											]
											<br />
											{item.pro_nm ? item.pro_nm : '-'}
										</Typography>
									</Box>
								</TableCell>
								<TableCell>
									{getRepairStatusChip(item.inspct_state)}
								</TableCell>
								<TableCell>
									{item.inspct_state === '5' ? (
										/* 견적 승인, 코빠밀뉴 계정에만 버튼 노출 */
										email === 'copamilnew' ? (
											<Button
												height={32}
												color="primary"
												variant="outlined"
												onClick={() => {
													onSetConfirmModalData(item);
													onConfirmOpen();
												}}>
												견적 확인
											</Button>
										) : (
											'-'
										)
									) : Number(item.inspct_state) > 5 &&
									  item.inspct_fee > 0 ? (
										/* 견적 금액 */
										<p>
											{item.inspct_fee.toLocaleString()}원
										</p>
									) : item.inspct_result === 'X' ? (
										/* 수선 불가 */
										<p>수선 불가</p>
									) : (
										'-'
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
			<RepairConfirmDialog
				open={confirmOpen}
				onClose={onConfirmClose}
				modalData={confirmModalData}
				onCancelRepair={handleCancelRepair}
				onAcceptRepair={handleAcceptRepair}
			/>
		</>
	);
}

export default RepairList;
