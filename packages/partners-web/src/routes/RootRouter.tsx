import {Suspense, lazy} from 'react';
import {
	RouterProvider,
	createBrowserRouter,
	RouteObject,
	Navigate,
} from 'react-router-dom';

import Layout from '@/components/common/layout/Layout';
import IframeChild from '@/components/common/layout/IframeChild';
const Dashboard = lazy(() => import('@/features/dashboard/Dashboard.page'));
const Guarantee = lazy(
	() => import('@/features/guarantee/List/GuaranteeList.page')
);
const Product = lazy(() => import('@/features/product/List/ProductList.page'));
const Customer = lazy(
	() => import('@/features/customer/List/CustomerList.page')
);
const CustomerDetail = lazy(
	() => import('@/features/customer/Detail/CustomerDetail.page')
);
const Inspection = lazy(
	() => import('@/features/inspection/List/InspectionList.page')
);
const Repair = lazy(() => import('@/features/repair/List/RepairList.page'));
const SignIn = lazy(() => import('@/features/auth/signin/SignIn.page'));
const SignUp = lazy(() => import('@/features/auth/signup/SignUp.page'));
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
			{path: '/', element: <NotFound />},
			{path: '/b2b/guarantee/v2', element: <Guarantee />},
			{path: '/b2b/product/v2', element: <Product />},
			{path: '/b2b/customer/v2', element: <Customer />},
			{path: '/b2b/customer/:idx/v2', element: <CustomerDetail />},
			{path: '/b2b/inspection/v2', element: <Inspection />},
			{path: '/b2b/repair/v2', element: <Repair />},
		],
	},
];

const publicRouter: RouteObject[] = [
	{
		path: '/auth/signin',
		element: <SignIn />,
	},
	{
		path: '/auth/signup',
		element: <SignUp />,
	},
	{
		path: '*',
		element: <Navigate to="/auth/signin" replace />,
	},
];

function RootRouter() {
	// const isLogin = useLoginStore((state) => state.isLogin);
	return (
		<RouterProvider
			router={createBrowserRouter(
				// (isLogin ? privateRouter : publicRouter).map((route) => ({
				privateRouter.map((route) => ({
					...route,
					element: <Suspense>{route.element}</Suspense>,
				}))
			)}
		/>
	);
}

export default RootRouter;
