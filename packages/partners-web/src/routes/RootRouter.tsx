import React, {Suspense} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

const Dashboard = React.lazy(
	() => import('@/features/dashboard/Dashboard.page')
);
const Guarantee = React.lazy(
	() => import('@/features/guarantee/Guarantee.page')
);

// TODO: 변수로 라우팅 관리하기
function RootRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					index={true}
					element={
						<Suspense>
							<Dashboard />
						</Suspense>
					}
				/>
				<Route
					path="/guarantee"
					element={
						<Suspense>
							<Guarantee />
						</Suspense>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default RootRouter;
