import {lazy} from 'react';
import {RouteObject} from 'react-router-dom';

import Layout from '@/components/common/layout/Layout';
import PartnersHomepage from '@/features/homepage/PartnersHomepage.page';
const Cafe24Init = lazy(() => import('@/features/cafe24/Cafe24Init.page'));
const Cafe24Interwork = lazy(
	() => import('@/features/cafe24/Cafe24Interwork.page')
);
const NotFound = lazy(() => import('@/features/common/NotFound.page'));
const AboutPrice = lazy(() => import('@/features/homepage/AboutPrice.page'));
const Inquiry = lazy(() => import('@/features/homepage/Inquiry.page'));

// 로그인 여부 상관 없이 접근 가능한 페이지
const commonRoutes: RouteObject[] = [
	{
		element: <Layout hasHeader={false} hasSidebar={false} />,
		children: [
			{
				path: '/',
				element: <PartnersHomepage />,
			},
		],
	},
	{
		element: <Layout hasHeader={true} hasSidebar={false} />,
		children: [{path: '/cafe24/interwork', element: <Cafe24Interwork />}],
	},
	{
		path: '/pricing',
		element: <AboutPrice />,
	},
	{
		path: '/inquiry',
		element: <Inquiry />,
	},
	{path: '/cafe24/init', element: <Cafe24Init />},
	{path: '*', element: <NotFound />},
];

export default commonRoutes;
