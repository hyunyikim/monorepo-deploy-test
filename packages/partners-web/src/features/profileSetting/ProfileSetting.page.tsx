import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

import {Stack} from '@mui/system';
import {Typography, Grid} from '@mui/material';
import {
	Button,
	CapsuleButton,
	InputWithLabel,
	TitleTypography,
} from '@/components';
import {profileSettingSchemaShape} from '@/utils/schema';

import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import FixedBottomNavBar from '@/components/atoms/FixedBottomNavBar';

import {useMessageDialog, useGetPartnershipInfo} from '@/stores';

import {changePassword, changeProfileInfo} from '@/api/auth.api';
import {
	handleChangeDataFormat,
	formatPhoneNum,
	formatBusinessNum,
} from '@/utils';
import {useQueryClient} from '@tanstack/react-query';

function ProfileSetting() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const {
		handleSubmit,
		watch,
		setError,
		clearErrors,
		control,
		reset,
		getValues,
		formState: {errors},
	} = useForm({
		resolver: yupResolver(profileSettingSchemaShape),
		mode: 'onChange',
	});
	const {data} = useGetPartnershipInfo();
	const onMessageDialogOpen = useMessageDialog((state) => state.onOpen);

	const basicInfoInputList = [
		{
			title: '회사명',
			placeholder: '회사명을 입력해주세요.',
			readOnly: false,
			type: 'text',
			name: 'companyName',
		},
		{
			title: '사업자등록번호',
			placeholder: '사업자등록번호를 입력해주세요.',
			readOnly: false,
			type: 'text',
			name: 'businessNum',
			inputProps: {
				maxLength: 12,
			},
		},
		{
			title: '휴대전화번호',
			placeholder: '담당자 연락처를 입력해주세요.',
			readOnly: false,
			type: 'text',
			name: 'phoneNum',
			inputProps: {
				maxLength: 13,
			},
		},
		{
			title: '담당자 이름',
			placeholder: '담당자 이름을 입력해주세요',
			readOnly: false,
			type: 'text',
			name: 'name',
		},
	];

	const goToSignoutPage = () => {
		navigate('/setting/signout');
	};

	/**
	 * Form Data 생성하기
	 *
	 * @returns {FormData}
	 */
	const handleFormData = () => {
		const basicInfoFormData = new FormData();
		const passwordData = {
			curPassword: '',
			newPassword: '',
		};
		const passwordInputNameList = [
			'passwordConfirm',
			'newPassword',
			'currentPassword',
		];

		const values = getValues();

		/* password FormData */
		if (
			values.currentPassword &&
			values.newPassword &&
			values.passwordConfirm
		) {
			passwordData.curPassword = values.currentPassword;
			passwordData.newPassword = values.newPassword;
		}

		Object.keys(values).forEach((key: string) => {
			if (!passwordInputNameList.includes(key)) {
				if (values[key]) {
					// if (key === 'name') {
					// 	return;
					// } else
					if (key === 'phoneNum' || key === 'businessNum') {
						const result = (values[key] as string).replace(
							/\-/g,
							''
						);
						basicInfoFormData.append(key, result);
					} else {
						basicInfoFormData.append(key, values[key] as string);
					}
				} else {
					basicInfoFormData.append(key, '');
				}
			}
		});

		return {
			password: passwordData,
			basicInfo: basicInfoFormData,
		};
	};

	const passwordErrorHandler = () => {
		const {currentPassword, newPassword, passwordConfirm} = getValues();

		if (currentPassword === newPassword && newPassword !== '') {
			setError(
				'newPassword',
				{
					type: 'required',
					message: '현재 비밀번호와 새 비밀번호가 같습니다.',
				},
				{shouldFocus: true}
			);
			return false;
		}

		if (currentPassword) {
			/* 현재 비밀번호만 입력하고 신규번호를 입력하지 않았을때 */
			if (!newPassword && !passwordConfirm) {
				setError(
					'newPassword',
					{
						type: 'required',
						message: '새 비밀번호를 입력하지 않았습니다.',
					},
					{shouldFocus: true}
				);
				setError(
					'passwordConfirm',
					{
						type: 'required',
						message: '새 비밀번호를 입력하지 않았습니다.',
					},
					{shouldFocus: true}
				);
				return false;
			} else if (!newPassword) {
				setError(
					'newPassword',
					{
						type: 'required',
						message: '새 비밀번호를 입력하지 않았습니다.',
					},
					{shouldFocus: true}
				);
				return false;
			} else if (!passwordConfirm) {
				setError(
					'passwordConfirm',
					{
						type: 'required',
						message: '새 비밀번호를 입력하지 않았습니다.',
					},
					{shouldFocus: true}
				);
				return false;
			}

			/* 새로운 비밀번호랑 비밀번호 확인이 같지 않으면 에러 */
			if (passwordConfirm && newPassword) {
				if (passwordConfirm !== newPassword) {
					setError(
						'passwordConfirm',
						{
							type: 'matches',
							message: '새 비밀번호가 일치하지 않습니다.',
						},
						{shouldFocus: true}
					);
					return false;
				}
			}
		} else if (!currentPassword && (newPassword || passwordConfirm)) {
			/* 현재 비밀번호만 입력 '안'하고 신규번호만 입력했을때 */
			setError(
				'currentPassword',
				{
					type: 'required',
					message: '현재 비밀번호를 입력하지 않았습니다.',
				},
				{shouldFocus: true}
			);

			if (!passwordConfirm) {
				setError(
					'passwordConfirm',
					{
						type: 'required',
						message: '새 비밀번호를 입력하지 않았습니다.',
					},
					{shouldFocus: true}
				);
				return false;
			} else if (!newPassword) {
				setError(
					'newPassword',
					{
						type: 'required',
						message: '새 비밀번호를 입력하지 않았습니다.',
					},
					{shouldFocus: true}
				);
				return false;
			}

			return false;
		}

		return true;
	};

	const onSubmit: () => Promise<void> = async () => {
		/* 로고 등록 안할시 에러표시 */
		const values = getValues();
		passwordErrorHandler();

		if (passwordErrorHandler()) {
			const {basicInfo, password} = handleFormData();

			try {
				/* 비밀번호 입력시에만 비밀번호 변경 가능 */
				if (password.curPassword && password.newPassword) {
					const passwordResponse = await changePassword({
						curPassword: password.curPassword,
						newPassword: password.newPassword,
					});

					if (passwordResponse) {
						const basicInfoResponse = await changeProfileInfo(
							basicInfo
						);
						if (basicInfoResponse) {
							reset({
								email: values?.email,
								companyName: values?.companyName,
								businessNum: values?.businessNum,
								phoneNum: values?.phoneNum,
								name: values?.name,
								currentPassword: '',
								newPassword: '',
								passwordConfirm: '',
							});
							onMessageDialogOpen({
								title: '프로필이 수정되었습니다.',
								showBottomCloseButton: true,
								onCloseFunc: () => {
									queryClient.invalidateQueries({
										queryKey: ['partnershipInfo'],
									});
								},
							});
						}
					}
				} else {
					const basicInfoResponse = await changeProfileInfo(
						basicInfo
					);
					if (basicInfoResponse) {
						onMessageDialogOpen({
							title: '프로필이 수정되었습니다.',
							showBottomCloseButton: true,
							onCloseFunc: () => {
								queryClient.invalidateQueries({
									queryKey: ['partnershipInfo'],
								});
							},
						});
					}
				}
			} catch (e) {
				/* 기존 비밀번호가 맞는지 먼저 확인 후  기존 번호가 틀리면 에러 -> 메세지 */
				const statusCode = e.response.status;
				if (statusCode === 401) {
					setError('currentPassword', {
						message: '현재 비밀번호가 다릅니다.',
					});
					return;
				}
			}
		} else {
		}
	};

	useEffect(() => {
		if (data) {
			reset({
				email: data?.email,
				companyName: data?.companyName,
				businessNum: !data?.businessNum.includes('-')
					? formatBusinessNum(data?.businessNum)
					: data?.businessNum,
				phoneNum: !data?.phoneNum.includes('-')
					? formatPhoneNum(data?.phoneNum)
					: data?.phoneNum,
				name: data?.name,
			});
		}
	}, [data]);

	// useEffect(() => {
	// 	console.log('errors', errors);
	// }, [errors]);

	return (
		<Stack
			sx={{
				gap: '40px',
				maxWidth: '800px',
				width: '100%',
				margin: '40px auto 130px auto',
			}}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				noValidate
				autoComplete="off">
				<TitleTypography title="프로필 설정" />
				<Stack
					sx={{
						border: '1px solid #E2E2E9',
						borderRadius: '16px',
						padding: '32px',
						gap: '60px',
					}}>
					<Stack>
						<Typography
							variant="subtitle1"
							sx={{
								color: 'grey.900',
								marginBottom: '32px',
							}}>
							기본 정보
						</Typography>

						<Stack>
							<InputWithLabel
								labelTitle={'이메일 주소'}
								placeholder={''}
								isLast={false}
								control={control}
								name={'email'}
								fullWidth={true}
								disabled={true}
							/>

							{basicInfoInputList.map((li, idx) => {
								const {
									name,
									title,
									placeholder,
									type,
									...restInput
								} = li;

								return (
									<InputWithLabel
										key={`profile_input_${name}`}
										labelTitle={title}
										placeholder={placeholder}
										type={type}
										isLast={
											idx ===
											basicInfoInputList.length - 1
												? true
												: false
										}
										control={control}
										name={name}
										error={errors && errors[name]}
										fullWidth={true}
										onChange={(e) => {
											if (
												name === 'phoneNum' ||
												name === 'businessNum'
											) {
												e.target.value =
													handleChangeDataFormat(
														name,
														e
													);
											}
										}}
										{...restInput}
									/>
								);
							})}
						</Stack>
					</Stack>

					<Stack>
						<Typography
							variant="subtitle1"
							sx={{
								color: 'grey.900',
								marginBottom: '32px',
							}}>
							비밀번호 변경
						</Typography>

						<Stack>
							<Grid container sx={{maxWidth: 'calc(50% - 14px)'}}>
								<InputWithLabel
									type="password"
									labelTitle={'현재 비밀번호'}
									placeholder={'현재 비밀번호를 입력하세요'}
									isLast={false}
									control={control}
									name={'currentPassword'}
									fullWidth={false}
									error={errors && errors.currentPassword}
								/>
							</Grid>

							<Grid
								container
								flexWrap={'nowrap'}
								alignItems="flex-start"
								gap="24px">
								<InputWithLabel
									labelTitle={'새 비밀번호'}
									placeholder={'새 비밀번호를 입력하세요'}
									isLast={true}
									control={control}
									name={'newPassword'}
									fullWidth={true}
									type="password"
									error={errors && errors.newPassword}
								/>
								<InputWithLabel
									labelTitle={'새 비밀번호 확인'}
									placeholder={
										'새 비밀번호를 다시 입력하세요'
									}
									isLast={true}
									control={control}
									name={'passwordConfirm'}
									fullWidth={true}
									type="password"
									error={errors && errors.passwordConfirm}
								/>
							</Grid>
						</Stack>
					</Stack>
				</Stack>

				<CapsuleButton
					sx={{marginTop: '24px'}}
					onClick={goToSignoutPage}>
					회원탈퇴
				</CapsuleButton>
				<FixedBottomNavBar
					sx={{
						'& .MuiGrid-root': {
							justifyContent: 'flex-end',
						},
					}}>
					<Button
						variant="contained"
						color="primary"
						type="submit"
						height={48}>
						저장하기
					</Button>
				</FixedBottomNavBar>
			</form>
		</Stack>
	);
}

export default ProfileSetting;
