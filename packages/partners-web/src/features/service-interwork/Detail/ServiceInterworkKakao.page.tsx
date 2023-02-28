import {useState, useEffect, useMemo} from 'react';
import {useMutation, useQueryClient} from '@tanstack/react-query';

import {Stack, Typography} from '@mui/material';

import {
	useGetPartnershipInfo,
	useMessageDialog,
	useGlobalLoading,
	useModalStore,
} from '@/stores';

import {phoneNumberFormat} from '@/utils/regex.util';
import {uninstallServiceInterwork} from '@/api/service-interwork.api';

import {Button, CapsuleButton, InputWithLabel} from '@/components';
import ControlledInputComponent from '@/components/molecules/ControlledInputComponent';

import {
	ImgServiceInterworkKakao,
	ImgServiceInterworkKakao2x,
	ImgServiceInterworkKakaoSample1,
	ImgServiceInterworkKakaoSample2,
	ImgServiceKakaoConnectExample,
} from '@/assets/images';

import ServiceInterworkDetailTitle from '@/features/service-interwork/Detail/common/ServiceInterworkDetailTitle';
import ServiceInterworkDetailContent from '@/features/service-interwork/Detail/common/ServiceInterworkDetailContent';

import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
	handleChangeDataFormat,
	formatPhoneNum,
} from '../../../utils/format.util';
import AtagComponent from '@/components/atoms/AtagComponent';

import {
	verifyKakoNotificationService,
	installKakoNotificationService,
} from '@/api/service-interwork.api';

function ConnectKakaoAlramModalChild({onClose}: {onClose(): () => void}) {
	const queryClient = useQueryClient();
	const {
		handleSubmit,
		control,
		getValues,
		formState: {errors},
		watch,
		setError,
	} = useForm({
		resolver: yupResolver(
			yup.object().shape({
				plusFriendId: yup
					.string()
					.required('카카오 아이디를 입력해주세요'),
				phoneNo: yup.string().required('핸드폰 번호를 입력해주세요'),
				token: yup.string(),
			})
		),
		mode: 'onChange',
	});

	const [hasCode, setHasCode] = useState(false);
	const onOpenMessageDialog = useMessageDialog((state) => state.onOpen);

	const onSubmit = () => {
		const values = getValues();

		if (typeof values?.phoneNo === 'string') {
			if (!phoneNumberFormat.test(values?.phoneNo)) {
				return setError('phoneNo', {
					message: '옳바른 번호를 입력해주세요',
				});
			}
		}

		if (!hasCode) {
			/* 인증하기 버튼 클릭 */
			checkPersonalInfo();
		}
	};

	/* 재전송 이벤트 */
	const requestAgainHandler = () => {
		checkPersonalInfo();
	};

	const kakaoIdChecker = (plusFriendId: string) => {
		let addedAtId = '';

		if (plusFriendId.length > 0) {
			if (plusFriendId[0] !== '@') {
				addedAtId = '@' + plusFriendId;
			} else {
				addedAtId = plusFriendId;
			}
		}

		return addedAtId;
	};

	/* 카톡 아이디, 핸드폰 번호 체크 이벤트 */
	const checkPersonalInfo = async () => {
		const {plusFriendId, phoneNo} = getValues();

		let onlyPhoneNumber = '';

		if (phoneNo.length > 0) {
			onlyPhoneNumber = (phoneNo as string).replace(/-/g, '');
		}

		try {
			const resp = await installKakoNotificationService({
				plusFriendId: kakaoIdChecker(plusFriendId as string),
				phoneNo: onlyPhoneNumber,
			});

			if (resp?.result === 'SUCCESS') {
				if (!hasCode) {
					setHasCode(true);
				}
			}
		} catch (e) {
			return setError('plusFriendId', {
				message: e?.response?.data?.message,
			});
		}
	};

	/* 연동 완료 이벤트 */
	const connectKakaoHandler = async () => {
		const {plusFriendId, token} = getValues();

		try {
			if (token && plusFriendId) {
				const resp = await verifyKakoNotificationService({
					plusFriendId: kakaoIdChecker(plusFriendId as string),
					token,
				});

				if (resp?.result === 'SUCCESS') {
					onClose();

					setTimeout(() => {
						onOpenMessageDialog({
							title: '카카오 알림톡 연동이 완료됐습니다.',
							message: '',
							showBottomCloseButton: true,
							onCloseFunc: () => {
								queryClient.invalidateQueries({
									queryKey: ['partnershipInfo'],
								});
							},
						});
					}, 300);
				} else {
					return setError('token', {
						message: e?.response?.data?.message,
					});
				}
			}
		} catch (e) {
			// console.log('e', e);
			return setError('token', {
				message: e?.response?.data?.message,
			});
		}
	};

	// useEffect(() => {
	// 	console.log('errors', errors);
	// }, [errors]);

	return (
		<form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
			<Stack
				flexDirection={'row'}
				gap="32px"
				mt="10px"
				sx={{position: 'relative'}}>
				<Stack flexBasis={'352px'} sx={{maxWidth: '352px'}} mt="64px">
					<Stack
						flexDirection={'row'}
						gap="8px"
						sx={{
							position: 'absolute',
							top: '0px',
							left: 0,
						}}>
						<AtagComponent
							url="https://business.kakao.com/start"
							target="_blank">
							<CapsuleButton>
								카카오 플러스친구 생성하기
							</CapsuleButton>
						</AtagComponent>

						<AtagComponent
							url="https://guide.vircle.co.kr/kakao-msg"
							target="_blank">
							<CapsuleButton>사용 가이드</CapsuleButton>
						</AtagComponent>
					</Stack>

					<InputWithLabel
						labelTitle={'카카오 플러스 친구 아이디'}
						placeholder={'@ 검색용 ID 입력'}
						inputType="text"
						multiline={false}
						isLast={false}
						control={control}
						name={'plusFriendId'}
						error={errors && errors.plusFriendId}
						fullWidth
						// value={''}
						// required={true}
					/>
					<InputWithLabel
						labelTitle={'관리자 휴대폰 번호'}
						placeholder={'010-1234-5678'}
						inputType="text"
						multiline={false}
						isLast={hasCode ? false : true}
						control={control}
						name={'phoneNo'}
						error={errors && errors.phoneNo}
						fullWidth
						onChange={(e) => {
							e.target.value = handleChangeDataFormat(
								'phoneNum',
								e
							);
						}}
						inputProps={{maxLength: 13}}
						// value={''}
						// required={true}
					/>

					{hasCode && (
						<Stack sx={{position: 'relative'}}>
							<ControlledInputComponent
								type={'text'}
								placeholder={''}
								height="48px"
								maxHeight="auto"
								fullWidth={true}
								autoFocus={true}
								control={control}
								name={'token'}
								error={errors && errors.token}
								inputProps={{maxLength: 6}}
								// error={''}
								// value={''}
								// required = false={''}
								// sx={{}}
								// onChange={''}
							/>
							<Button
								variant="outlined"
								color="primary"
								width="68px"
								onClick={requestAgainHandler}
								sx={{
									margin: 'auto',
									fontSize: '13px',
									padding: '0px !important',
									position: 'absolute',
									right: '8px',
									top: '8px',
									bottom: 'auto',
									height: '32px',
									minHeight: '32px',
								}}>
								재전송
							</Button>
						</Stack>
					)}

					{hasCode && (
						<Button
							variant="contained"
							color="primary"
							width="92px"
							sx={{
								marginLeft: 'auto',
								marginTop: '24px',
								padding: '0px !important',
							}}
							disabled={
								watch()?.token?.length >= 6 ? false : true
							}
							onClick={connectKakaoHandler}>
							연동 완료
						</Button>
					)}

					{!hasCode && (
						<Button
							variant="contained"
							color="primary"
							width="92px"
							type="submit"
							sx={{
								marginLeft: 'auto',
								marginTop: '24px',
							}}
							disabled={
								watch()?.phoneNo?.length >= 13 &&
								watch()?.plusFriendId
									? false
									: true
							}>
							인증하기
						</Button>
					)}
				</Stack>

				<Stack flexBasis={'352px'} sx={{maxWidth: '352px'}} mt="64px">
					<Typography
						mb={'8px'}
						color="primary"
						sx={{fontSize: '14px', fontWeight: 700}}>
						알림톡 연동하면, 브랜드가 노출돼요!
					</Typography>
					<Stack
						sx={{
							width: '100%',
							height: '303px',
							backgroundColor: 'grey.50',
							borderRadius: '8px',
						}}
						mb={'24px'}>
						<img
							src={ImgServiceKakaoConnectExample}
							alt="connect-kakao-example"
							style={{
								width: '100%',
								height: '100%',
							}}
						/>
					</Stack>
					<Typography
						mb={'6px'}
						sx={{fontSize: '14px', fontWeight: 700}}>
						브랜드 플러스친구 계정으로 알림톡이 발송됩니다.
					</Typography>
					<Typography
						sx={{
							fontSize: '14px',
							fontWeight: 500,
							color: 'grey.500',
						}}>
						알림톡을 연동하면 기존 버클 카카오 계정으로 발송되던
						알림톡이 고객에게 익숙한 브랜드 플러스친구 계정으로
						발송됩니다.
					</Typography>
				</Stack>
			</Stack>
		</form>
	);
}

function ServiceInterworkKakao() {
	const queryClient = useQueryClient();
	const setIsLoading = useGlobalLoading((state) => state.setIsLoading);
	const onOpenMessageDialog = useMessageDialog((state) => state.onOpen);
	const {setIsOpen, setModalOption, setCloseAndReset} = useModalStore(
		(state) => state
	);
	const {data: partnershipData, isLoading} = useGetPartnershipInfo();

	const uninstallServiceInterworkMutation = useMutation({
		mutationFn: () => uninstallServiceInterwork('alimtalk-profile'),
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ['partnershipInfo']});
		},
	});

	useEffect(() => {
		const isLoading = uninstallServiceInterworkMutation?.isLoading;
		setIsLoading(isLoading);
	}, [uninstallServiceInterworkMutation?.isLoading, setIsLoading]);

	const installedKakaoAlram =
		partnershipData?.useAlimtalkProfile === 'Y' ? true : false;

	const InstallKakaoButton = useMemo(() => {
		return (
			<Button
				onClick={() => {
					(async () => {
						try {
							setModalOption({
								id: 'connect_kakao_alram',
								isOpen: true,
								title: '카카오 알림톡 연동',
								subtitle:
									'비즈니스 인증을 받은 카카오 계정이 필요해요. 카카오톡 관리자센터에서 신청하세요.',
								children: (
									<ConnectKakaoAlramModalChild
										onClose={setCloseAndReset}
									/>
								),
								buttonTitle: '',
								maxWidth: '800px',
								width: '800px',
								onClickButton: undefined,
								align: 'center',
								titleAlign: 'left',
								customisedButton: null,
								useBackgroundClickClose: false,
								sx: {
									'& .MuiDialog-container': {
										'& .MuiTypography-h6': {
											paddingBottom: '0px',
											marginBottom: '7px',
											'&  .MuiTypography-root': {
												fontSize: '21px',
											},
										},
										'& .MuiPaper-root': {
											'& .MuiDialogContent-root': {
												marginTop: '0px !important',
												paddingTop: '69px !important',
												minHeight: '650px',

												'& .MuiTypography-h6': {
													fontSize: '14px',
													marginBottom: '0px',
												},
											},
										},
									},
								},
							});
						} catch (e) {
							onOpenMessageDialog({
								title: '네트워크 에러',
								message:
									e?.response?.data?.message ||
									'잠시 후 다시 시도해주세요.',
								showBottomCloseButton: true,
							});
						}
					})();
				}}>
				연동하기
			</Button>
		);
	}, [onOpenMessageDialog]);

	const UninstallKakaoButton = useMemo(() => {
		return (
			<Button
				color="grey-100"
				variant="outlined"
				onClick={() => {
					onOpenMessageDialog({
						title: '카카오 알림톡 연동을 해지하시겠습니까?',
						message: (
							<>
								연동해제 시, 개런티 발급 알림톡이 버클 계정으로
								발급됩니다.
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
													queryClient.invalidateQueries(
														{
															queryKey: [
																'partnershipInfo',
															],
														}
													);
												},
											});
										} catch (e) {
											onOpenMessageDialog({
												title: '네트워크 에러',
												message:
													e?.response?.data
														?.message ||
													'잠시 후 다시 시도해주세요.',
												showBottomCloseButton: true,
											});
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
	}, [onOpenMessageDialog, uninstallServiceInterworkMutation]);

	if (isLoading) {
		return <></>;
	}

	return (
		<Stack
			flexDirection="column"
			width="100%"
			maxWidth="800px"
			margin="40px auto 73px">
			<ServiceInterworkDetailTitle
				title="카카오 알림톡"
				subTitle="브랜드 플러스친구 계정으로 개런티 관련 알림톡을 전송하세요."
				titleImgBackgroundColor="#FFFBD9"
				isLinked={installedKakaoAlram}
				TitleImg={
					<img
						src={ImgServiceInterworkKakao}
						srcSet={`${ImgServiceInterworkKakao2x} 2x`}
						width="50"
						alt="repair-logo"
					/>
				}
				Button={
					installedKakaoAlram
						? UninstallKakaoButton
						: InstallKakaoButton
				}
				mb={installedKakaoAlram ? '40px' : '0px'}
			/>

			{partnershipData?.useAlimtalkProfile === 'Y' && (
				<Stack>
					<Stack mb="31px">
						<Typography variant="subtitle1" /* mb="12px" */>
							연동 설정
						</Typography>
					</Stack>

					<Stack>
						<Stack flexDirection={'row'} gap="77px" mb="18px">
							<Typography
								variant="subtitle2"
								fontSize="14px"
								width={'119px'}>
								카카오톡채널 아이디
							</Typography>
							<Typography
								variant="subtitle2"
								fontSize="14px"
								fontWeight={500}>
								{partnershipData?.alimtalkPlusFriendId?.replace(
									/@/,
									''
								)}
							</Typography>
						</Stack>

						<Stack flexDirection={'row'} gap="77px">
							<Typography
								variant="subtitle2"
								fontSize="14px"
								width={'119px'}>
								관리자 휴대폰 번호
							</Typography>
							<Typography
								variant="subtitle2"
								fontSize="14px"
								fontWeight={500}>
								{formatPhoneNum(
									partnershipData?.alimtalkAdminTel
								)}
							</Typography>
						</Stack>
					</Stack>
				</Stack>
			)}

			<ServiceInterworkDetailContent
				mt={'60px'}
				imgSrcList={[
					[
						ImgServiceInterworkKakaoSample2,
						ImgServiceInterworkKakaoSample2,
					],
					[
						ImgServiceInterworkKakaoSample1,
						ImgServiceInterworkKakaoSample1,
					],
				]}>
				<>
					<Typography variant="h3">
						브랜드 플러스친구 계정으로 알림톡 보내기
					</Typography>
					<Typography>
						기본적으로 모든 개런티 발급 관련된 알림톡은 “버클"
						카카오 플러스친구 계정으로 발송됩니다. 알림톡 내용에는
						브랜드명과 상품명이 표시되지만, 알림이 버클로 발송돼서
						고객입장에서는 조금 어색하게 느낄 수 있어요.
					</Typography>
					<Typography>
						카카오 알림톡을 연동하면 자체 브랜드 카카오 플러스친구
						계정으로 알림톡을 발송할 수 있어요.
						<br />
						고객에게 이미 익숙한 브랜드 알림톡으로, 친근하게
						개런티를 발급해보세요.
						<br />
						고객이 개런티를 조회할 확률이 높아져요!
					</Typography>
					<Typography variant="h4">서비스 사용방법</Typography>
					<Typography>
						1. 카카오 알림톡 “연동하기" 버튼을 클릭하세요.
						<br />
						2. 카카오 플러스 친구 아이디와 휴대폰 번호를 입력하고
						인증하면 연동이 완료됩니다.
						<br />
						3. 신규 개런티 발급 알림톡은 브랜드 카카오 플러스
						계정으로 발송됩니다.
					</Typography>
				</>
			</ServiceInterworkDetailContent>
		</Stack>
	);
}

export default ServiceInterworkKakao;
