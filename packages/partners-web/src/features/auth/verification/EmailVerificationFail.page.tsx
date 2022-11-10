import {Box, Stack, Typography} from '@mui/material';

import {HEADER_HEIGHT, PARTIAL_PAGE_MAX_WIDTH} from '@/data';

import Header from '@/components/common/layout/Header';

import {ImgTelegram, ImgTelegram2x} from '@/assets/images';

function EmailVerificationFail() {
	return (
		<>
			<Header fullPage={false} />
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				position="relative"
				top={HEADER_HEIGHT}
				maxWidth={PARTIAL_PAGE_MAX_WIDTH}
				minHeight={`calc(100vh - ${HEADER_HEIGHT})`}
				margin="auto"
				padding="0 10px">
				<Stack id="justify" alignItems="center">
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
						// TODO:
						onClick={() => console.log('')}>
						인증 이메일 다시 보내기
					</Typography>
				</Stack>
			</Box>
		</>
	);
}

export default EmailVerificationFail;
