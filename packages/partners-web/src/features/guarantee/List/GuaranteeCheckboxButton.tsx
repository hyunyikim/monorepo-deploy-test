import React, {useCallback, useMemo, useState} from 'react';

import {Button, Loading} from '@/components';

import {useMessageDialog} from '@/stores';
import {useChildModalOpen} from '@/utils/hooks';
import {
	bulkRegisterGuarantee,
	bulkCancelGuarantee,
	bulkDeleteGuarantee,
} from '@/api/guarantee.api';

import RegisterGuaranteeListProgressModal from '@/features/guarantee/List/RegisterGuaranteeListProgressModal';

interface Props {
	nftReqState: string;
	checkedItems: number[];
	onHandleChangeFilter: (newParam: {[key: string]: any}) => void;
	onResetCheckedItem: () => void;
	onSearch: () => void;
}

function GuaranteeCheckboxButton({
	nftReqState,
	checkedItems,
	onHandleChangeFilter,
	onResetCheckedItem,
	onSearch,
}: Props) {
	const totalCount = useMemo(() => checkedItems.length, [checkedItems]);
	const [requestCount, setRequestCount] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		open: openRegisterGuaranteeListModal,
		onOpen: onOpenRegisterGuaranteeListModal,
		onClose: onCloseRegisterGuaranteeListModal,
	} = useChildModalOpen({});
	const onOpenMessageDialog = useMessageDialog((state) => state.onOpen);
	const onCloseMessageDialog = useMessageDialog((state) => state.onClose);

	const isCheckedItemsExisted = useCallback(
		(checkedItems: number[], message: string) => {
			if (checkedItems?.length < 1) {
				onOpenMessageDialog({
					title: message,
					showBottomCloseButton: true,
					closeButtonValue: '확인',
				});
				return false;
			}
			return true;
		},
		[onOpenMessageDialog]
	);

	const handleRegisterGuaranteeList = async (checkedItems: number[]) => {
		setIsSubmitting(true);
		let failCount = 0;
		try {
			if (checkedItems?.length < 1) {
				onOpenMessageDialog({
					title: '발급할 개런티를 선택해주세요.',
					showBottomCloseButton: true,
					closeButtonValue: '확인',
				});
				return;
			}

			// 개런티 발급 중 프로그레스 모달
			onCloseMessageDialog();
			setRequestCount(0);
			onOpenRegisterGuaranteeListModal();
			for (let i = 0; i < checkedItems.length; i++) {
				// api 요청
				try {
					const res = await bulkRegisterGuarantee([checkedItems[i]]);
					if (res?.failure > 0) {
						failCount += 1;
					}
					setRequestCount((prev) => prev + 1);
				} catch (e) {
					failCount += 1;
				}
			}

			// delay
			await new Promise((resolve) => {
				setTimeout(() => {
					resolve('');
				}, 1000);
			});
			onCloseRegisterGuaranteeListModal();

			// TODO: 기타 예외 처리
			// 개런티 발급 완료 안내 모달
			onOpenMessageDialog({
				title: '개런티가 발급됐습니다',
				message: (
					<>
						총 <b>{totalCount - failCount}건</b>의 개런티가
						정상적으로 발급됐습니다.
						{failCount > 0 && (
							<>
								<br />
								{failCount}건은 상품 정보가 삭제되어 발급되지
								않았습니다. <br />
								상품정보를 다시 입력해주세요.
							</>
						)}
					</>
				),
				showBottomCloseButton: true,
				closeButtonValue: '확인',
				onCloseFunc: () => {
					onHandleChangeFilter({
						nft_req_state: '2,3,4',
					});
				},
			});
		} catch (e: any) {
			onOpenMessageDialog({
				title: '네트워크 에러',
				message: e?.response?.data?.message || '',
				showBottomCloseButton: true,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteGuaranteeList = async (checkedItems: number[]) => {
		try {
			setIsSubmitting(true);
			await bulkDeleteGuarantee(checkedItems);
			onOpenMessageDialog({
				title: '개런티가 삭제됐습니다.',
				showBottomCloseButton: true,
				closeButtonValue: '확인',
				onCloseFunc: () => {
					onSearch();
					onResetCheckedItem();
				},
			});
		} catch (e) {
			onOpenMessageDialog({
				title: '네트워크 에러',
				message: e?.response?.data?.message || '',
				showBottomCloseButton: true,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancelGuaranteeList = async (checkedItems: number[]) => {
		try {
			setIsSubmitting(true);
			await bulkCancelGuarantee(checkedItems);
			onOpenMessageDialog({
				title: '개런티가 발급취소됐습니다.',
				showBottomCloseButton: true,
				closeButtonValue: '확인',
				onCloseFunc: () => {
					onHandleChangeFilter({
						nft_req_state: '9',
					});
				},
			});
		} catch (e) {
			onOpenMessageDialog({
				title: '네트워크 에러',
				message: e?.response?.data?.message || '',
				showBottomCloseButton: true,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	// 전체 조회, 발급취소
	if (!nftReqState || nftReqState === '9') {
		return null;
	}

	return (
		<>
			<Loading loading={isSubmitting} showCircularProgress={false} />
			<RegisterGuaranteeListProgressModal
				open={openRegisterGuaranteeListModal}
				requestCount={requestCount}
				totalCount={totalCount}
			/>
			{
				//신청대기
				nftReqState === '1' && (
					<>
						<Button
							variant="outlined"
							color="grey-100"
							height={32}
							onClick={() => {
								if (
									!isCheckedItemsExisted(
										checkedItems,
										'삭제할 개런티를 선택해주세요.'
									)
								) {
									return;
								}
								onOpenMessageDialog({
									title: '선택한 개런티를 삭제하시겠습니까?',
									showBottomCloseButton: true,
									closeButtonValue: '취소',
									buttons: (
										<>
											<Button
												color="black"
												variant="contained"
												onClick={() => {
													handleDeleteGuaranteeList(
														checkedItems
													);
												}}>
												삭제하기
											</Button>
										</>
									),
									sendCloseModalControlToParent: false,
								});
							}}>
							선택 삭제
						</Button>
						<Button
							variant="contained"
							color="black"
							height={32}
							onClick={() => {
								if (
									!isCheckedItemsExisted(
										checkedItems,
										'발급할 개런티를 선택해주세요.'
									)
								) {
									return;
								}
								onOpenMessageDialog({
									title: '선택한 개런티를 발급하시겠습니까?',
									showBottomCloseButton: true,
									closeButtonValue: '취소',
									buttons: (
										<>
											<Button
												color="black"
												variant="contained"
												onClick={() => {
													handleRegisterGuaranteeList(
														checkedItems
													);
												}}>
												발급하기
											</Button>
										</>
									),
									sendCloseModalControlToParent: false,
								});
							}}
							sx={{
								marginRight: 0,
							}}>
							개런티 발급
						</Button>
					</>
				)
			}
			{nftReqState === '2,3,4' && (
				<Button
					variant="contained"
					color="black"
					height={32}
					onClick={() => {
						if (
							!isCheckedItemsExisted(
								checkedItems,
								'발급 취소할 개런티를 선택해주세요.'
							)
						) {
							return;
						}
						onOpenMessageDialog({
							title: '선택하신 개런티를 발급 취소하시겠습니까?',
							showBottomCloseButton: true,
							closeButtonValue: '취소',
							buttons: (
								<>
									<Button
										color="black"
										variant="contained"
										onClick={() => {
											handleCancelGuaranteeList(
												checkedItems
											);
										}}>
										발급취소
									</Button>
								</>
							),
						});
					}}
					sx={{
						marginRight: 0,
					}}>
					발급취소
				</Button>
			)}
		</>
	);
}

export default React.memo(GuaranteeCheckboxButton);
