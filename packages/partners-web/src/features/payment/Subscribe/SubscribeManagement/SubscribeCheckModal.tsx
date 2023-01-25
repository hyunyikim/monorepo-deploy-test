import {Stack, Typography} from '@mui/material';

import {PricePlan} from '@/@types';
import {Button, Dialog} from '@/components';
import {useMessageDialog} from '@/stores';

import SubscribeInfoPreview from '@/features/payment/common/SubscribeInfoPreview';
import SubscribeNoticeBullet from '@/features/payment/common/SubscribeNoticeBullet';
import AddPaymentCardModal from '@/features/payment/common/AddPaymentCardModal';
import {useChildModalOpen} from '@/utils/hooks';

interface Props {
	selectedPlan: PricePlan;
	open: boolean;
	onClose: () => void;
}

function SubscribeCheckModal({selectedPlan, open, onClose}: Props) {
	const onOpenMessageDialog = useMessageDialog((state) => state.onOpen);
	const onCloseMessageDialog = useMessageDialog((state) => state.onClose);
	const {
		open: openAddPaymentModal,
		onOpen: onOpenAddPaymentModal,
		onClose: onCloseAddPaymentModal,
	} = useChildModalOpen({});

	const onClickSubscribeChange = async () => {
		// TODO: 결제 카드 등록 여부 확인
		// 등록 안 되어있다면 결제 카드 등록 후 업그레이드 진행
		// 등록 되어있다면 업그레이드 진행

		// TODO:
		if (true) {
			onOpenAddPaymentModal();
		}
	};
	return (
		<>
			<Dialog
				TitleComponent={
					<Typography variant="header1">구독 변경하기</Typography>
				}
				ActionComponent={
					<>
						<Button
							variant="outlined"
							color="grey-100"
							height={32}
							onClick={() => {
								onOpenMessageDialog({
									title: '플랜 업그레이드를 취소할까요?',
									buttons: (
										<>
											<Button
												variant="outlined"
												color="grey-100"
												onClick={onCloseMessageDialog}>
												아니오
											</Button>
											<Button
												color="black"
												onClick={() => {
													onClose();
													onCloseMessageDialog();
												}}>
												예
											</Button>
										</>
									),
								});
							}}>
							닫기
						</Button>
						<Button
							color="primary"
							height={32}
							onClick={onClickSubscribeChange}>
							확인
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
							selectedPlan={selectedPlan}
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
							data={[
								'업그레이드 시 기존 개런티 발급량이 남아 있다면 업그레이드한 플랜에 함께 적용됩니다.',
								'환불은 카드취소가 불가능할 경우 고객센터를 통해 문의 주시면 사용일수를 계산해 지정계좌로 입금 해드립니다.',
								'연결제 이용중 플랜의 구독을 취소하거나 다운그레이드 할 경우에는 위약금 규정에 따라 위약금을 공제 후 차액을 환불 해드립니다.',
							]}
						/>
					</Stack>
				</Stack>
			</Dialog>
			<AddPaymentCardModal
				open={openAddPaymentModal}
				onClose={onCloseAddPaymentModal}
			/>
		</>
	);
}

export default SubscribeCheckModal;
