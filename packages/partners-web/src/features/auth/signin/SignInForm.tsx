import {useEffect, useRef} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useQueryClient} from '@tanstack/react-query';
import {AxiosError} from 'axios';
import {parse, stringify} from 'qs';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';

import {Stack} from '@mui/material';

import {Button, InputWithLabel} from '@/components';

import {partnershipSignInSchemaShape} from '@/utils/schema';
import {SignInRequestRequestParam} from '@/@types';
import {signIn} from '@/api/auth.api';
import {getPartnershipInfo} from '@/api/partnership.api';
import {setTrackingUser} from '@/utils';
import {useLoginStore} from '@/stores';

const inputList = [
	{
		type: 'text',
		name: 'email',
		placeholder: '이메일을 입력해주세요',
		label: '이메일',
		autoComplete: 'on',
	},
	{
		type: 'password',
		name: 'password',
		placeholder: '비밀번호를 입력해주세요',
		label: '비밀번호',
		autoComplete: 'on',
	},
];

function SignInForm() {
	const queryClient = useQueryClient();
	const location = useLocation();
	const navigate = useNavigate();
	const parsedQuery = parse(location.search, {
		ignoreQueryPrefix: true,
	});
	const setLogin = useLoginStore((state) => state.setLogin);
	const {
		handleSubmit,
		setError,
		control,
		reset,
		setFocus,
		formState: {errors},
	} = useForm<SignInRequestRequestParam>({
		resolver: yupResolver(yup.object(partnershipSignInSchemaShape)),
		mode: 'onChange',
	});

	const alreadyVerifiedRef = useRef(false);
	useEffect(() => {
		if (!parsedQuery) {
			return;
		}

		// 이메일 인증 완료해 해당 페이지로 리다이렉트된 유저
		const verifiedEmail = parsedQuery?.email;
		if (verifiedEmail && !alreadyVerifiedRef.current) {
			alreadyVerifiedRef.current = true;
			reset({
				email: verifiedEmail as string,
				password: '',
			});
			setFocus('password');
			alert('이메일 인증이 완료되었습니다.');
		}
	}, [parsedQuery]);

	const onSubmit = async (requestParam: SignInRequestRequestParam) => {
		try {
			const {data} = await signIn(requestParam);
			const token = data.token;
			setLogin(token);

			// cafe24 설치 중 로그인한 경우
			if (parsedQuery?.context === 'cafe24') {
				navigate(`/cafe24/interwork?${stringify(parsedQuery)}`, {
					replace: true,
				});
				return;
			}
			setLogin(token);

			const partnershipData = await getPartnershipInfo();
			if (!partnershipData) {
				throw new Error('로그인에 실패했습니다. 다시 시도해주세요.');
			}

			// 마스터 로그인 시도시, 어드민 페이지로 넘김
			if (partnershipData.adminType === 'master') {
				window.open(VIRCLE_ADMIN_URL);
				return;
			}

			setTrackingUser(
				partnershipData.email,
				partnershipData.b2bType,
				partnershipData.companyName
			);

			// // 이메일로 발급 받은 임시 비밀번호로 로그인 했는지 여부 체크
			// // 값이 없으면 임시 비밀번호로 로그인한 것임
			const isTempPasswordLogin = partnershipData.passwordChangedAt
				? false
				: true;
			if (isTempPasswordLogin) {
				navigate('/reset/password', {
					replace: true,
				});
				return;
			}

			// // 개런티 세팅 완료 전이라면 개런티 설정 페이지로 이동
			const finishedGuaranteeSetting = partnershipData?.profileImage
				? true
				: false;
			if (!finishedGuaranteeSetting) {
				navigate('/setup/guarantee');
				return;
			}

			navigate('/dashboard', {
				replace: true,
			});
		} catch (e: unknown | AxiosError) {
			if (e instanceof AxiosError) {
				const message: string =
					e.response?.data?.message ??
					'유효하지 않은 이메일 또는 패스워드 입니다.';
				setError('password', {message});
			}
		}
	};

	return (
		<form noValidate onSubmit={handleSubmit(onSubmit)}>
			<Stack>
				<Stack
					gap="36px"
					mb="52px"
					sx={{
						'& > .MuiGrid-root': {
							marginBottom: 0,
						},
					}}>
					{inputList.map((input) => {
						const {name} = input;
						return (
							<InputWithLabel
								key={name}
								name={name}
								control={control}
								labelTitle={input.label}
								placeholder={input.placeholder}
								type={input.type}
								error={
									errors[
										name as keyof SignInRequestRequestParam
									]
								}
							/>
						);
					})}
				</Stack>
				<Button
					height={48}
					width="100%"
					type="submit"
					data-tracking={`partners_login,{'login_click': '로그인'}`}>
					로그인
				</Button>
			</Stack>
		</form>
	);
}

export default SignInForm;
