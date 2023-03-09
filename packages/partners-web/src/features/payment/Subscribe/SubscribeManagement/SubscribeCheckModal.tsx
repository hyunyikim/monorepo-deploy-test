import {Dispatch, SetStateAction} from 'react';
import {useMutation, useQueryClient} from '@tanstack/react-query';

import {Stack, Typography} from '@mui/material';

import {
	PricePlan,
	TotalSubscribeInfoPreviewData,
	Card,
	PatchPlanRequestParam,
} from '@/@types';
import {Button, Dialog} from '@/components';
import {
	useMessageDialog,
	useGetUserPricePlan,
	useGlobalLoading,
} from '@/stores';

import SubscribeInfoPreview from '@/features/payment/common/SubscribeInfoPreview';
import SubscribeNoticeBullet from '@/features/payment/common/SubscribeNoticeBullet';
import AddPaymentCardModal from '@/features/payment/common/AddPaymentCardModal';
import {useOpen} from '@/utils/hooks';
import {patchPricePlan} from '@/api/payment.api';

interface Props {
	selectedPlan: PricePlan;
	subscribePreview: TotalSubscribeInfoPreviewData;
	open: boolean;
	onOpen: () => void;
	onClose: () => void;
	setIsAvailableSelect: Dispatch<SetStateAction<boolean>>;
}

function SubscribeCheckModal({
	selectedPlan,
	subscribePreview,
	open,
	onOpen,
	onClose,
	setIsAvailableSelect,
}: Props) {
	const queryClient = useQueryClient();
	const {data: userPlan} = useGetUserPricePlan();

	const onOpenMessageDialog = useMessageDialog((state) => state.onOpen);
	const onOpenError = useMessageDialog((state) => state.onOpenError);
	const setIsLoading = useGlobalLoading((state) => state.setIsLoading);
	const {
		open: openAddPaymentModal,
		onOpen: onOpenAddPaymentModal,
		onClose: onCloseAddPaymentModal,
	} = useOpen({});

	const patchPricePlanMutation = useMutation({
		onMutate: () => {
			setIsLoading(true);
		},
		mutationFn: (data: PatchPlanRequestParam) => patchPricePlan(data),
		onSuccess: () => {
			onClose();
			queryClient.invalidateQueries({
				queryKey: ['userPricePlan'],
			});
			onOpenMessageDialog({
				title: '구독 플랜이 변경됐습니다.',
				showBottomCloseButton: true,
				closeButtonValue: '확인',
			});
			setIsAvailableSelect(false);
		},
		onError: (e) => {
			onOpenError({
				e,
				message: '다시 확인해주세요.',
			});
		},
		onSettled: () => {
			setIsLoading(false);
		},
	});

	const onClickSubscribeChange = async () => {
		const isCardRegistered = userPlan?.card ? true : false;
		if (isCardRegistered) {
			await patchPricePlanMutation.mutateAsync({
				planId: selectedPlan.planId,
			});
			return;
		}

		// 카드 등록 안되어있다면 카드 등록 선진행 후 플랜 업그레이드 진행
		onClose();
		onOpenAddPaymentModal();
	};

	return (
		<>
			<Dialog
				TitleComponent={
					<Typography
						component="span"
						variant="header1"
						fontWeight="bold">
						구독 변경하기
					</Typography>
				}
				ActionComponent={
					<>
						<Button
							variant="outlined"
							color="grey-100"
							height={32}
							onClick={onClose}>
							닫기
						</Button>
						<Button
							color="primary"
							height={32}
							onClick={onClickSubscribeChange}>
							구독 변경
						</Button>
					</>
				}
				width={900}
				height={700}
				open={open}
				showBottomLine={true}
				onClose={onClose}
				sx={{
					'& .MuiDialogActions-root': {
						justifyContent: 'flex-end',
						zIndex: 2,
					},
				}}>
				<Stack
					flexDirection={{
						xs: 'column',
						sm: 'row',
					}}
					sx={{
						'& > div': {
							flex: '1',
						},
					}}>
					<Stack
						sx={{
							width: '100%',
						}}>
						<SubscribeInfoPreview
							data={subscribePreview}
							sx={{
								width: '100%',
								maxWidth: {
									xs: '100%',
									sm: 'calc(100% / 2 - 32px)',
								},
							}}
						/>
						<SubscribeNoticeBullet
							data={['자세한 사항은 구독 가이드를 참고해주세요.']}
						/>
					</Stack>
					<Stack
						sx={(theme) => ({
							position: {
								xs: 'relative',
								sm: 'absolute',
							},
							width: {
								xs: '100%',
								sm: 'calc(100% / 2)',
							},
							height: '100%',
							paddingTop: '97px',
							paddingBottom: '20px',
							paddingX: '32px',
							top: 0,
							right: 0,
							zIndex: 1,
							backgroundColor: theme.palette.grey[10],
						})}>
						<Typography
							variant="subtitle2"
							fontWeight="bold"
							color="grey.600"
							mb="12px">
							유의사항
						</Typography>
						<Typography variant="body1" color="grey.500" mb="20px">
							왼쪽의 상세내용을 꼭 확인 후에 계속 진행해주세요.{' '}
							<br /> 플랜 요금제 변경시 결제완료 시점에 플랜이
							즉시 변경되며, <br />
							잔여 개런티 발급량이 남아있는 경우 플랜의 업그레이드
							진행시 플러스 되어 함께 적용됩니다.
						</Typography>
						<SubscribeNoticeBullet
							sx={(theme) => ({
								padding: '20px',
								'& .MuiListItem-root': {
									padding: 0,
									fontSize: 13,
									color: theme.palette.grey[500],
								},
								borderRadius: '8px',
								backgroundColor: theme.palette.grey[50],
							})}
							useDefaultData={false}
							data={[
								'월 구독 업그레이드 시 기존 개런티 발급량이 남아 있다면 업그레이드 한 플랜에 합산됩니다.',
								'환불은 카드취소가 불가능할 경우 고객센터를 통해 문의 주시면 사용일수를 계산해 지정계좌로 입금 해드립니다.',
								'연결제 이용중 플랜 업그레이드 할 경우에는 플랜을 사용하지 않은 기간 만큼 업그레이드 한 플랜의 구독료에서 차감되어 결제됩니다.',
								'연결제 이용중 플랜의 구독을 취소할 경우에는 플랜 종료일까지 이용이 가능합니다.',
								'연결제 이용중 플랜 다운그레이드 할 경우에는 위약금 규정에 따라 위약금을 공제 후 차액을 환불 해드립니다.',
								'연결제 이용중 월결제로 변경 할 경우에는 연결제 구독이 끝나는날부터 월단위로 결제가 진행됩니다.',
							]}
						/>
					</Stack>
				</Stack>
			</Dialog>
			{openAddPaymentModal && (
				<AddPaymentCardModal
					open={openAddPaymentModal}
					onClose={onCloseAddPaymentModal}
					afterAddPaymentCardFunc={onOpen}
				/>
			)}
		</>
	);
}

export default SubscribeCheckModal;
