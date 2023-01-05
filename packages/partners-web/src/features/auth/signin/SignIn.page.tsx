import {Stack, Typography} from '@mui/material';

import {goToParentUrl, usePageView} from '@/utils';

import {ImgLogoVirclePartners, ImgLogoVirclePartners2x} from '@/assets/images';
import SignInForm from '@/features/auth/signin/SignInForm';

function SignIn() {
	usePageView('partners_login_pv', '로그인 진입');
	return (
		<Stack
			sx={{
				height: `calc(100vh - 80px)`,
				position: 'relative',
			}}
			flexDirection="column"
			justifyContent="center"
			width="100%"
			maxWidth="486px"
			margin="auto">
			<Stack
				flexDirection="column"
				width="100%"
				sx={{
					border: (theme) => `1px solid ${theme.palette.grey[100]}`,
					borderRadius: '16px',
					padding: {
						xs: '48px 20px',
						sm: '48px 40px',
					},
				}}>
				<img
					src={ImgLogoVirclePartners}
					srcSet={`${ImgLogoVirclePartners2x} 2x`}
					width="100px"
					alt="logo"
					style={{
						margin: 'auto',
					}}
				/>
				<Typography
					variant="header2"
					textAlign="center"
					mt="32px"
					mb="48px">
					로그인
				</Typography>
				<SignInForm />
				<Stack
					flexDirection={{xs: 'column', sm: 'row'}}
					justifyContent="space-between"
					alignItems="center"
					mt="22px">
					<Typography
						variant="body1"
						color="grey.700"
						className="cursor-pointer"
						onClick={() =>
							goToParentUrl('/reset/request/password')
						}>
						비밀번호 찾기
					</Typography>
					<Stack
						flexDirection={{xs: 'column', sm: 'row'}}
						alignItems="center">
						<Typography variant="body1" color="grey.700" mr="4px">
							아직 회원이 아니신가요?
						</Typography>
						<Typography
							color="primary.main"
							className="cursor-pointer"
							onClick={() => goToParentUrl('/auth/signup')}>
							회원가입
						</Typography>
					</Stack>
				</Stack>
			</Stack>
			<Footer />
		</Stack>
	);
}

const Footer = () => {
	return (
		<Stack
			sx={{
				position: {
					xs: 'relative',
					sm: 'absolute',
				},
				marginTop: {
					xs: '16px',
					sm: 0,
				},
				bottom: 0,
			}}>
			<Typography textAlign="center" variant="caption2" color="grey.400">
				Copyright © Mass Adoption. All rights reserved.
			</Typography>
			<Typography textAlign="center" variant="caption2" color="grey.400">
				사업자등록번호 469-88-01884 | 통신판매업신고번호: 제
				2021-서울강남-06170 호 | 대표: 박찬우
			</Typography>
			<Typography textAlign="center" variant="caption2" color="grey.400">
				서울특별시 강남구 테헤란로 217, 오렌지플래닛 702
			</Typography>
		</Stack>
	);
};

export default SignIn;
