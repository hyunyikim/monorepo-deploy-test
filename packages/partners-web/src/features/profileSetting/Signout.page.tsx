import React, {useState, useEffect, useRef} from 'react';
import {Stack} from '@mui/system';
import {Typography, List, ListItem, SelectChangeEvent} from '@mui/material';
import {
	Button,
	CapsuleButton,
	InputWithLabel,
	TitleTypography,
	ControlledInputComponent,
	Select,
	Checkbox,
} from '@/components';
import {goToParentUrl, updateParentPartnershipData} from '@/utils';
import {Option} from '@/@types';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {useMessageDialog, useGetPartnershipInfo} from '@/stores';

interface SignoutInfoProps {
	reason: Option;
	isChecked: boolean;
}

function Signout() {
	const {
		handleSubmit,
		watch,
		setError,
		control,
		reset,
		getValues,
		formState: {errors},
	} = useForm({
		resolver: yupResolver(
			yup.object().shape({
				password: yup.string().required('비밀번호를 입력해주세요'),
				reasonText: yup.string(),
			})
		),
		mode: 'onChange',
	});
	const selectRef = useRef<HTMLSelectElement>();
	const onOpenMessageDialog = useMessageDialog((state) => state.onOpen);
	const closeMessageModal = useMessageDialog((state) => state.onClose);
	const {data: partnershipData, isLoading} = useGetPartnershipInfo();

	const [signoutInfo, setSignoutInfo] = useState<SignoutInfoProps>({
		reason: {
			name: '',
			label: '',
			value: '',
		},
		isChecked: false,
	});
	const [isChecked, setIsChecked] = useState<boolean>(false);
	const [isButtonActivated, setIsButtonActivated] = useState<boolean>(false);
	const [isCancelButtonActivated, setIiCancelButtonActivated] =
		useState<boolean>(false);

	// temp data - 회원탈퇴 상태
	const [isSignedout, setIsSignedout] = useState<boolean>(false);

	const listArr = [
		'회원 탈퇴 시, 고객님의 가입 정보, 등록한 상품정보는 모두 삭제됩니다.',
		'고객에게 발급한 디지털 개런티는 삭제되지 않습니다. 개런티 고객 정보도 삭제되지 않습니다.',
		'탈퇴 후, 발급한 디지털 개런티 조회 및 발급 취소 처리가 불가합니다.',
		'탈퇴 처리된 이메일로 재 가입 방지를 위해, 회원 탈퇴 후 30일간 재가입이 불가능합니다.',
		'카페24 주문연동한 계정일 경우, 탈퇴 이전에 카페24 관리자 어드민에서 버클 앱을 삭제해주세요.',
		'유료플랜 구독 중 회원 탈퇴를 한 경우, 서비스이용량을 판단해 전액환불 혹은 부분환불을 진행해드립니다.환불과 관련된 자세한 내용은 [구독가이드]의 [환불 프로세스]를 참고해주세요.',
		' 탈퇴요청 시 24시간동안 데이터가 보관되며, 24시간내에 탈퇴를 철회하실 수 있습니다.',
	];

	const selectOpt = [
		'사용해보니 버클을 계속 사용할 의사가 없어서',
		'디지털 개런티의 필요성을 딱히 느끼지 못해서',
		'사용해보니 유료플랜의 가격이 부담되서',
		'직접입력',
	];

	const onSubmit = () => {
		const values = getValues();
		const {
			reason: {value, name},
		} = signoutInfo;

		/* TODO: 
            1. 탈퇴하기 눌렀을때, 비밀번호 체크 
            setError('password', {
				message: '비밀번호를 다시 입력해주세요.',
			});
        */

		if (!isSignedout) {
			openConfirmModal();
		} else {
			/* TODO: 
                2. 탈퇴 철회하기 
                먼저 요청 보내고, 요청 성공시 아래 모달 오픈하기
            */
			openCancelSignouConfirmModal();
		}
	};

	const submitSignoutData = async () => {
		const values = getValues();
		const {
			reason: {value, name},
		} = signoutInfo;

		closeMessageModal();
		// goToParentUrl('/');
		updateParentPartnershipData();
	};

	const openConfirmModal = () => {
		onOpenMessageDialog({
			title: '정말 탈퇴하시겠습니까?',
			message:
				'탈퇴하실 경우, 현재 서비스에서 진행중인 모든 항목들은 취소됩니다. 단, 24시간내에 탈퇴를 철회하실 수 있습니다.',
			buttons: (
				<Stack flexDirection={'row'} gap="8px">
					<Button
						variant="outlined"
						color="black"
						onClick={closeMessageModal}>
						취소
					</Button>
					<Button color="black" onClick={submitSignoutData}>
						확인
					</Button>
				</Stack>
			),
			disableClickBackground: true,
		});
	};
	const openCancelSignouConfirmModal = () => {
		onOpenMessageDialog({
			title: '버클 탈퇴 요청이 철회되었습니다.',
			message:
				'회원탈퇴 요청 후 보관중 이었던 데이터는 정상화 되었습니다.',
			closeButtonValue: '확인',
			showBottomCloseButton: true,
			disableClickBackground: true,
		});
	};

	const selectHandler = (e: SelectChangeEvent<unknown>) => {
		const targetVal = e.target;

		setSignoutInfo((pre) => {
			return {
				...pre,
				reason: {
					...pre.reason,
					value: targetVal.value,
				},
			};
		});
	};

	const buttonActivator = () => {
		const values = getValues();
		if (values.password && signoutInfo.reason.value && isChecked) {
			if (signoutInfo.reason.value === '직접입력') {
				if (values.reasonText) {
					return setIsButtonActivated(true);
				} else {
					return setIsButtonActivated(false);
				}
			} else {
				return setIsButtonActivated(true);
			}
		}

		return setIsButtonActivated(false);
	};
	const cancelButtonActivator = () => {
		const values = getValues();
		if (values.password) {
			return setIiCancelButtonActivated(true);
		}

		return setIiCancelButtonActivated(false);
	};

	useEffect(() => {
		buttonActivator();
		cancelButtonActivator();
		// console.log('watch', watch());
		// console.log('signoutInfo', signoutInfo);
	}, [signoutInfo, isChecked, watch()]);

	useEffect(() => {
		console.log('partnershipData', partnershipData);
	}, [partnershipData]);

	return (
		<Stack
			sx={{
				gap: '40px',
				maxWidth: '800px',
				margin: '40px auto 130px auto',
			}}>
			{!isSignedout ? (
				<form onSubmit={handleSubmit(onSubmit)}>
					<TitleTypography title="회원 탈퇴" />
					<Stack
						sx={{
							border: '1px solid #E2E2E9',
							borderRadius: '16px',
							padding: '32px',
							gap: '27px',
						}}>
						<Stack>
							<Typography
								variant="subtitle1"
								sx={{
									marginBottom: '15px',
								}}>
								버클을 탈퇴하시나요?
							</Typography>
							<Typography variant="body1">
								고객님께서 회원 탈퇴를 원하신다니 저희 서비스가
								많이 부족하고 미흡했나 봅니다.
								<br /> 서비스를 이용하면서 불편했던 점이나
								보완할 수 있는 방안을 알려주시면 서비스 개선에
								적극적으로 반영하도록 하겠습니다.
							</Typography>
						</Stack>

						<Stack>
							<Typography
								variant="body3"
								sx={{
									color: 'grey.900',
									marginBottom: '8px',
									fontWeight: 700,
								}}>
								유의사항
							</Typography>

							<List
								sx={{
									padding: '0px 24px',
									margin: 0,
								}}>
								{listArr.map((li, idx) =>
									idx === 6 ? (
										<ListItem
											sx={{
												fontSize: '16px',
												fontWeight: 700,
												color: 'grey.500',
												display: 'list-item',
												listStyle: 'disc',
												padding: 0,
												lineHeight: '23px',
											}}
											key={`signout-notice-list-${idx}`}>
											{li}
										</ListItem>
									) : (
										<ListItem
											sx={{
												fontSize: '16px',
												fontWeight: 500,
												color: 'grey.500',
												display: 'list-item',
												listStyle: 'disc',
												padding: 0,
												lineHeight: '23px',
											}}
											key={`signout-notice-list-${idx}`}>
											{li}
										</ListItem>
									)
								)}
							</List>
						</Stack>

						<Stack>
							<Typography
								variant="body3"
								sx={{
									color: 'grey.900',
									fontWeight: 700,
									fontSize: '14px',
									lineHeight: '20px',
									marginBottom: '8px',
								}}>
								탈퇴하시는 이유를 선택해주세요
							</Typography>

							<Stack
								sx={{
									flexDirection: 'row',
									gap: '24px',

									'& .MuiFormControl-root': {
										maxWidth: '356px',
										flexBasis: '50%',
									},
									'& .MuiGrid-root': {
										maxWidth: '356px',
										flexBasis: '50%',
									},
								}}>
								<Select
									ref={selectRef}
									width="auto"
									options={selectOpt.map((item) => ({
										label: item,
										value: item,
									}))}
									value={signoutInfo.reason.value}
									placeholder="선택해주세요"
									onChange={selectHandler}
								/>

								{signoutInfo.reason.value &&
									signoutInfo.reason.value === '직접입력' && (
										<ControlledInputComponent
											type="text"
											name="reasonText"
											control={control}
											placeholder="탈퇴이유를 입력해주세요"
											fullWidth={false}
											required={false}
										/>
									)}
							</Stack>
						</Stack>

						<Stack
							sx={{
								'& .MuiGrid-root': {
									flexDirection: 'column',
									'& .MuiGrid-root': {
										maxWidth: '356px',
										flexBasis: '50%',
									},
								},
							}}>
							<InputWithLabel
								required={false}
								labelTitle={'비밀번호 입력'}
								placeholder={'현재 비밀번호를 입력해주세요'}
								inputType="password"
								isLast={true}
								control={control}
								name={'password'}
								error={errors && errors.password}
								sx={{
									maxWidth: '356px',
								}}
								fullWidth={false}
							/>
						</Stack>

						<Stack mb="7px" flexDirection={'row'} gap="8px">
							<Checkbox
								name="checked"
								onChange={(e) => {
									setIsChecked(e?.target?.checked);
								}}
							/>
							<Typography
								sx={{
									color: 'grey.900',
									fontWeight: 500,
									fontSize: '14px',
									lineHeight: '20px',
								}}>
								유의사항을 모두 확인하였으면, 회원 탈퇴합니다.
							</Typography>
						</Stack>

						<Button
							color="primary"
							width="116px"
							height={48}
							disabled={!isButtonActivated}
							type="submit">
							탈퇴하기
						</Button>
					</Stack>
				</form>
			) : (
				<form onSubmit={handleSubmit(onSubmit)}>
					<TitleTypography title="회원 탈퇴" />
					<Stack
						sx={{
							border: '1px solid #E2E2E9',
							borderRadius: '16px',
							padding: '32px',
							gap: '27px',
						}}>
						<Stack>
							<Typography
								variant="subtitle1"
								sx={{
									marginBottom: '15px',
								}}>
								버클 탈퇴 요청이 완료되었습니다.
							</Typography>
							<Typography variant="body1">
								고객님께서 요청하신 회원탈퇴가 접수되었습니다.
								요청하신 시점 부터 24시간동안 데이터가 보관되며,
								24시간 내에 탈퇴를 철회하실 수 있습니다. (단,
								24시간 후에는 모든 데이터가 삭제되며 탈퇴 철회가
								불가능 합니다.)
							</Typography>
						</Stack>

						<Stack>
							<Typography
								variant="body3"
								sx={{
									color: 'grey.900',
									marginBottom: '8px',
									fontWeight: 700,
								}}>
								유의사항
							</Typography>

							<List
								sx={{
									padding: '0px 24px',
									margin: 0,
								}}>
								{listArr.map((li, idx) =>
									idx === 6 ? (
										<ListItem
											sx={{
												fontSize: '16px',
												fontWeight: 700,
												color: 'grey.500',
												display: 'list-item',
												listStyle: 'disc',
												padding: 0,
												lineHeight: '23px',
											}}
											key={`signout-notice-list-${idx}`}>
											{li}
										</ListItem>
									) : (
										<ListItem
											sx={{
												fontSize: '16px',
												fontWeight: 500,
												color: 'grey.500',
												display: 'list-item',
												listStyle: 'disc',
												padding: 0,
												lineHeight: '23px',
											}}
											key={`signout-notice-list-${idx}`}>
											{li}
										</ListItem>
									)
								)}
							</List>
						</Stack>

						<Stack
							sx={{
								'& .MuiGrid-root': {
									flexDirection: 'column',
									'& .MuiGrid-root': {
										maxWidth: '356px',
										flexBasis: '50%',
									},
								},
							}}>
							<InputWithLabel
								required={false}
								labelTitle={'비밀번호 입력'}
								placeholder={'현재 비밀번호를 입력해주세요'}
								inputType="password"
								isLast={true}
								control={control}
								name={'password'}
								error={errors && errors.password}
								sx={{
									maxWidth: '356px',
								}}
								fullWidth={false}
							/>
						</Stack>

						<Button
							color="primary"
							width="145px"
							height={48}
							disabled={!isCancelButtonActivated}
							type="submit">
							탈퇴 철회하기
						</Button>
					</Stack>
				</form>
			)}
		</Stack>
	);
}

export default Signout;
