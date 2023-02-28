import {Suspense} from 'react';
import {RouterProvider, createBrowserRouter} from 'react-router-dom';

import publicRoutes from '@/routes/publicRoutes';
import privateRoutes from '@/routes/privateRoutes';
import commonRoutes from '@/routes/commonRoutes';

function RootRouter() {
	const router = createBrowserRouter(
		[...privateRoutes, ...publicRoutes, ...commonRoutes].map((route) => ({
			...route,
			element: <Suspense>{route.element}</Suspense>,
		}))
	);

	return <RouterProvider router={router} />;
}

export default RootRouter;
