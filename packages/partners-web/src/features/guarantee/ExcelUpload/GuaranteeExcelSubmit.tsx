import {useMemo, useState} from 'react';
import {Button} from '@/components';
import {ExcelError, GuaranteeExcelUploadFormData} from '@/@types';
import {
	useGetPartnershipInfo,
	useGetPlatformList,
	useGetUserPricePlan,
	useGlobalLoading,
	useIsPlanOnSubscription,
	useIsUserUsedTrialPlan,
	useMessageDialog,
} from '@/stores';
import ProgressModal from '@/features/common/ProgressModal';
import {useChildModalOpen} from '@/utils/hooks';
import {registerBulkGuarantee} from '@/api/guarantee.api';
import {goToParentUrl, updateUserPricePlanData} from '@/utils';
import {customFieldsToJSONString, PAYMENT_MESSAGE_MODAL} from '@/data';
import {useQueryClient} from '@tanstack/react-query';

interface Props {
	gridData: GuaranteeExcelUploadFormData[] | null;
	errors: ExcelError | null;
}

function GuaranteeExcelSubmit({gridData, errors}: Props) {
	const [requestCount, setRequestCount] = useState(0);
	const totalCount = useMemo(() => gridData?.length || 0, [gridData]);
	const setIsLoading = useGlobalLoading((state) => state.setIsLoading);
	const onOpenMessageDialog = useMessageDialog((state) => state.onOpen);
	const onCloseMessageDialog = useMessageDialog((state) => state.onClose);

	const {data: partnershipData} = useGetPartnershipInfo();
	const {data: platformList} = useGetPlatformList();
	const {data: userPricePlan} = useGetUserPricePlan();
	const {data: isOnSubscription} = useIsPlanOnSubscription();
	const {data: isTrialPlan} = useIsUserUsedTrialPlan();
	const queryClient = useQueryClient();

	// 개런티 발급중 모달
	const {
		open: openRegisterGuaranteeListModal,
		onOpen: onOpenRegisterGuaranteeListModal,
		onClose: onCloseRegisterGuaranteeListModal,
	} = useChildModalOpen({});

	const handleSubmit = async () => {
		if (!gridData || gridData?.length === 0) {
			return;
		}
		setIsLoading(true, false);
		let failCount = 0;

		onCloseMessageDialog();
		setRequestCount(0);
		onOpenRegisterGuaranteeListModal();
		for (let i = 0; i < gridData.length; i++) {
			try {
				const customFields = partnershipData?.nftCustomFields || [];
				let tempData = {...gridData[i]};
				tempData = {
					...tempData,
					custom_field:
						customFieldsToJSONString<GuaranteeExcelUploadFormData>(
							tempData,
							customFields
						),
				};
				// custom field key 삭제
				customFields.forEach((customField) => {
					delete tempData[customField];
				});

				// platform_nm or platform_idx 둘 중 하나 선택		TODO: 로직 공통화 시키기
				const platformName = tempData?.platform_nm || '';
				if (platformName) {
					const existedPlatform = platformList?.find(
						(platform) =>
							platform.label.trim() === platformName.trim()
					);
					if (existedPlatform) {
						tempData['platform_idx'] = existedPlatform.value;
						delete tempData['platform_nm'];
					}
				}
				await registerBulkGuarantee([tempData]);
				setRequestCount((prev) => prev + 1);
			} catch (e) {
				failCount += 1;
			}
		}
		updateUserPricePlanData();
		queryClient.invalidateQueries({
			queryKey: ['userPricePlan'],
		});

		// delay
		await new Promise((resolve) => {
			setTimeout(() => {
				resolve('');
				setIsLoading(false);
			}, 1000);
		});
		onCloseRegisterGuaranteeListModal();
		onOpenMessageDialog({
			title: '개런티가 발급됐습니다',
			message: (
				<>
					총 <b>{(totalCount - failCount).toLocaleString()}건</b>의
					개런티가 정상적으로 발급됐습니다.
					{failCount > 0 && (
						<>
							<br />
							{failCount.toLocaleString()}건은 일부 오류가 발생해
							발급되지 않았습니다. 다시 확인해주세요.
						</>
					)}
				</>
			),
			showBottomCloseButton: true,
			closeButtonValue: '확인',
			onCloseFunc: () => {
				goToParentUrl('/b2b/guarantee');
			},
		});
	};

	const checkGuaranteeLimit = () => {
		if (!userPricePlan) {
			return false;
		}
		// 기간 종료
		if (!isOnSubscription) {
			// 무료체험 종료
			if (isTrialPlan) {
				onOpenMessageDialog(PAYMENT_MESSAGE_MODAL.TRIAL_FINISH);
				return false;
			}

			// 유료플랜 종료
			onOpenMessageDialog(PAYMENT_MESSAGE_MODAL.PLAN_SUBSCRIBE);
			return false;
		}

		// 개런티 부족
		const planLimit = userPricePlan?.pricePlan.planLimit || 0;
		const nowUsed = userPricePlan.usedNftCount || 0;
		const leftCount = planLimit - nowUsed;
		const willIssueGuaranteeCount = gridData?.length || 0;
		if (willIssueGuaranteeCount > leftCount) {
			onOpenMessageDialog({
				...PAYMENT_MESSAGE_MODAL.LACKING_GUARANTEE,
				message: (
					<>
						현재 잔여 개런티 발급량은 {leftCount.toLocaleString()}
						개입니다.
						<br />
						플랜 업그레이드하고{' '}
						{willIssueGuaranteeCount.toLocaleString()}개의 개런티를
						모두 발급해보세요.
					</>
				),
			});
			return false;
		}
		return true;
	};

	return (
		<>
			<Button
				height={40}
				disabled={!!(errors && errors?.size > 0)}
				onClick={() => {
					if (!checkGuaranteeLimit()) {
						return;
					}
					onOpenMessageDialog({
						title: '개런티를 발급하시겠어요?',
						message: `${(
							gridData?.length || 0
						).toLocaleString()}개의 개런티 신청건이 확인됐어요.`,
						showBottomCloseButton: true,
						closeButtonValue: '취소',
						buttons: (
							<Button
								color="black"
								onClick={handleSubmit}
								data-tracking={`guarantee_excelpublish_infodeficiency_popuppublish,{'button_title': '개런티 대량 발급하기'}`}>
								발급
							</Button>
						),
					});
				}}>
				개런티 발급
			</Button>
			<ProgressModal
				title="개런티 발급중"
				open={openRegisterGuaranteeListModal}
				requestCount={requestCount}
				totalCount={totalCount}
			/>
		</>
	);
}

export default GuaranteeExcelSubmit;
