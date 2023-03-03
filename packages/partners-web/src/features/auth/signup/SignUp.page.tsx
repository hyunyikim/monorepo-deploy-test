import {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {parse, stringify} from 'qs';

import {Stack} from '@mui/material';

import SignUpStep1 from '@/features/auth/signup/SignUpStep1';
import SignUpStep2 from '@/features/auth/signup/SignUpStep2';
import SignUpStep3 from '@/features/auth/signup/SignUpStep3';
import {sendAmplitudeLog} from '@/utils';
import {SignUpRequestFormData} from '@/@types';
import {HEADER_HEIGHT} from '@/data';

function SignUp() {
	const [step, setStep] = useState(1);
	const [loginUrl, setLoginUrl] = useState('/auth/login');
	const [formData, setFormData] = useState<SignUpRequestFormData | null>(
		null
	);
	const {search} = useLocation();

	useEffect(() => {
		sendAmplitudeLog('signup_pv', {pv_title: '회원가입 진입'});
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
		// cafe24를 통해 가입 하는 경우, url로 넘어오는 값을 폼에 넣어줌
		if (parsedQuery.context === 'cafe24') {
			const {email, companyName, registrationNo, phone, code, state} =
				parsedQuery;

			const parsedEmail = Array.isArray(email) ? email[1] : email;
			setFormData({
				email: (parsedEmail || '') as string,
				companyName: (companyName || '') as string,
				businessNum: (registrationNo || '') as string,
				phoneNum: (phone || '') as string,
				password: '',
				cafe24Code: (code || '') as string,
				cafe24State: (state || '') as string,
			});
			setLoginUrl(`/auth/login?${stringify(query)}`);
		}
	}, [search]);

	return (
		<Stack
			justifyContent="center"
			alignItems="center"
			sx={{
				minHeight: `calc(100vh - ${HEADER_HEIGHT})`,
			}}>
			{step === 1 ? (
				<SignUpStep1 setStep={setStep} />
			) : step === 2 ? (
				<SignUpStep2
					setStep={setStep}
					loginUrl={loginUrl}
					formData={formData}
				/>
			) : step === 3 ? (
				<SignUpStep3 />
			) : null}
		</Stack>
	);
}

export default SignUp;
