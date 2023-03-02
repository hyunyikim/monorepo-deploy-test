import {lazy} from 'react';
import {RouteObject} from 'react-router-dom';

import Layout from '@/components/common/layout/Layout';
import CheckUnAuth from '@/components/common/layout/CheckUnAuth';

const SignIn = lazy(() => import('@/features/auth/signin/SignIn.page'));
const SignUp = lazy(() => import('@/features/auth/signup/SignUp.page'));
const EmailVerificationFail = lazy(
	() => import('@/features/auth/verification/EmailVerificationFail.page')
);
const PasswordResetRequest = lazy(
	() => import('@/features/auth/password-reset/PasswordResetRequest.page')
);

const publicRoutes: RouteObject[] = [
	{
		element: <CheckUnAuth />,
		children: [
			{
				element: <Layout hasSidebar={false} hasHeader={true} />,
				children: [
					{
						path: '/auth/signup',
						element: <SignUp />,
					},
					{
						path: '/reset/request/password',
						element: <PasswordResetRequest />,
					},
					{
						path: '/auth/verification/fail',
						element: <EmailVerificationFail />,
					},
				],
			},
			{
				path: '/auth/login',
				element: <SignIn />,
			},
		],
	},
];

export default publicRoutes;
