import {useState} from 'react';

import {Box} from '@mui/material';

import {HEADER_HEIGHT, PARTIAL_PAGE_MAX_WIDTH} from '@/data';

import Header from '@/components/common/layout/Header';
import SignUpStep1 from '@/features/auth/signup/SignUpStep1';
import SignUpStep2 from '@/features/auth/signup/SignUpStep2';
import SignUpStep3 from '@/features/auth/signup/SignUpStep3';

function SignUp() {
	const [step, setStep] = useState(1);
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
				{step === 1 ? (
					<SignUpStep1 setStep={setStep} />
				) : step === 2 ? (
					<SignUpStep2 setStep={setStep} />
				) : step === 3 ? (
					<SignUpStep3 />
				) : null}
			</Box>
		</>
	);
}

export default SignUp;
