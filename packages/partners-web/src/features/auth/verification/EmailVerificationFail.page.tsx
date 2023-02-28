import {useLocation, useNavigate} from 'react-router-dom';
import {parse} from 'qs';

import {Stack, Typography} from '@mui/material';

import {ImgTelegram, ImgTelegram2x} from '@/assets/images';
import {sendEmailVerification} from '@/api/auth.api';
import {HEADER_HEIGHT} from '@/data';

function EmailVerificationFail() {
	const {search} = useLocation();
	const navigate = useNavigate();

	return (
		<Stack
			justifyContent="center"
			alignItems="center"
			sx={{
				minHeight: `calc(100vh - ${HEADER_HEIGHT})`,
				height: '100%',
			}}>
			<img
				src={ImgTelegram}
				srcSet={`${ImgTelegram2x} 2x`}
				alt="telegram"
			/>
			<Typography
				color="grey.900"
				fontSize={{
					xs: 24,
					md: 42,
				}}
				fontWeight="bold"
				textAlign="center"
				mt="24px"
				mb="40px">
				이메일 인증 실패
			</Typography>
			<Typography
				color="grey.400"
				fontSize={{
					xs: 13,
					md: 18,
				}}
				textAlign="center"
				mb="24px">
				가입한 계정 이메일로 인증 이메일을 다시 보내고 <br />
				인증 버튼을 눌러 주세요.
			</Typography>
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
						const parsedSearch = parse(search, {
							ignoreQueryPrefix: true,
						}) as {
							email?: string;
						};
						const email = parsedSearch?.email;
						if (!email) return;
						await sendEmailVerification(email);
						navigate('/');
					} catch (e) {
						console.log('e :>> ', e);
					}
				}}>
				인증 이메일 다시 보내기
			</Typography>
		</Stack>
	);
}

export default EmailVerificationFail;
