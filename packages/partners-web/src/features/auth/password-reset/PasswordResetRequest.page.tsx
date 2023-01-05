import {useState} from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';

import {Stack, Typography} from '@mui/material';

import {checkEmailDuplicated, resetPassword} from '@/api/auth.api';
import {useGlobalLoading} from '@/stores';
import {goToParentUrl} from '@/utils';

import {Button, ControlledInputComponent} from '@/components';

function PasswordResetRequest() {
	const [step, setStep] = useState(1);
	const goToNextStep = () => {
		setStep(2);
	};

	return (
		<Stack
			flexDirection="column"
			justifyContent="center"
			width="100%"
			maxWidth="400px">
			{step === 1 ? (
				<PasswordResetStep1 goToNextStep={goToNextStep} />
			) : step === 2 ? (
				<PasswordResetStep2 />
			) : (
				<></>
			)}
		</Stack>
	);
}

const PasswordResetStep1 = ({goToNextStep}: {goToNextStep: () => void}) => {
	const setIsLoading = useGlobalLoading((state) => state.setIsLoading);
	const {
		setError,
		control,
		watch,
		handleSubmit,
		formState: {errors},
	} = useForm<{email: string}>({
		resolver: yupResolver(
			yup.object().shape({
				email: yup
					.string()
					.required('가입한 이메일을 정확히 입력해주세요.')
					.email('유효하지 않은 이메일 주소입니다.'),
			})
		),
		mode: 'onSubmit',
		reValidateMode: 'onChange',
	});
	const watchEmail = watch('email');

	const onSubmit = async ({email}: {email: string}) => {
		try {
			setIsLoading(true);

			// 이미 가입된 이메일인지 확인
			const isDuplicated = await checkEmailDuplicated(email);
			if (!isDuplicated) {
				setError('email', {
					message: '가입한 이메일을 정확히 입력해주세요.',
				});
				return;
			}

			// 비밀번호 초기화 요청
			await resetPassword(email);
			goToNextStep();
		} catch (e) {
			setError('email', {
				message: '다시 시도해주세요.',
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Typography variant="header2" mb="40px">
				버클 계정의 <br />
				비밀번호를 재설정합니다.
			</Typography>
			<Typography variant="body3" fontWeight="bold" mb="8px">
				임시 비밀번호를 받을 이메일 주소를 입력해주세요.
			</Typography>
			<ControlledInputComponent
				name="email"
				control={control}
				type="text"
				defaultValue=""
				error={errors?.email}
			/>
			<Button
				width="100%"
				height={48}
				disabled={watchEmail ? false : true}
				type="submit"
				sx={{
					marginTop: '48px',
				}}>
				다음
			</Button>
		</form>
	);
};

const PasswordResetStep2 = () => {
	return (
		<>
			<Typography variant="header2" mb="48px">
				임시 비밀번호가 이메일로 발급됐어요.
			</Typography>
			<Button height={48} onClick={() => goToParentUrl('/auth/login')}>
				로그인하기
			</Button>
		</>
	);
};

export default PasswordResetRequest;
