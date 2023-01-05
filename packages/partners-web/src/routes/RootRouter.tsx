import {Suspense} from 'react';
import {RouterProvider, createBrowserRouter} from 'react-router-dom';

import publicRoutes from '@/routes/publicRoutes';
import privateRoutes from '@/routes/privateRoutes';
import commonRoutes from '@/routes/commonRoutes';

function RootRouter() {
	return (
		<RouterProvider
			router={createBrowserRouter(
				[...publicRoutes, ...privateRoutes, ...commonRoutes].map(
					(route) => ({
						...route,
						element: <Suspense>{route.element}</Suspense>,
					})
				)
			)}
		/>
	);
}

export default RootRouter;
