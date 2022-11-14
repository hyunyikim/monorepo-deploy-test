import {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {parse, stringify} from 'qs';

import {Box} from '@mui/material';

import {HEADER_HEIGHT, PARTIAL_PAGE_MAX_WIDTH} from '@/data';

import Header from '@/components/common/layout/Header';
import SignUpStep1 from '@/features/auth/signup/SignUpStep1';
import SignUpStep2 from '@/features/auth/signup/SignUpStep2';
import SignUpStep3 from '@/features/auth/signup/SignUpStep3';
import {trackingToParent} from '@/utils';

function SignUp() {
	const [step, setStep] = useState(1);
	const [loginUrl, setLoginUrl] = useState('/auth/login');
	const {search} = useLocation();

	useEffect(() => {
		trackingToParent('signup_pv', {pv_title: '회원가입 진입'});
	}, []);

	useEffect(() => {
		// cafe24 대응
		const parsedQuery = parse(search, {
			ignoreQueryPrefix: true,
		});
		const query = {
			context: parsedQuery.context,
			code: parsedQuery.code,
			state: parsedQuery.state,
		};
		if (parsedQuery.context === 'cafe24') {
			setLoginUrl(`/auth/login?${stringify(query)}`);
		}
	}, [search]);

	return (
		<>
			<Header fullPage={false} />
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				position="relative"
				maxWidth={PARTIAL_PAGE_MAX_WIDTH}
				minHeight={`calc(100vh - ${HEADER_HEIGHT})`}
				margin="auto"
				padding="0 10px"
				paddingTop={HEADER_HEIGHT}>
				{step === 1 ? (
					<SignUpStep1 setStep={setStep} />
				) : step === 2 ? (
					<SignUpStep2 setStep={setStep} loginUrl={loginUrl} />
				) : step === 3 ? (
					<SignUpStep3 />
				) : null}
			</Box>
		</>
	);
}

export default SignUp;
