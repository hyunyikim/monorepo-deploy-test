import {lazy} from 'react';
import {RouteObject} from 'react-router-dom';

import Layout from '@/components/common/layout/Layout';
import IframeChild from '@/components/common/layout/IframeChild';

const PartnersHomepage = lazy(
	() => import('@/features/homepage/PartnersHomepage.page')
);
const AboutPrice = lazy(() => import('@/features/homepage/AboutPrice.page'));
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
		element: (
			<IframeChild>
				<Layout hasSidebar={false} />
			</IframeChild>
		),
		children: [
			{
				path: '/auth/signup/v2',
				element: <SignUp />,
			},
			{
				path: '/reset/request/password/v2',
				element: <PasswordResetRequest />,
			},
			{
				path: '/auth/verification/fail',
				element: <EmailVerificationFail />,
			},
		],
	},
	{
		element: <IframeChild />,
		children: [
			{
				path: '/auth/login/v2',
				element: <SignIn />,
			},
			{
				path: '/v2',
				element: <PartnersHomepage />,
			},
			{
				path: '/',
				element: <PartnersHomepage />,
			},
			{
				path: '/home/v2',
				element: <PartnersHomepage />,
			},
			{
				path: '/price/v2',
				element: <AboutPrice />,
			},
		],
	},
];

export default publicRoutes;
