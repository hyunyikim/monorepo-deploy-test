import React, {useState, useEffect} from 'react';
import {Stack} from '@mui/system';
import {Typography, List, ListItem} from '@mui/material';
import {
	Button,
	InputWithLabel,
	TitleTypography,
	ControlledInputComponent,
} from '@/components';
import {goToParentUrl, updateParentPartnershipData} from '@/utils';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {useMessageDialog, useGetPartnershipInfo} from '@/stores';
import {cancleRequestSignout} from '@/api/auth.api';

function Signedout() {
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
			})
		),
		mode: 'onChange',
	});
	const onOpenMessageDialog = useMessageDialog((state) => state.onOpen);
	const closeMessageModal = useMessageDialog((state) => state.onClose);
	const {data: partnershipData, isLoading} = useGetPartnershipInfo();
	const [isCancelButtonActivated, setIiCancelButtonActivated] =
		useState<boolean>(false);

	const listArr = [
		'회원 탈퇴 시, 고객님의 가입 정보, 등록한 상품정보는 모두 삭제됩니다.',
		'고객에게 발급한 디지털 개런티는 삭제되지 않습니다. 개런티 고객 정보도 삭제되지 않습니다.',
		'탈퇴 후, 발급한 디지털 개런티 조회 및 발급 취소 처리가 불가합니다.',
		'탈퇴 처리된 이메일로 재 가입 방지를 위해, 회원 탈퇴 후 30일간 재가입이 불가능합니다.',
		'카페24 주문연동한 계정일 경우, 탈퇴 이전에 카페24 관리자 어드민에서 버클 앱을 삭제해주세요.',
		<>
			유료플랜 구독 중 회원 탈퇴를 한 경우, 서비스이용량을 판단해 전액환불
			혹은 부분환불을 진행해드립니다. <br />
			환불과 관련된 자세한 내용은 [구독가이드]의 [환불 프로세스]를
			참고해주세요.
		</>,
		' 탈퇴요청 시 24시간동안 데이터가 보관되며, 24시간내에 탈퇴를 철회하실 수 있습니다.',
	];

	const selectOpt = [
		'사용해보니 버클을 계속 사용할 의사가 없어서',
		'디지털 개런티의 필요성을 딱히 느끼지 못해서',
		'사용해보니 유료플랜의 가격이 부담되서',
		'직접입력',
	];

	const onSubmit = async () => {
		const {password} = getValues();

		try {
			const cancelSignoutRes = await cancleRequestSignout({password});
			if (cancelSignoutRes && cancelSignoutRes.result === 'SUCCESS') {
				openCancelSignouConfirmModal();
			}
		} catch (e) {
			setError('password', {
				message: String(e.response.data.message),
			});
		}
	};

	const openCancelSignouConfirmModal = () => {
		onOpenMessageDialog({
			title: '버클 탈퇴 요청이 철회되었습니다.',
			message:
				'회원탈퇴 요청 후 보관중 이었던 데이터는 정상화 되었습니다.',
			closeButtonValue: '확인',
			showBottomCloseButton: true,
			disableClickBackground: true,
			onCloseFunc: confirmCancleSignoutHandler,
		});
	};

	const confirmCancleSignoutHandler = () => {
		updateParentPartnershipData();
		// setTimeout(() => {
		// 	goToParentUrl('/dashboard');
		// }, 300);
	};

	const cancelButtonActivator = () => {
		const values = getValues();
		if (values.password) {
			return setIiCancelButtonActivated(true);
		}

		return setIiCancelButtonActivated(false);
	};

	useEffect(() => {
		cancelButtonActivator();
		// console.log('watch', watch());
	}, [watch()]);

	useEffect(() => {
		if (partnershipData) {
			const hasLeft = partnershipData.isLeaved;

			if (hasLeft === 'N') {
				goToParentUrl('/dashboard');
				return;
			}
		}
	}, [partnershipData]);

	return (
		<Stack
			sx={{
				gap: '40px',
				maxWidth: '800px',
				margin: '40px auto 130px auto',
			}}>
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
							24시간 내에 탈퇴를 철회하실 수 있습니다. (단, 24시간
							후에는 모든 데이터가 삭제되며 탈퇴 철회가 불가능
							합니다.)
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
							type="password"
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
		</Stack>
	);
}

export default Signedout;
