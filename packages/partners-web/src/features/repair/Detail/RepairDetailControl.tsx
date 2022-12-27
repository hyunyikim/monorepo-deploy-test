import {useGlobalLoading, useMessageDialog} from '@/stores';

import {Stack} from '@mui/material';

import {Button} from '@/components';
import {cancelRepair, completeRepair} from '@/api/repair.api';
import {goToParentUrl} from '@/utils';

function RepairDetailControl({idx}: {idx: number}) {
	const setIsLoading = useGlobalLoading((state) => state.setIsLoading);
	const onOpenMessageDialog = useMessageDialog((state) => state.onOpen);

	const onRepairCancel = async () => {
		onOpenMessageDialog({
			title: '수선취소 처리하시겠습니까?',
			showBottomCloseButton: true,
			closeButtonValue: '취소',
			buttons: (
				<Button
					color="black"
					onClick={() => {
						(async () => {
							setIsLoading(true);
							try {
								await cancelRepair(idx);
								onOpenMessageDialog({
									title: '수선신청이 취소됐습니다.',
									showBottomCloseButton: true,
									onCloseFunc: () => {
										goToParentUrl('/b2b/repair');
									},
								});
							} catch (e) {
								onOpenMessageDialog({
									title: '네트워크 에러',
									message: e?.response?.data?.message || '',
									showBottomCloseButton: true,
								});
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
			title: '수선완료 처리하시겠습니까?',
			showBottomCloseButton: true,
			closeButtonValue: '취소',
			buttons: (
				<Button
					color="black"
					onClick={() => {
						(async () => {
							setIsLoading(true);
							try {
								await completeRepair(idx);
								onOpenMessageDialog({
									title: '수선완료 처리됐습니다.',
									showBottomCloseButton: true,
									onCloseFunc: () => {
										goToParentUrl('/b2b/repair');
									},
								});
							} catch (e) {
								onOpenMessageDialog({
									title: '네트워크 에러',
									message: e?.response?.data?.message || '',
									showBottomCloseButton: true,
								});
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

	return (
		<>
			<Stack flexDirection="row" justifyContent="flex-end" gap="12px">
				<Button
					variant="outlined"
					height={32}
					color="grey-100"
					onClick={onRepairCancel}>
					신청취소
				</Button>
				<Button
					variant="contained"
					height={32}
					color="primary"
					onClick={onRepairComplete}>
					수선완료
				</Button>
			</Stack>
		</>
	);
}

export default RepairDetailControl;
