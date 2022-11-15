import {Stack, Typography} from '@mui/material';

import {useOpen} from '@/utils/hooks';

import SignUpForm from '@/features/auth/signup/SignUpForm';
import AgreementModal from '@/features/auth/signup/AgreementModal';
import {goToParentUrl} from '@/utils';
import {SignUpRequestFormData} from '@/@types';

function SignUpStep2({
	setStep,
	loginUrl,
	formData,
}: {
	setStep: (value: number) => void;
	loginUrl: string;
	formData: SignUpRequestFormData | null;
}) {
	const {open, modalData, onOpen, onClose, onSetModalData} = useOpen({});
	return (
		<>
			<Stack id="justify" alignItems="center">
				<Typography
					mb="14px"
					fontSize={{
						xs: 24,
						md: 42,
					}}
					fontWeight="bold"
					textAlign="center"
					sx={{
						background:
							'linear-gradient(to right, #5f9bfb, #705ffa)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
					}}>
					버클을 무료로 시작해볼까요?
				</Typography>
				<Typography
					mb="40px"
					fontSize={{
						xs: 13,
						md: 18,
					}}
					textAlign="center"
					color="#8E8E98">
					이메일 계정을 만들고 버클을 시작해보세요!
				</Typography>
				<SignUpForm
					setStep={setStep}
					onOpenModal={onOpen}
					onSetAgreementType={onSetModalData}
					formData={formData}
				/>
				<Stack direction="row" mt="20px">
					<Typography
						fontSize={{
							xs: 14,
							md: 16,
						}}
						fontWeight={500}
						color="grey.700">
						이미 계정이 있으신가요?
					</Typography>
					<Typography
						fontSize={{
							xs: 14,
							md: 16,
						}}
						fontWeight={700}
						color="primary.main"
						className="cursor-pointer"
						onClick={() => {
							goToParentUrl(loginUrl);
						}}>
						&nbsp;로그인
					</Typography>
				</Stack>
			</Stack>
			<AgreementModal open={open} type={modalData} onClose={onClose} />
		</>
	);
}

export default SignUpStep2;
