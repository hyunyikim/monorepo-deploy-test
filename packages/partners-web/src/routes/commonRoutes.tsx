import {lazy} from 'react';
import {RouteObject} from 'react-router-dom';

import IframeChild from '@/components/common/layout/IframeChild';
const PartnersHomepage = lazy(
	() => import('@/features/homepage/PartnersHomepage.page')
);
const Cafe24Init = lazy(() => import('@/features/cafe24/Cafe24Init.page'));
const NotFound = lazy(() => import('@/features/common/NotFound.page'));

// 로그인 여부 상관 없이 접근 가능한 페이지
const commonRoutes: RouteObject[] = [
	{
		// element: <IframeChild />,
		// children: [
		// 	{path: '/cafe24/init/v2', element: <Cafe24Init />},
		// 	// {
		// 	// 	path: '/home/v2',
		// 	// 	element: <PartnersHomepage />,
		// 	// },
		// 	// {
		// 	// 	path: '/v2',
		// 	// 	element: <PartnersHomepage />,
		// 	// },
		// 	// {
		// 	// 	path: '/',
		// 	// 	element: <PartnersHomepage />,
		// 	// },
		// 	{path: '*', element: <NotFound />},
		// ],
		element: <IframeChild />,
		children: [
			{path: '/cafe24/init/v2', element: <Cafe24Init />},
			{path: '*', element: <NotFound />},
		],
	},
];

export default commonRoutes;
