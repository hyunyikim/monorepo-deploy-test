import React, {useEffect} from 'react';
import PageTitle from '@/components/atoms/PageTitle';
import {Stack} from '@mui/system';
import {Typography, Grid} from '@mui/material';
import {Button, InputWithLabel, MessageDialog} from '@/components';
import {profileSettingSchemaShape} from '@/utils/schema';

import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import FixedBottomNavBar from '@/components/atoms/FixedBottomNavBar';

import {useMessageDialog, useGetPartnershipInfo} from '@/stores';

import {changePassword, changeProfileInfo} from '@/api/auth.api';
import {handleChangeDataFormat} from '@/utils';

function ProfileSetting() {
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
			readonly: false,
			value: data?.companyName,
			type: 'text',
			name: 'companyName',
		},
		{
			title: '사업자등록번호',
			placeholder: '사업자등록번호를 입력해주세요.',
			readonly: false,
			value: data?.businessNum,
			type: 'text',
			name: 'businessNum',
			inputProps: {
				maxLength: 12,
			},
		},
		{
			title: '휴대전화번호',
			placeholder: '담당자 연락처를 입력해주세요.',
			readonly: false,
			value: data?.phoneNum,
			type: 'text',
			name: 'phoneNum',
			inputProps: {
				maxLength: 13,
			},
		},
		{
			title: '담당자 이름',
			placeholder: '담당지 이름을 입력해주세요',
			readonly: false,
			value: data?.name,
			type: 'text',
			name: 'name',
		},
	];

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
		const values = getValues();

		if (values.currentPassword) {
			/* 현재 비밀번호만 입력하고 신규번호를 입력하지 않았을때 */
			if (!values.newPassword && !values.passwordConfirm) {
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
				return;
			} else if (!values.newPassword) {
				setError(
					'newPassword',
					{
						type: 'required',
						message: '새 비밀번호를 입력하지 않았습니다.',
					},
					{shouldFocus: true}
				);
				return;
			} else if (!values.passwordConfirm) {
				setError(
					'passwordConfirm',
					{
						type: 'required',
						message: '새 비밀번호를 입력하지 않았습니다.',
					},
					{shouldFocus: true}
				);
				return;
			}

			/* 새로운 비밀번호랑 비밀번호 확인이 같지 않으면 에러 */
			if (values.passwordConfirm && values.newPassword) {
				if (values.passwordConfirm !== values.newPassword) {
					setError(
						'passwordConfirm',
						{
							type: 'matches',
							message: '새 비밀번호가 일치하지 않습니다.',
						},
						{shouldFocus: true}
					);
					return;
				}
			}
		} else if (
			!values.currentPassword &&
			(values.newPassword || values.passwordConfirm)
		) {
			/* 현재 비밀번호만 입력 '안'하고 신규번호만 입력했을때 */
			setError(
				'currentPassword',
				{
					type: 'required',
					message: '현재 비밀번호를 입력하지 않았습니다.',
				},
				{shouldFocus: true}
			);

			if (!values.passwordConfirm) {
				setError(
					'passwordConfirm',
					{
						type: 'required',
						message: '새 비밀번호를 입력하지 않았습니다.',
					},
					{shouldFocus: true}
				);
				return;
			} else if (!values.newPassword) {
				setError(
					'newPassword',
					{
						type: 'required',
						message: '새 비밀번호를 입력하지 않았습니다.',
					},
					{shouldFocus: true}
				);
				return;
			}
		}
	};

	const onSubmit: () => Promise<void> = async () => {
		/* 로고 등록 안할시 에러표시 */
		const values = getValues();
		passwordErrorHandler();

		if (Object.keys(errors).length === 0) {
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
						reset({
							email: data?.email,
							companyName: data?.companyName,
							businessNum: data?.businessNum,
							phoneNum: data?.phoneNum,
							name: data?.name,
							currentPassword: '',
							newPassword: '',
							passwordConfirm: '',
						});
						if (basicInfoResponse) {
							onMessageDialogOpen({
								title: '프로필이 수정되었습니다.',
								showBottomCloseButton: true,
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
				businessNum: data?.businessNum,
				phoneNum: data?.phoneNum,
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
				margin: 'auto',
				pb: '160px',
			}}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				noValidate
				autoComplete="off">
				<PageTitle>프로필 설정</PageTitle>

				<Stack
					sx={{
						border: '1px solid #E2E2E9',
						borderRadius: '16px',
						padding: '32px',
						gap: '60px',
						mt: '40px',
					}}>
					<Stack>
						<Typography
							variant="h2"
							sx={{
								fontWeight: 700,
								fontSize: '21px',
								lineHeight: '21px',
								color: 'grey.900',
								marginBottom: '42px',
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
								value={data?.email}
							/>

							{basicInfoInputList.map((li, idx) => {
								const {
									name,
									title,
									placeholder,
									type,
									value,
									...restInput
								} = li;

								return (
									<InputWithLabel
										labelTitle={title}
										placeholder={placeholder}
										inputType={type}
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
										value={value}
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
							variant="h2"
							sx={{
								fontWeight: 700,
								fontSize: '21px',
								lineHeight: '21px',
								color: 'grey.900',
								marginBottom: '42px',
							}}>
							비밀번호 변경
						</Typography>

						<Stack>
							<Grid container sx={{maxWidth: 'calc(50% - 14px)'}}>
								<InputWithLabel
									inputType="password"
									labelTitle={'현재 비밀번호'}
									placeholder={'현재 비밀번호를 입력하세요'}
									isLast={false}
									control={control}
									name={'currentPassword'}
									fullWidth={false}
									value={''}
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
									value={''}
									inputType="password"
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
									value={''}
									inputType="password"
									error={errors && errors.passwordConfirm}
								/>
							</Grid>
						</Stack>
					</Stack>
				</Stack>

				<FixedBottomNavBar
					sx={{
						'& .MuiGrid-root': {
							justifyContent: 'flex-end',
						},
					}}>
					<Button variant="contained" color="primary" type="submit">
						저장하기
					</Button>
				</FixedBottomNavBar>
			</form>
		</Stack>
	);
}

export default ProfileSetting;
