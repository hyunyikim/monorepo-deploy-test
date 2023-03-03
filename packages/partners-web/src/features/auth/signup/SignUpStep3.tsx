import {useLocation, useNavigate} from 'react-router-dom';

import {Box, Stack, Typography} from '@mui/material';

import {ImgTelegram, ImgTelegram2x} from '@/assets/images';
import {sendEmailVerification} from '@/api/auth.api';
import {useEffect} from 'react';

function SignUpStep3() {
	const navigate = useNavigate();
	const {state: email} = useLocation();

	useEffect(() => {
		if (!email) {
			navigate('/', {
				replace: true,
			});
		}
	}, [email]);

	return (
		<Stack id="justify" alignItems="center">
			<img
				src={ImgTelegram}
				srcSet={`${ImgTelegram2x} 2x`}
				alt="telegram"
			/>
			<Typography
				color="primary.main"
				fontSize={{
					xs: 24,
					md: 42,
				}}
				fontWeight="bold"
				textAlign="center"
				mt="24px">
				환영합니다!
			</Typography>
			<Typography
				color="grey.900"
				fontSize={{
					xs: 24,
					md: 42,
				}}
				fontWeight="bold"
				textAlign="center"
				mb="40px">
				이메일 인증을 완료해주세요
			</Typography>
			<Typography
				color="grey.400"
				fontSize={{
					xs: 13,
					md: 18,
				}}
				textAlign="center"
				mb="24px">
				가입한 이메일로 인증 메일이 발송되었습니다. <br />
				이메일 인증을 진행하고 디지털 개런티 발급을 시작해보세요!
			</Typography>
			<Box
				color="grey.400"
				fontSize={{
					xs: 13,
					md: 18,
				}}
				fontWeight={400}
				textAlign="center">
				이메일을 받지 못하셨나요? <br />
				스팸편지함 확인 또는{' '}
				<Typography
					className="cursor-pointer"
					display="inline-block"
					color="primary.main"
					fontWeight={500}
					fontSize={{
						xs: 13,
						md: 18,
					}}
					onClick={async () => {
						try {
							await sendEmailVerification(email as string);
							navigate('/');
						} catch (e) {
							console.log('e :>> ', e);
							navigate(
								`/auth/verification/fail?email=${
									email as string
								}`
							);
						}
					}}>
					인증 이메일 다시 보내기
				</Typography>
			</Box>
		</Stack>
	);
}

export default SignUpStep3;
