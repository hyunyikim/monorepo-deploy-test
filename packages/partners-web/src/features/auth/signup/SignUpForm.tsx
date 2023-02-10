import {useCallback, useEffect, useMemo, useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

import {
	Checkbox,
	FormControl,
	FormControlLabel,
	FormHelperText,
	Stack,
	Box,
} from '@mui/material';

import {
	partnershipSignupEmailSchemaShape as emailSchemaShape,
	partnershipSignUpRestSchemaShape as restFieldSchemaShape,
} from '@/utils/schema';
import {
	handleChangeDataFormat,
	openParantModal,
	sendAmplitudeLog,
} from '@/utils';
import {signUp} from '@/api/auth.api';

import {Button} from '@/components';
import SignUpTextField from '@/features/auth/signup/SignUpTextField';
import {
	IcEnvelope,
	IcHotelBuilding,
	IcDoc,
	IcPhone,
	IcLock,
} from '@/assets/icon';
import {SignUpRequestFormData} from '@/@types';
import {useNavigate} from 'react-router-dom';
import {useMessageDialog} from '@/stores';
import AtagComponent from '@/components/atoms/AtagComponent';

const inputList = [
	{
		type: 'text',
		name: 'email',
		placeholder: '이메일을 입력해주세요.',
		label: '이메일 주소',
		autoComplete: 'off',
		required: true,
		icon: <IcEnvelope />,
	},
	{
		type: 'text',
		name: 'companyName',
		placeholder: '회사명을 입력해주세요.',
		label: '회사명',
		autoComplete: 'off',
		required: true,
		icon: <IcHotelBuilding />,
	},
	{
		type: 'text',
		name: 'businessNum',
		placeholder: '사업자등록번호를 입력해주세요.',
		label: '사업자등록번호',
		autoComplete: 'off',
		required: true,
		icon: <IcDoc />,
	},
	{
		type: 'text',
		name: 'phoneNum',
		placeholder: '담당자 연락처를 입력해주세요.',
		label: '휴대전화번호',
		autoComplete: 'off',
		required: true,
		icon: <IcPhone />,
	},
	{
		type: 'password',
		name: 'password',
		placeholder: '비밀번호를 입력해주세요.',
		label: '비밀번호',
		autoComplete: 'off',
		required: true,
		icon: <IcLock />,
	},
	{
		type: 'password',
		name: 'passwordConfirm',
		placeholder: '비밀번호를 한번 더 입력해주세요.',
		label: '비밀번호',
		autoComplete: 'off',
		required: true,
		icon: <IcLock />,
	},
];

const defaultValues = inputList
	.map((item: {name: string}) => item.name)
	.reduce((acc: Record<string, any>, cur) => {
		return {...acc, [cur]: ''};
	}, {});

interface FormProps extends SignUpRequestFormData {
	passwordConfirm: string;
	isAgree: boolean;
}

interface Props {
	formData: SignUpRequestFormData | null;
	setStep: (value: number) => void;
	onOpenModal: () => void;
	onSetAgreementType: (value: 'policy' | 'privacy') => void;
}

function SignUpForm({
	formData,
	setStep,
	onOpenModal,
	onSetAgreementType,
}: Props) {
	const navigate = useNavigate();
	const [showAllField, setShowAllField] = useState(false);
	const onOpenError = useMessageDialog((state) => state.onOpenError);

	const showInputList = useMemo(() => {
		if (showAllField) {
			return inputList;
		}
		return [inputList[0]];
	}, [showAllField]);

	const {
		reset,
		watch,
		getFieldState,
		control,
		handleSubmit,
		formState: {isValidating},
		trigger,
	} = useForm<FormProps>({
		resolver: yupResolver(
			showAllField
				? emailSchemaShape.concat(restFieldSchemaShape)
				: emailSchemaShape
		),
		mode: 'onSubmit',
		reValidateMode: 'onBlur',
	});

	// form 초기화
	useEffect(() => {
		if (formData) {
			reset({
				...formData,
				passwordConfirm: '',
				isAgree: false,
			});
			return;
		}
		reset({
			...defaultValues,
			passwordConfirm: '',
			isAgree: false,
		});
	}, [formData]);

	const watchEmail = watch('email');
	const fieldState = getFieldState('email');
	useEffect(() => {
		if (isValidating) {
			return;
		}
		// 이메일을 올바르게 입력한 경우에 전체 필드 보여줌
		if (watchEmail && !fieldState.error) {
			setShowAllField(true);
		}
	}, [isValidating, fieldState, watchEmail]);
	// const onOpen = useMessageDialog((state) => state.onOpen);

	const onSubmit = useCallback(
		async (data: SignUpRequestFormData) => {
			try {
				if (!data?.password) {
					return;
				}
				const formData = new FormData();
				Object.keys(data).forEach((key: string) => {
					if (['passwordConfirm', 'isAgree'].includes(key)) {
						return;
					}
					let value = data[key as keyof SignUpRequestFormData];
					if (key === 'businessNum' && value) {
						value = value.split('-').join('');
					}
					formData.append(key, value || '');
				});

				if (!formData) return;
				await signUp(formData);

				navigate('/auth/signup/v2', {
					state: data.email,
					replace: true,
				});
				setStep(3);
			} catch (e: any) {
				onOpenError({
					e,
				});
			}
		},
		[navigate]
	);

	return (
		<form
			noValidate
			onSubmit={handleSubmit(onSubmit)}
			style={{
				width: '100%',
			}}>
			<Stack
				direction="column"
				rowGap="14px"
				sx={{
					margin: 'auto',
					maxWidth: '480px',
				}}>
				{showInputList.map((input) => (
					<Controller
						key={input.name}
						name={input.name as keyof FormProps}
						control={control}
						render={({
							field: {onChange, onBlur, value, ref},
							fieldState: {error},
						}) => {
							const name = input.name;
							return (
								<SignUpTextField
									error={error}
									{...input}
									onChange={(e) => {
										if (name === 'phoneNum') {
											e.target.value =
												handleChangeDataFormat(
													'phoneNum',
													e
												);
										}
										if (name === 'businessNum') {
											e.target.value =
												handleChangeDataFormat(
													'businessNum',
													e
												);
										}
										onChange(e);

										// 이메일 필드만 노출되어 입력시, 입력 될 때마다 유효성 확인함
										if (name === 'email' && !showAllField) {
											trigger('email');
										}
									}}
									onBlur={onBlur}
									value={value}
									{...(['phoneNum', 'businessNum'].includes(
										name
									) && {
										inputProps: {
											maxLength:
												name === 'phoneNum' ? 13 : 12,
										},
									})}
								/>
							);
						}}
					/>
				))}
				{showAllField && (
					<Controller
						name="isAgree"
						control={control}
						render={({
							field: {onChange, value},
							fieldState: {error},
						}) => {
							return (
								<FormControl error={error ? true : false}>
									<FormControlLabel
										sx={{
											'& .MuiTypography-root': {
												display: 'flex',
												alignItems: 'center',
												fontSize: {
													xs: 13,
													md: 14,
												},
												fontWeight: 'bold',
												color: 'grey.600',
												'& .MuiTypography-h6': {
													color: 'primary.main',
												},
											},
										}}
										control={
											<Checkbox
												name="checked"
												color="primary"
												sx={{
													'& .MuiSvgIcon-root': {
														fontSize: 20,
													},
												}}
												onChange={onChange}
												checked={value}
											/>
										}
										label={
											<Box color="grey.600">
												<AtagComponent url="https://guide.vircle.co.kr/policy/agreement_230213">
													<Box
														display="inline-block"
														color="primary.main"
														fontWeight={600}
														className="underline cursor-pointer">
														서비스 이용약관
													</Box>
												</AtagComponent>
												과{' '}
												<AtagComponent url="https://guide.vircle.co.kr/policy/terms_230213">
													<Box
														display="inline-block"
														color="primary.main"
														fontWeight={600}
														className="underline cursor-pointer">
														개인정보 수집 및 이용
													</Box>
												</AtagComponent>
												에 동의합니다.
											</Box>
										}
									/>
									<FormHelperText
										sx={{
											margin: 0,
											fontSize: 13,
											fontWeight: 'bold',
										}}>
										{error?.message}
									</FormHelperText>
								</FormControl>
							);
						}}
					/>
				)}
				<Button
					type="submit"
					width="auto"
					sx={{
						marginTop: '34px',
						background:
							'linear-gradient(98.38deg, #5D9BF9 43.58%, #5C3EF6 104.42%)',
						height: {
							sm: '56px',
							md: '60px',
						},
						fontSize: {
							sm: '16px',
							md: '18px',
						},
					}}
					onClick={() => {
						sendAmplitudeLog('signup_click', {
							button_title: '회원가입 완료',
						});
					}}>
					지금 무료로 시작하기
				</Button>
			</Stack>
		</form>
	);
}

export default SignUpForm;
