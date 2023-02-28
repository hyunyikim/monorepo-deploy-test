import {Button} from '@/components';
import {Typography} from '@mui/material';
import {Stack, Box} from '@mui/system';
import React, {useEffect, useState} from 'react';
import SectionBox from './common/SectionBox';
import {goToParentUrl, sendAmplitudeLog} from '@/utils';
import {
	imgDashboardSettingGuarantee,
	imgDashboardSettingKakao,
	imgDashboardSettingCafe24,
} from '@/assets/images';
import {IcClose, icGreenTick} from '@/assets/icon';
import {PartnershipInfoResponse} from '@/@types';
import {useCafe24GetInterworkByToken} from '@/stores';
import {sub, differenceInDays, format} from 'date-fns';

function DashboardSettingHelper({
	partnershipData,
}: {
	partnershipData: PartnershipInfoResponse;
}) {
	const [stepState, setStepState] = useState<number>(0);
	const [showSettingHelper, setShowSettingHelper] = useState<boolean>(false);
	const {data: cafe24Interwork, isLoading} = useCafe24GetInterworkByToken();
	const closedHelper = localStorage.getItem(
		`no_helper_${String(partnershipData?.brand?.idx)}`
	);

	const closedHelperDate = localStorage.getItem(
		`no_helper_for_5days_${String(partnershipData?.brand?.idx)}`
	);

	const settingHelperHandler = () => {
		/* 알림톡, 개런티 설정, 카페24을 모두 연동한 경우 */
		if (
			partnershipData?.profileImage &&
			partnershipData?.useAlimtalkProfile === 'Y' &&
			cafe24Interwork
		) {
			setShowSettingHelper(false);
			return;
		}

		/* 5일 이후에도 안보기 버튼을 눌렀을 경우 */
		if (closedHelper && closedHelper === 'true') {
			return setShowSettingHelper(false);
		}

		/* 5일 안보기 버튼을 눌렀을 경우 */
		if (closedHelperDate) {
			const passedDays = differenceInDays(
				new Date(),
				new Date(closedHelperDate)
			);

			if (Math.abs(passedDays) >= 5) {
				return setShowSettingHelper(true);
			} else {
				return setShowSettingHelper(false);
			}
		}

		return setShowSettingHelper(true);
	};

	const stepList = [
		{
			stepTitle: '개런티 설정하기',
			descTitle: '개런티 카드를 설정해주세요!',
			descSubtitle:
				'딱! 한번만 정보를 입력하면 모든게 자동으로 발급될 수 있어요.',
			img: imgDashboardSettingGuarantee,
			buttonText: '개런티 설정하기',
			url: '/setup/guarantee',
			taxoInfo: {
				eventName: `dashboard_setting_banner_guarantee_click`,
				eventProperty: `개런티 설정으로 이동`,
			},
			isCompleted: partnershipData?.profileImage,
		},
		{
			stepTitle: '카카오 알림톡 연동하기',
			descTitle:
				'카톡연동은 필수! 브랜드의 이름으로 디지털 보증서를 발행해 보세요!',
			descSubtitle:
				'보증서에 관한 모든 알림이 브랜드의 카카오톡으로 발송됩니다.',
			img: imgDashboardSettingKakao,
			buttonText: '카카오 알림톡 연동하기',
			url: '/b2b/interwork/kakao',
			taxoInfo: {
				eventName: `dashboard_setting_banner_kakao_click`,
				eventProperty: `서비스 연동관리>카카오 알림톡 상세로 이동`,
			},
			isCompleted: partnershipData?.useAlimtalkProfile === 'Y',
		},
		{
			stepTitle: '카페24 주문 연동하기',
			descTitle: '최소 1분 컷! 자사몰 연동하면 모든게 자동!',
			descSubtitle:
				'자사몰이 카페24라면 지금 바로 무료로 연동하고 마우스에서 손떼셔도 됩니다!',
			img: imgDashboardSettingCafe24,
			buttonText: '카페24 연동하기',
			url: '/b2b/interwork/cafe24',
			taxoInfo: {
				eventName: `dashboard_setting_banner_cafe24_click`,
				eventProperty: `서비스 연동관리>카페24 상세로 이동`,
			},
			isCompleted: cafe24Interwork,
		},
	];

	const stepHandler = (_step: number) => {
		setStepState(_step);
	};

	const moveToPage = (
		_url: string,
		taxoInfo: {eventName: string; eventProperty: string}
	) => {
		const {eventName, eventProperty} = taxoInfo;
		sendAmplitudeLog(eventName, {button_title: eventProperty});
		goToParentUrl(_url);
	};

	const closeHelper = () => {
		sendAmplitudeLog('dashboard_setting_banner_close_click', {
			button_title: '팝업 닫힘',
		});
		setShowSettingHelper(false);

		if (!closedHelper) {
			if (closedHelperDate) {
				localStorage.removeItem(
					`no_helper_for_5days_${String(partnershipData?.brand?.idx)}`
				);
				localStorage.setItem(
					`no_helper_${String(partnershipData?.brand?.idx)}`,
					'true'
				);
			} else {
				localStorage.setItem(
					`no_helper_for_5days_${String(
						partnershipData?.brand?.idx
					)}`,
					new Date()
				);
			}
		}
	};

	useEffect(() => {
		stepList.forEach((step, idx) => {
			if (step.isCompleted) {
				return;
			} else {
				return setStepState(idx);
			}
		});
	}, []);

	useEffect(() => {
		settingHelperHandler();
	}, [partnershipData, closedHelper, closedHelperDate]);

	return (
		showSettingHelper && (
			<Stack
				sx={{maxWidth: '1200px', width: '100%', margin: '0 auto 60px'}}>
				<Typography
					variant="h2"
					sx={{
						fontWeight: 700,
						fontSize: '28px',
						lineHeight: '145%',
						color: 'grey.900',
						marginBottom: '12px',
					}}>
					{partnershipData?.companyName}님, 반갑습니다!
				</Typography>
				<Typography
					variant="h6"
					sx={{
						fontWeight: 400,
						fontSize: '15px',
						lineHeight: '145%',
						color: 'grey.600',
						marginBottom: '32px',
					}}>
					버클, 디지털 개런티 서비스에 오신걸 환영합니다.
				</Typography>

				<SectionBox sx={{minHeight: '100%'}}>
					<Stack
						flexDirection={'row'}
						justifyContent={'space-between'}>
						<Typography
							variant="h2"
							sx={{
								fontWeight: 700,
								fontSize: '18px',
								lineHeight: '145%',
								color: 'grey.900',
								marginBottom: '16px',
							}}>
							시작하기
						</Typography>

						{stepState !== 0 && partnershipData?.profileImage && (
							<IcClose onClick={closeHelper} />
						)}
					</Stack>

					<Stack flexDirection={'row'} gap="40px">
						<Stack sx={{minWidth: '320px', gap: '8px'}}>
							{stepList.map(({stepTitle, isCompleted}, idx) => (
								<Stack
									flexDirection={'row'}
									gap="10px"
									alignItems={'center'}
									onClick={() => {
										if (!isCompleted) {
											stepHandler(idx);
										}
										return;
									}}
									sx={{
										height: '60px',
										padding: '14px 16px',
										borderRadius: '8px',
										cursor: 'pointer',

										backgroundColor:
											stepState === idx
												? 'grey.50'
												: 'transparent',
										'&:hover': {
											backgroundColor:
												stepState !== idx
													? ' #F6F8FF'
													: 'grey.50',
										},
									}}>
									{isCompleted ? (
										<Box
											sx={{
												borderRadius: '50%',
												minWidth: '32px',
												minHeight: '32px',
												maxWidth: '32px',
												maxHeight: '32px',
												img: {
													minWidth: '32px',
													minHeight: '32px',
													maxWidth: '32px',
													maxHeight: '32px',
												},
											}}>
											<img
												src={icGreenTick}
												alt="complete icon"
											/>
										</Box>
									) : (
										<Box
											sx={{
												borderRadius: '50%',
												minWidth: '32px',
												minHeight: '32px',
												maxWidth: '32px',
												maxHeight: '32px',
												fontSize: '16px',
												textAlign: 'center',
												lineHeight: '32px',
												fontWeight: 500,
												backgroundColor:
													stepState === idx
														? 'primary.main'
														: 'primary.50',
												color:
													stepState === idx
														? '#FFFFFF'
														: 'primary.main',
											}}>
											{idx + 1}
										</Box>
									)}

									<Typography
										variant="h4"
										sx={{
											fontWeight: 500,
											fontSize: '16px',
											lineHeight: '145%',
											color: 'grey.900',
										}}>
										{stepTitle}
									</Typography>

									{isCompleted && (
										<Box
											sx={{
												fontWeight: 700,
												fontSize: '11px',
												lineHeight: '',
												color: '#00C29F',
												padding: '2px 5px',
												gap: '10px',
												width: '31px',
												height: '20px',
												background: '#EDF9F7',
												borderRadius: '4px',
											}}>
											완료
										</Box>
									)}
								</Stack>
							))}
						</Stack>

						<Stack
							flexDirection={'row'}
							alignItems="flex-end"
							justifyContent={'space-between'}
							sx={{
								border: '1px solid #E2E2E9',
								borderRadius: '8px',
								width: '100%',
								padding: '24px',
								paddingRight: '32px',
							}}>
							{stepList.map(
								(
									{
										descTitle,
										descSubtitle,
										img,
										buttonText,
										url,
										taxoInfo,
									},
									idx
								) =>
									stepState === idx && (
										<>
											<Stack>
												<Typography
													variant="h3"
													sx={{
														fontWeight: 700,
														fontSize: '16px',
														lineHeight: '145%',
														color: 'grey.900',
														marginBottom: '8px',
													}}>
													{descTitle}
												</Typography>
												<Typography
													variant="h3"
													sx={{
														fontWeight: 500,
														fontSize: '14px',
														lineHeight: '145%',
														color: 'grey.500',
														marginBottom: '65px',
													}}>
													{descSubtitle}
												</Typography>

												<Button
													color="primary"
													variant="contained"
													height={32}
													onClick={() =>
														moveToPage(
															url,
															taxoInfo
														)
													}
													sx={{
														fontWeight: 700,
														fontSize: '13px',
														lineHeight: '20px',
														color: '#FFFFFF',
													}}>
													{buttonText}
												</Button>
											</Stack>
											<Stack
												sx={{
													img: {
														width: '210px',
														height: '148px',
													},
												}}>
												<img
													src={img}
													alt="setting-service"
												/>
											</Stack>
										</>
									)
							)}
						</Stack>
					</Stack>
				</SectionBox>
			</Stack>
		)
	);
}

export default DashboardSettingHelper;
