import React, {useMemo, useState} from 'react';
import {useQueryClient} from '@tanstack/react-query';

import {Button} from '@/components';

import {
	useGlobalLoading,
	useMessageDialog,
	useGetUserPricePlan,
} from '@/stores';
import {useChildModalOpen} from '@/utils/hooks';
import {
	bulkRegisterGuarantee,
	bulkCancelGuarantee,
	bulkDeleteGuarantee,
} from '@/api/guarantee.api';
import {updateUserPricePlanData, goToParentUrl} from '@/utils';
import RegisterGuaranteeListProgressModal from '@/features/guarantee/List/RegisterGuaranteeListProgressModal';
import {isPlanEnterprise} from '@/data';

interface Props {
	nftReqState: string;
	checkedItems: number[];
	onHandleChangeFilter: (newParam: {[key: string]: any}) => void;
	onResetCheckedItem: () => void;
	onSearch: () => void;
	isCheckedItemsExisted: (message: string) => boolean;
}

function GuaranteeCheckboxButton({
	nftReqState,
	checkedItems,
	onHandleChangeFilter,
	onResetCheckedItem,
	onSearch,
	isCheckedItemsExisted,
}: Props) {
	const queryClient = useQueryClient();
	const totalCount = useMemo(() => checkedItems.length, [checkedItems]);
	const [requestCount, setRequestCount] = useState(0);
	const setIsLoading = useGlobalLoading((state) => state.setIsLoading);

	const {
		open: openRegisterGuaranteeListModal,
		onOpen: onOpenRegisterGuaranteeListModal,
		onClose: onCloseRegisterGuaranteeListModal,
	} = useChildModalOpen({});
	const onOpenMessageDialog = useMessageDialog((state) => state.onOpen);
	const onCloseMessageDialog = useMessageDialog((state) => state.onClose);
	const onOpenError = useMessageDialog((state) => state.onOpenError);

	const {data: userPlan} = useGetUserPricePlan();

	const handleRegisterGuaranteeList = async (checkedItems: number[]) => {
		setIsLoading(true, false);
		let failCount = 0;
		let productDeletedCount = 0;
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
					if (res?.error?.length > 0) {
						const errorMessage = res?.error[0]?.message;
						if (
							errorMessage?.includes('상품') &&
							errorMessage?.includes('삭제')
						) {
							productDeletedCount += 1;
						}
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
			onOpenMessageDialog({
				title: '개런티가 발급됐습니다',
				message: (
					<>
						총 <b>{totalCount - failCount}건</b>의 개런티가
						정상적으로 발급됐습니다.
						{failCount > 0 && (
							<>
								<br />
								{productDeletedCount && (
									<>
										{productDeletedCount}건은 상품 정보가
										삭제되어 발급되지 않았습니다. <br />
										상품정보를 다시 입력해주세요.
									</>
								)}
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
			updateUserPricePlanData();
			queryClient.invalidateQueries({
				queryKey: ['userPricePlan'],
			});
		} catch (e: any) {
			onOpenError();
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteGuaranteeList = async (checkedItems: number[]) => {
		try {
			setIsLoading(true, false);
			const bulkResponse = await bulkDeleteGuarantee(checkedItems);
			onOpenMessageDialog({
				title: '개런티가 삭제됐습니다.',
				message: (
					<>
						총 <b>{bulkResponse?.success || 0}건</b>의 개런티가
						정상적으로 삭제됐습니다.
					</>
				),
				showBottomCloseButton: true,
				closeButtonValue: '확인',
				onCloseFunc: () => {
					onSearch();
					onResetCheckedItem();
				},
			});
		} catch (e) {
			onOpenError();
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancelGuaranteeList = async (checkedItems: number[]) => {
		try {
			setIsLoading(true, false);
			const bulkResponse = await bulkCancelGuarantee(checkedItems);
			onOpenMessageDialog({
				title: '개런티가 발급취소됐습니다.',
				message: (
					<>
						총 <b>{bulkResponse?.success || 0}건</b>의 개런티가
						정상적으로 발급취소됐습니다.
					</>
				),
				showBottomCloseButton: true,
				closeButtonValue: '확인',
				onCloseFunc: () => {
					onHandleChangeFilter({
						nft_req_state: '9',
					});
				},
			});
		} catch (e) {
			onOpenError();
		} finally {
			setIsLoading(false);
		}
	};

	// 전체 조회, 발급취소
	if (!nftReqState || nftReqState === '9') {
		return null;
	}

	const currentGuaranteeBalance =
		userPlan && userPlan?.pricePlan.planLimit - userPlan?.usedNftCount;
	const isFreeTrial = userPlan?.pricePlan.planLevel === 0;
	const currentDate = new Date().getTime();
	const expireDate = userPlan?.planExpireDate
		? new Date(userPlan?.planExpireDate).getTime()
		: null;
	const modalConfirmButton = (_text: string) => {
		return (
			<Button
				color="black"
				onClick={() => {
					goToParentUrl('/b2b/payment/subscribe');
				}}>
				{_text}
			</Button>
		);
	};

	const freeTrialExpiredModal = () => {
		return onOpenMessageDialog({
			title: '무료체험 기간 종료로 서비스 이용이 제한됩니다.',
			message: (
				<>
					무료체험 기간이 종료되어 서비스 이용이 제한됩니다.
					<br />
					유료 플랜으로 업그레이드 후 버클을 계속 이용해보세요.
				</>
			),
			showBottomCloseButton: true,
			closeButtonValue: '닫기',
			disableClickBackground: true,
			buttons: modalConfirmButton('플랜 업그레이드'),
		});
	};

	const expiredPricePlanModal = () => {
		return onOpenMessageDialog({
			title: '플랜 구독하고 개런티를 발급해보세요!',
			showBottomCloseButton: true,
			closeButtonValue: '닫기',
			disableClickBackground: true,
			buttons: modalConfirmButton('구독'),
		});
	};

	const notEnoughGuaranteeBalanceModal = () => {
		if (userPlan) {
			return onOpenMessageDialog({
				title: '개런티 발급량이 부족합니다.',
				message: (
					<>
						현재 잔여 개런티 발급량은{' '}
						{userPlan?.pricePlan?.planLimit -
							userPlan?.usedNftCount}
						개입니다.
						<br />
						플랜 업그레이드하고 {totalCount}개의 개런티를 모두
						발급해보세요.
					</>
				),
				showBottomCloseButton: true,
				closeButtonValue: '닫기',
				disableClickBackground: true,
				buttons: modalConfirmButton('플랜 업그레이드'),
			});
		}
	};

	return (
		<>
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
									!isPlanEnterprise(
										userPlan?.pricePlan.planType
									)
								) {
									if (expireDate) {
										if (expireDate - currentDate < 0) {
											if (isFreeTrial) {
												/* 무료체험이 만료되었을때 */
												return freeTrialExpiredModal();
											} else {
												/* 유로플랜이 만료되었을때 */
												return expiredPricePlanModal();
											}
										}
									}

									/* 개런티 잔여량보다 발급하려는 수가 더 많을때 */
									if (
										typeof currentGuaranteeBalance ===
										'number'
									) {
										if (
											totalCount > currentGuaranteeBalance
										) {
											return notEnoughGuaranteeBalanceModal();
										}
									}
								}

								if (
									!isCheckedItemsExisted(
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
