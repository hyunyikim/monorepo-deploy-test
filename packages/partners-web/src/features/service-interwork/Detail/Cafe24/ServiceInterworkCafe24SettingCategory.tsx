import {useOpen} from '@/utils/hooks';

import {
	Button,
	Dialog,
	Table,
	HeadTableCell,
	TableCell,
	Checkbox,
} from '@/components';
import {Box, TableRow, Typography, Stack} from '@mui/material';
import {IssueCategory} from '@/@types';
import {useCafe24CategoryList} from '@/stores';
import {useEffect, useMemo, useState} from 'react';

import {IcCloseGrey} from '@/assets/icon';
import {sendAmplitudeLog} from '@/utils';

interface Props {
	mallId: string;
	selectedCategoryList: IssueCategory[];
	onAddCategory: (value: IssueCategory[]) => void;
	onRemoveCategory: (categoryIdx: number) => void;
}

function ServiceInterworkCafe24SettingCategory({
	mallId,
	selectedCategoryList,
	onAddCategory,
	onRemoveCategory,
}: Props) {
	const {
		open: categoryModalOpen,
		onOpen: onCategoryModalOpen,
		onClose: onCategoryModalClose,
	} = useOpen({});
	return (
		<>
			<Stack
				flexDirection="row"
				alignItems="center"
				sx={{
					marginTop: {
						xs: 0,
						sm: selectedCategoryList?.length > 0 ? '16px' : '20px',
					},
					marginBottom: {
						xs: 0,
						sm: selectedCategoryList?.length > 0 ? '20px' : '8px',
					},
				}}>
				<Button
					color="primary-50"
					height={32}
					onClick={onCategoryModalOpen}
					data-tracking={`cafe24_linkservicedetail_categorybutton_click,{'button_title': '카테고리 선택 버튼 클릭'}`}>
					카테고리 선택
				</Button>
				<Box color="grey.500" fontSize={14} ml="20px">
					선택한 카테고리
					<Typography
						variant="body3"
						color="grey.900"
						display="inline-block">
						&nbsp; {selectedCategoryList?.length}건
					</Typography>
				</Box>
			</Stack>
			<Stack
				gap="8px"
				{...(selectedCategoryList?.length > 0 && {
					mb: '20px',
				})}>
				{selectedCategoryList.map((item) => (
					<CategoryItem
						key={item.idx}
						data={item}
						onRemoveCategory={onRemoveCategory}
					/>
				))}
			</Stack>
			<SettingCategoryModal
				open={categoryModalOpen}
				mallId={mallId}
				selectedCategoryList={selectedCategoryList}
				onAddCategory={onAddCategory}
				onClose={onCategoryModalClose}
			/>
		</>
	);
}

const CategoryItem = ({
	data,
	onRemoveCategory,
}: {
	data: IssueCategory;
	onRemoveCategory: (categoryIdx: number) => void;
}) => {
	return (
		<Typography
			variant="button3"
			fontWeight="bold"
			display="inline-block"
			className="flex-center"
			sx={(theme) => ({
				width: 'fit-content',
				height: '36px',
				backgroundColor: theme.palette.grey[50],
				padding: '9px 10px',
				borderRadius: '4px',
			})}>
			{data.fullName
				.map((name) => name.replace(/^\(.*\)/, ''))
				.join(' > ')}
			<IcCloseGrey
				className="cursor-pointer"
				style={{
					marginLeft: '10px',
				}}
				onClick={() => onRemoveCategory(data.idx)}
			/>
		</Typography>
	);
};

const SettingCategoryModal = ({
	open,
	mallId,
	selectedCategoryList,
	onAddCategory,
	onClose,
}: {
	open: boolean;
	mallId: string;
	selectedCategoryList: IssueCategory[];
	onAddCategory: (value: IssueCategory[]) => void;
	onClose: () => void;
}) => {
	const [selected, setSelected] = useState<number[]>([]);
	const {data: categoryList} = useCafe24CategoryList(mallId);

	useEffect(() => {
		setSelected(selectedCategoryList.map((item) => item.idx));
	}, [selectedCategoryList]);

	// 모달 열고 닫을 때 초기화
	useEffect(() => {
		if (!open) {
			setSelected(selectedCategoryList.map((item) => item.idx));
			return;
		}
		sendAmplitudeLog('cafe24_linkservicedetail_categorypopupview', {
			pv_title: '카테고리 선택 팝업 노출',
		});
	}, [open]);

	const onAddCategoryList = () => {
		onAddCategory(
			categoryList
				?.filter((item) => selected.includes(item.category_no))
				.map(
					(item) =>
						({
							idx: item.category_no,
							depth: item.category_depth,
							name: item.category_name,
							fullName: Object.values(
								item.full_category_name
							).filter((c) => !!c),
							fullNo: Object.values(item.full_category_no).filter(
								(c) => !!c
							),
						} as IssueCategory)
				) ?? []
		);
		onClose();
	};

	const checkAll = useMemo(() => {
		const totalLength = categoryList?.length ?? 0;
		if (totalLength === selected.length) {
			return true;
		}
		return false;
	}, [categoryList, selected]);

	return (
		<Dialog
			open={open}
			width={900}
			TitleComponent={
				<Typography fontSize={21} fontWeight="bold">
					카테고리 선택
				</Typography>
			}
			ActionComponent={
				<>
					<Button
						height={32}
						variant="outlined"
						color="grey-100"
						onClick={onClose}>
						닫기
					</Button>
					<Button
						height={32}
						onClick={onAddCategoryList}
						data-tracking={`cafe24_linkservicedetail_categorypopup_select_click,{'button_title': '카테고리선택 팝업 선택'}`}>
						추가
					</Button>
				</>
			}
			showBottomLine={true}>
			<>
				<Typography variant="body3" fontWeight="bold" mb={2}>
					카테고리 목록
				</Typography>
				<Box mb="24px">
					<Typography variant="caption1">
						총 &nbsp;
						<Typography
							display="inline-block"
							variant="caption1"
							color="primary.main">
							{selected.length}
						</Typography>
						개
					</Typography>
				</Box>
				<Table
					isLoading={false}
					totalSize={categoryList?.length ?? 0}
					headcell={
						<>
							<HeadTableCell width={52}>
								<Checkbox
									onChange={(e, checked) => {
										if (
											checked &&
											categoryList &&
											categoryList?.length > 0
										) {
											setSelected(
												categoryList.map(
													(item) => item.category_no
												)
											);
											return;
										}
										setSelected([]);
									}}
									checked={checkAll}
								/>
							</HeadTableCell>
							<HeadTableCell>카테고리</HeadTableCell>
						</>
					}>
					{categoryList
						?.sort((c1, c2) => {
							return c1.full_category_name[1]?.localeCompare(
								c2.full_category_name[1]
							);
						})
						.map((item) => (
							<TableRow key={item.category_no}>
								<TableCell>
									<Checkbox
										name={item.category_no.toString()}
										checked={selected.includes(
											item.category_no
										)}
										onChange={(e, checked) => {
											if (checked) {
												setSelected((prev) => [
													...prev,
													item.category_no,
												]);
												return;
											}
											setSelected((prev) =>
												prev.filter(
													(selectedItem) =>
														selectedItem !==
														item.category_no
												)
											);
										}}
									/>
								</TableCell>
								<TableCell>
									{Object.values(item.full_category_name)
										.filter((name) => !!name)
										.join(' > ')}
								</TableCell>
							</TableRow>
						))}
				</Table>
			</>
		</Dialog>
	);
};

export default ServiceInterworkCafe24SettingCategory;
