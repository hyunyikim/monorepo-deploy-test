import {useEffect, useRef} from 'react';
import {useLocation} from 'react-router-dom';
import {useQueryClient} from '@tanstack/react-query';
import {AxiosError} from 'axios';
import {parse} from 'qs';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';

import {Stack} from '@mui/material';

import {Button, InputWithLabel} from '@/components';

import {partnershipSignInSchemaShape} from '@/utils/schema';
import {SignInRequestRequestParam} from '@/@types';
import {signIn} from '@/api/auth.api';
import {getPartnershipInfo} from '@/api/partnership.api';
import {loginToParent, replaceToParentUrl, setTrackingUser} from '@/utils';
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
				loginToParent(token, {
					isDuringInstallCafe24: true,
				});
				return;
			}
			await queryClient.invalidateQueries({
				queryKey: ['partnershipInfo'],
			});

			const partnershipData = await getPartnershipInfo();

			if (!partnershipData) {
				throw new Error('로그인에 실패했습니다. 다시 시도해주세요.');
			}

			setTrackingUser(
				partnershipData.email,
				partnershipData.b2bType,
				partnershipData.companyName
			);

			// 이메일로 발급 받은 임시 비밀번호로 로그인 했는지 여부 체크
			// 값이 없으면 임시 비밀번호로 로그인한 것임
			const isTempPasswordLogin = partnershipData.passwordChangedAt
				? false
				: true;
			if (isTempPasswordLogin) {
				// 페이지 이동을 부모창에서 수행
				// replaceToParentUrl('/reset/password');
				loginToParent(token, {
					isTempPasswordLogin: true,
				});
			}

			// 위 작업 모두 마무리 후 부모창으로 로그인 완료 신호 보냄
			// 부모창에서 로그인 여부에 따라 public/private routes를 결정하기 때문에 해당 작업을 로그인 로직의 가장 마지막에 실행함
			loginToParent(token, {});
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
								inputType={input.type}
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
