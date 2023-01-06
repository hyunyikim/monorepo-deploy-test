import {useGlobalLoading, useMessageDialog} from '@/stores';

import {Button} from '@/components';
import {bulkCancelRepair, bulkCompleteRepair} from '@/api/repair.api';
import {RepairStatus} from '@/@types';

interface Props {
	status: RepairStatus | '';
	checkedItems: number[];
	onHandleChangeFilter: (newParam: {[key: string]: any}) => void;
	isCheckedItemsExisted: (message: string) => boolean;
}

function RepairBulkControl({
	status,
	checkedItems,
	onHandleChangeFilter,
	isCheckedItemsExisted,
}: Props) {
	const setIsLoading = useGlobalLoading((state) => state.setIsLoading);
	const onOpenMessageDialog = useMessageDialog((state) => state.onOpen);
	const onOpenError = useMessageDialog((state) => state.onOpenError);

	const onRepairCancel = async () => {
		onOpenMessageDialog({
			title: '선택하신 신청건을 취소하시겠습니까?',
			showBottomCloseButton: true,
			closeButtonValue: '취소',
			buttons: (
				<Button
					color="black"
					onClick={() => {
						(async () => {
							setIsLoading(true);
							try {
								await bulkCancelRepair(checkedItems);
								onOpenMessageDialog({
									title: '수선신청이 취소됐습니다.',
									showBottomCloseButton: true,
									onCloseFunc: () => {
										onHandleChangeFilter({
											status: 'cancel',
										});
									},
								});
							} catch (e) {
								onOpenError();
							} finally {
								setIsLoading(false);
							}
						})();
					}}>
					확인
				</Button>
			),
		});
	};

	const onRepairComplete = () => {
		onOpenMessageDialog({
			title: '선택하신 신청건을 수선완료 처리하시겠습니까?',
			showBottomCloseButton: true,
			closeButtonValue: '취소',
			buttons: (
				<Button
					color="black"
					onClick={() => {
						(async () => {
							setIsLoading(true);
							try {
								await bulkCompleteRepair(checkedItems);
								onOpenMessageDialog({
									title: '수선완료 처리됐습니다.',
									showBottomCloseButton: true,
									onCloseFunc: () => {
										onHandleChangeFilter({
											status: 'complete',
										});
									},
								});
							} catch (e) {
								onOpenError();
							} finally {
								setIsLoading(false);
							}
						})();
					}}>
					확인
				</Button>
			),
		});
	};

	return status === 'request' ? (
		<>
			<Button
				variant="outlined"
				height={32}
				color="grey-100"
				onClick={() => {
					if (
						!isCheckedItemsExisted(
							'취소할 수선 신청을 선택해주세요.'
						)
					) {
						return;
					}
					onRepairCancel();
				}}>
				선택 취소
			</Button>
			<Button
				variant="contained"
				height={32}
				color="black"
				onClick={() => {
					if (
						!isCheckedItemsExisted(
							'완료할 수선 신청을 선택해주세요.'
						)
					) {
						return;
					}
					onRepairComplete();
				}}>
				수선완료
			</Button>
		</>
	) : (
		<></>
	);
}

export default RepairBulkControl;
