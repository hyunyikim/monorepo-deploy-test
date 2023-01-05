import {useEffect, useMemo} from 'react';
import {useMutation, useQueryClient} from '@tanstack/react-query';

import {Stack, Typography} from '@mui/material';

import {
	useGetPartnershipInfo,
	useMessageDialog,
	useGlobalLoading,
} from '@/stores';
import {
	installServiceInterwork,
	uninstallServiceInterwork,
} from '@/api/service-interwork.api';
import {goToParentUrlWithState, updateParentPartnershipData} from '@/utils';

import {Button} from '@/components';
import {
	ImgServiceInterworkRepair,
	ImgServiceInterworkRepair2x,
	ImgServiceInterworkRepairSample1,
	ImgServiceInterworkRepairSample2,
} from '@/assets/images';

import ServiceInterworkDetailTitle from '@/features/service-interwork/Detail/common/ServiceInterworkDetailTitle';
import ServiceInterworkDetailContent from '@/features/service-interwork/Detail/common/ServiceInterworkDetailContent';

function ServiceInterworkRepair() {
	const queryClient = useQueryClient();
	const setIsLoading = useGlobalLoading((state) => state.setIsLoading);
	const onOpenMessageDialog = useMessageDialog((state) => state.onOpen);
	const onOpenError = useMessageDialog((state) => state.onOpenError);

	const {data: partnershipData, isLoading} = useGetPartnershipInfo();

	const installServiceInterworkMutation = useMutation({
		mutationFn: () => installServiceInterwork('repair'),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['partnershipInfo'],
			});
		},
	});

	const uninstallServiceInterworkMutation = useMutation({
		mutationFn: () => uninstallServiceInterwork('repair'),
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ['partnershipInfo']});
		},
	});

	useEffect(() => {
		const isLoading =
			installServiceInterworkMutation?.isLoading ||
			uninstallServiceInterworkMutation?.isLoading;
		setIsLoading(isLoading);
	}, [
		installServiceInterworkMutation?.isLoading,
		uninstallServiceInterworkMutation?.isLoading,
		setIsLoading,
	]);

	const installedRepair = partnershipData?.useRepair === 'Y' ? true : false;

	const isAlreadySetupGuarantee = useMemo(
		() => (partnershipData?.profileImage ? true : false),
		[partnershipData?.profileImage]
	);

	const InstallRepairButton = useMemo(() => {
		return (
			<Button
				onClick={() => {
					(async () => {
						try {
							await installServiceInterworkMutation.mutateAsync();
							onOpenMessageDialog({
								title: '수선신청 관리가 연동됐습니다.',
								message: (
									<>
										고객 수선신청 화면에 표시되는 고객센터
										버튼, A/S 주의사항을 개런티 설정에서
										입력해주세요.
									</>
								),
								showBottomCloseButton: true,
								closeButtonValue: '닫기',
								buttons: (
									<Button
										color="black"
										onClick={() => {
											let url = '/setup/guarantee';
											if (isAlreadySetupGuarantee) {
												url = '/re-setup/guarantee';
											}
											goToParentUrlWithState(url, {
												'interwork-repair': true,
											});
										}}>
										개런티 설정으로 이동
									</Button>
								),
								onCloseFunc: () => {
									updateParentPartnershipData();
								},
							});
						} catch (e) {
							onOpenError();
						}
					})();
				}}>
				연동하기
			</Button>
		);
	}, [
		onOpenMessageDialog,
		onOpenError,
		installServiceInterworkMutation,
		isAlreadySetupGuarantee,
	]);

	const UninstallRepairButton = useMemo(() => {
		return (
			<Button
				color="grey-100"
				variant="outlined"
				onClick={() => {
					onOpenMessageDialog({
						title: '수선신청 관리를 연동 해제하시겠습니까?',
						message: (
							<>
								고객에게 발급된 개런티 상세에 “수선신청" 버튼이
								미노출됩니다. <br /> 기존 수선신청 목록은 확인할
								수 있습니다.
							</>
						),
						showBottomCloseButton: true,
						closeButtonValue: '취소',
						buttons: (
							<Button
								color="black"
								onClick={() => {
									(async () => {
										try {
											await uninstallServiceInterworkMutation.mutateAsync();
											onOpenMessageDialog({
												title: '연동이 해제됐습니다.',
												showBottomCloseButton: true,
												closeButtonValue: '확인',
												onCloseFunc: () => {
													updateParentPartnershipData();
												},
											});
										} catch (e) {
											onOpenError();
										}
									})();
								}}>
								연동해제
							</Button>
						),
					});
				}}>
				연동해제
			</Button>
		);
	}, [onOpenMessageDialog, onOpenError, uninstallServiceInterworkMutation]);

	if (isLoading) {
		return <></>;
	}

	return (
		<Stack
			flexDirection="column"
			width="100%"
			maxWidth="800px"
			margin="auto">
			<ServiceInterworkDetailTitle
				title="수선신청 관리"
				subTitle="고객이 간편하게 수선신청하고, 신청 내역을 한곳에서 관리하세요."
				isLinked={installedRepair}
				titleImgBackgroundColor="#EDF9F7"
				TitleImg={
					<img
						src={ImgServiceInterworkRepair}
						srcSet={`${ImgServiceInterworkRepair2x} 2x`}
						width="50"
						alt="repair-logo"
					/>
				}
				Button={
					installedRepair
						? UninstallRepairButton
						: InstallRepairButton
				}
			/>
			<ServiceInterworkDetailContent
				imgSrcList={[
					[
						ImgServiceInterworkRepairSample1,
						ImgServiceInterworkRepairSample1,
					],
					[
						ImgServiceInterworkRepairSample2,
						ImgServiceInterworkRepairSample2,
					],
				]}>
				<>
					<Typography variant="h3">
						수선신청 관리로 고객에게 편안한 사후 관리를 제공해보세요
					</Typography>
					<Typography>
						기존에 수선신청은 어떻게 관리하셨나요? 고객센터로
						전화문의, 문의 게시판에 게시글, 1:1 채팅 등 많은 경로로
						접수되고 있던 수선 요청을 한 곳에서 신청하고 관리할 수
						있습니다.
					</Typography>
					<Typography>
						고객은 발급된 개런티 상세 화면에서 바로 수선 신청이
						가능합니다.
						<br />
						개런티에 상품정보가 모두 저장되어 있어 간편하게 신청할
						수 있어요.
					</Typography>
					<Typography>
						브랜드(기업)에서는 <b>[수선신청 관리]</b> 신규 메뉴
						탭에서 접수된 수선신청 내역을 확인할 수 있습니다.
						<br />
						화면에서 바로 &nbsp;
						<b>‘수선취소', ‘수선완료'</b>로 진행 상황을 변경할 수도
						있어요!
					</Typography>
					<Typography variant="h4">서비스 사용방법</Typography>
					<Typography>
						1. 수선신청 관리 “연동하기" 버튼을 클릭하세요.
						<br />
						2. 고객이 보는 수선신청 화면에 표시되는 “A/S 주의사항"
						내용을 작성해주세요. (개런티 설정에서 편집 가능)
						<br />
						3. 기존에 발급된 개런티와 새로 발급할 개런티에 모두
						“수선신청" 버튼이 표시됩니다.
						<br />
						4. 고객은 사진과 요청사항을 입력하고 신청하면, [수선
						신청 관리] 목록에서 신청 건을 확인할 수 있습니다.
						<br />
						5. 자세한 수선신청 문의는 고객과 연락해서 진행하면
						됩니다.
					</Typography>
				</>
			</ServiceInterworkDetailContent>
		</Stack>
	);
}

export default ServiceInterworkRepair;
