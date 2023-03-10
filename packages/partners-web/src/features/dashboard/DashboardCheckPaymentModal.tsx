import {Button} from '@/components';
import {isPlanEnterprise, PAYMENT_MESSAGE_MODAL} from '@/data';
import {
	useGetUserPricePlan,
	useIsPlanOnSubscription,
	useIsUserUsedTrialPlan,
	useMessageDialog,
} from '@/stores';
import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

function DashboardCheckPaymentModal() {
	const navigate = useNavigate();
	const onOpenMessageDialog = useMessageDialog((state) => state.onOpen);
	const onCloseMessageDialog = useMessageDialog((state) => state.onClose);
	const {data: userPricePlan} = useGetUserPricePlan();
	const {data: isTrial} = useIsUserUsedTrialPlan();
	const {data: isOnSubscription} = useIsPlanOnSubscription();

	useEffect(() => {
		if (
			!userPricePlan ||
			isPlanEnterprise(userPricePlan?.pricePlan?.planType) ||
			typeof isTrial === 'undefined' ||
			typeof isOnSubscription === 'undefined'
		) {
			return;
		}

		// 결제 실패
		const failedCount = userPricePlan.paymentFailedCount;
		if (failedCount) {
			// 5번 이하 실패
			if (failedCount > 0 && failedCount < 6) {
				onOpenMessageDialog({
					title: '구독 결제에 실패했습니다.',
					message: '결제 카드 상태를 확인해주세요.',
					showBottomCloseButton: true,
					closeButtonValue: '닫기',
					buttons: (
						<Button
							color="black"
							onClick={() => {
								navigate('/b2b/payment/information');
								onCloseMessageDialog();
							}}>
							결제 관리 보기
						</Button>
					),
				});
				return;
			}
			// 6번 이상 실패
			if (failedCount >= 6) {
				onOpenMessageDialog({
					title: '서비스 이용 제한',
					message: (
						<>
							6일동안 자동 결제 실패로 서비스 이용이
							제한되었습니다.
							<br />
							결제 관리에서 카드 정보를 해결해보세요.
						</>
					),
					showBottomCloseButton: true,
					closeButtonValue: '닫기',
					buttons: (
						<Button
							color="black"
							onClick={() => {
								navigate('/b2b/payment/information');
								onCloseMessageDialog();
							}}>
							결제 관리 보기
						</Button>
					),
				});
				return;
			}
		}

		// 구독 기간 종료
		if (!isOnSubscription) {
			// 무료 플랜 기간 종료
			if (isTrial) {
				onOpenMessageDialog({
					title: '무료체험 기간 종료로 서비스 이용이 제한됩니다.',
					message: (
						<>
							무료체험 기간이 종료되어 서비스 이용이 제한됩니다.
							<br /> 유료 플랜으로 업그레이드 후 버클을 계속
							이용해보세요.
						</>
					),
					showBottomCloseButton: true,
					closeButtonValue: '닫기',
					buttons: (
						<Button
							color="black"
							onClick={() => {
								navigate('/b2b/payment/subscribe');
								onCloseMessageDialog();
							}}>
							플랜 업그레이드하기
						</Button>
					),
				});
				return;
			}
			// 기간 종료
			onOpenMessageDialog({
				...PAYMENT_MESSAGE_MODAL.PLAN_SUBSCRIBE,
				buttons: (
					<Button
						color="black"
						onClick={() => {
							navigate('/b2b/payment/subscribe');
							onCloseMessageDialog();
						}}>
						구독
					</Button>
				),
			});
			return;
		}

		// 개런티 모두 소진
		const usedNftCount = userPricePlan.usedNftCount || 0;
		const planLimit = userPricePlan.pricePlan.planLimit || 0;
		if (usedNftCount === planLimit || usedNftCount > planLimit) {
			onOpenMessageDialog({
				title: '개런티 발급량이 모두 소진 되었습니다.',
				message:
					'나에게 맞는 플랜으로 업그레이드 후 개런티를 계속 발급해보세요.',
				showBottomCloseButton: true,
				closeButtonValue: '닫기',
				buttons: (
					<Button
						color="black"
						onClick={() => {
							navigate('/b2b/payment/subscribe');
							onCloseMessageDialog();
						}}>
						플랜 업그레이드하기
					</Button>
				),
			});
		}
	}, [userPricePlan, isTrial, isOnSubscription]);

	return <></>;
}

export default DashboardCheckPaymentModal;
