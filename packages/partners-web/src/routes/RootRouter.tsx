import {Suspense, lazy} from 'react';
import {
	RouterProvider,
	createBrowserRouter,
	RouteObject,
} from 'react-router-dom';

import Layout from '@/components/common/layout/Layout';
import IframeChild from '@/components/common/layout/IframeChild';

const SetupGuarantee = lazy(
	() => import('@/features/setup/SetupGuarantee.page')
);
const ResetupGuarantee = lazy(
	() => import('@/features/setup/ResetupGuarantee.page')
);
const Guarantee = lazy(
	() => import('@/features/guarantee/List/GuaranteeList.page')
);
const GuaranteeRegister = lazy(
	() => import('@/features/guarantee/Register/GuaranteeRegister.page')
);
const GuaranteeDetail = lazy(
	() => import('@/features/guarantee/Detail/GuaranteeDetail.page')
);
const Product = lazy(() => import('@/features/product/List/ProductList.page'));
const ProductRegister = lazy(
	() => import('@/features/product/Register/ProductRegister.page')
);
const Customer = lazy(
	() => import('@/features/customer/List/CustomerList.page')
);
const CustomerDetail = lazy(
	() => import('@/features/customer/Detail/CustomerDetail.page')
);
const ProfileSetting = lazy(
	() => import('@/features/profileSetting/ProfileSetting.page')
);
const Inspection = lazy(
	() => import('@/features/inspection/List/InspectionList.page')
);
const Repair = lazy(() => import('@/features/repair/List/RepairList.page'));
const SignUp = lazy(() => import('@/features/auth/signup/SignUp.page'));
const EmailVerificationFail = lazy(
	() => import('@/features/auth/verification/EmailVerificationFail.page')
);
const NotFound = lazy(() => import('@/features/common/NotFound.page'));

const privateRouter: RouteObject[] = [
	// TODO: 임시 주석처리, 아예 신규 프로젝트로 이관 완료되면 그때 다시 정리
	// {
	// 	element: <Layout />,
	// 	children: [
	// 		{path: '/', element: <Dashboard />},
	// 		{path: '/guarantee', element: <Guarantee />},
	// 		{path: '/customer', element: <Customer />},
	// 		{
	// 			path: '*',
	// 			element: <NotFound />,
	// 		},
	// 	],
	// },

	// 기존 VP 안에 iframe 형태로 들어갈 컴포넌트
	{
		element: <IframeChild />,
		children: [
			{path: '/b2b/guarantee/v2', element: <Guarantee />},
			{
				path: '/b2b/guarantee/register/v2',
				element: <GuaranteeRegister />,
			},
			{
				path: '/b2b/guarantee/:idx/v2',
				element: <GuaranteeDetail />,
			},
			{
				path: '/b2b/guarantee/edit/:idx/v2',
				element: <GuaranteeRegister />,
			},
			{path: '/b2b/product/v2', element: <Product />},
			{path: '/b2b/product/register/v2', element: <ProductRegister />},
			{path: '/b2b/product/edit/:idx/v2', element: <ProductRegister />},
			{path: '/b2b/customer/v2', element: <Customer />},
			{
				path: '/b2b/customer/:name/:phone/v2',
				element: <CustomerDetail />,
			},
			{path: '/b2b/inspection/v2', element: <Inspection />},
			{path: '/b2b/repair/v2', element: <Repair />},

			{path: '/setting/profile/v2', element: <ProfileSetting />},

			{path: '/setup/guarantee/v2', element: <SetupGuarantee />},
			{path: '/re-setup/guarantee/v2', element: <ResetupGuarantee />},
			{path: '*', element: <NotFound />},
		],
	},
];

const publicRouter: RouteObject[] = [
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
				path: '/auth/verification/fail',
				element: <EmailVerificationFail />,
			},
			{path: '*', element: <NotFound />},
		],
	},
];

function RootRouter() {
	// const isLogin = useLoginStore((state) => state.isLogin);
	return (
		<RouterProvider
			router={createBrowserRouter(
				// (isLogin ? privateRouter : publicRouter).map((route) => ({
				[...publicRouter, ...privateRouter].map((route) => ({
					...route,
					element: <Suspense>{route.element}</Suspense>,
				}))
			)}
		/>
	);
}

export default RootRouter;
