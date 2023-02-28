import {Suspense} from 'react';
import {RouterProvider, createBrowserRouter} from 'react-router-dom';

import publicRoutes from '@/routes/publicRoutes';
import privateRoutes from '@/routes/privateRoutes';
import commonRoutes from '@/routes/commonRoutes';
import RouterWrapper from '@/components/common/layout/RouterWrapper';

function RootRouter() {
	const router = createBrowserRouter([
		{
			element: <RouterWrapper />,
			children: [...privateRoutes, ...publicRoutes, ...commonRoutes].map(
				(route) => ({
					...route,
					element: <Suspense>{route.element}</Suspense>,
					// TODO: Suspense 재귀 형태로 변경하기
					...(route.children && {
						children: route.children.map((child) => ({
							...child,
							element: <Suspense>{child.element}</Suspense>,
							...(child.children && {
								children: child.children.map((child2) => ({
									...child2,
									element: (
										<Suspense>{child2.element}</Suspense>
									),
								})),
							}),
						})),
					}),
				})
			),
		},
	]);

	return <RouterProvider router={router} />;
}

export default RootRouter;
