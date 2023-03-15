import React, {Suspense, useEffect, useState} from 'react';
import {RouterProvider, createBrowserRouter} from 'react-router-dom';
import {ErrorBoundary} from 'react-error-boundary';

import publicRoutes from '@/routes/publicRoutes';
import privateRoutes from '@/routes/privateRoutes';
import commonRoutes from '@/routes/commonRoutes';
import RouterWrapper from '@/components/common/layout/RouterWrapper';
import Error from '@/features/common/Error.page';

function RootRouter() {
	const router = createBrowserRouter([
		{
			element: <RouterWrapper />,
			children: [...privateRoutes, ...publicRoutes, ...commonRoutes].map(
				(route) => ({
					...route,
					element: (
						<CustomErrorBoundary>
							<Suspense>{route.element}</Suspense>
						</CustomErrorBoundary>
					),
					// TODO: Suspense 재귀 형태로 변경하기
					...(route.children && {
						children: route.children.map((child) => ({
							...child,
							element: (
								<CustomErrorBoundary>
									<Suspense>{child.element}</Suspense>
								</CustomErrorBoundary>
							),
							...(child.children && {
								children: child.children.map((child2) => ({
									...child2,
									element: (
										<CustomErrorBoundary>
											<Suspense>
												{child2.element}
											</Suspense>
										</CustomErrorBoundary>
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

const CustomErrorBoundary = ({children}: {children: React.ReactElement}) => {
	return (
		<ErrorBoundary fallback={<Error />} resetKeys={[new Date().getTime()]}>
			{children}
		</ErrorBoundary>
	);
};

export default RootRouter;
