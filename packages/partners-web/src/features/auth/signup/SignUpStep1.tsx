import {useEffect} from 'react';
import {Box, Stack, Typography} from '@mui/material';

import {useOpen} from '@/utils/hooks';

import {Button} from '@/components';
import IntroductionInquiryDialog from '@/features/auth/signup/IntroductionInquiryDialog';
import {ImgShop, ImgShop2x, ImgHandbag, ImgHandbag2x} from '@/assets/images';
import {trackingToParent} from '@/utils';

function SignUpStep1({setStep}: {setStep: (value: number) => void}) {
	const {open, onOpen, onClose} = useOpen({});

	useEffect(() => {
		trackingToParent('storetype_pv', {pv_title: '스토어 유형 선택'});
	}, []);

	return (
		<>
			<Stack alignItems="center">
				<Box flexDirection="column">
					<Typography
						fontSize={{
							xs: 24,
							md: 40,
						}}
						fontWeight={700}
						textAlign="center"
						mb="24px">
						가입 유형 선택
					</Typography>
					<Typography
						fontSize={{
							xs: 13,
							md: 18,
						}}
						fontWeight={400}
						color="grey.400"
						textAlign="center"
						mb="60px">
						디지털 개런티 발급 서비스를 도입할 스토어의 유형을
						선택해주세요.
					</Typography>
				</Box>
				<Stack
					direction={{
						xs: 'column',
						md: 'row',
					}}
					rowGap="10px"
					columnGap="10px">
					<SignUpStoreType
						icon={
							<img
								src={ImgShop}
								srcSet={`${ImgShop2x} 2x`}
								alt="signup type"
							/>
						}
						title="브랜드"
						desc={
							<>
								자사 브랜드를 보유하고 직접 판매하는 스토어
								<br />
								(패션, 뷰티, 라이프)
							</>
						}
						button={
							<Button
								width={124}
								onClick={() => {
									trackingToParent(
										'storetype_brandstart_click',
										{button_title: '브랜드 시작하기'}
									);
									setStep(2);
								}}>
								시작하기
							</Button>
						}
					/>
					<SignUpStoreType
						icon={
							<img
								src={ImgHandbag}
								srcSet={`${ImgHandbag2x} 2x`}
								alt="signup type"
							/>
						}
						title="병행수입"
						desc={
							<>
								해외 명품 병행수입해서 판매하는 스토어
								<br />
								(의류, 잡화, 신발, 액세서리)
							</>
						}
						button={
							<Button
								width={124}
								onClick={() => {
									trackingToParent(
										'storetype_imported_click',
										{button_title: '도입문의 팝업 노출'}
									);
									onOpen();
								}}>
								도입 문의하기
							</Button>
						}
					/>
				</Stack>
			</Stack>
			<IntroductionInquiryDialog open={open} onClose={onClose} />
		</>
	);
}

const SignUpStoreType = ({
	icon,
	title,
	desc,
	button,
}: {
	icon: React.ReactElement;
	title: string;
	desc: React.ReactElement;
	button: React.ReactElement;
}) => {
	return (
		<Stack
			flexDirection="column"
			justifyContent="center"
			alignItems="center"
			minWidth={{
				md: '360px',
			}}
			minHeight={{
				md: '324px',
			}}
			sx={(theme) => ({
				padding: '10px',
				borderRadius: '16px',
				border: `1px solid ${theme.palette.grey[100]}`,
			})}>
			{icon}
			<Typography
				fontSize={{
					xs: 20,
					md: 24,
				}}
				fontWeight={700}
				mt={{
					xs: '16px',
					md: '32px',
				}}
				mb="10px">
				{title}
			</Typography>
			<Typography
				fontSize={{
					xs: 13,
					md: 16,
				}}
				fontWeight={400}
				color="grey.400"
				textAlign="center"
				mb="32px">
				{desc}
			</Typography>
			{button}
		</Stack>
	);
};

export default SignUpStep1;
