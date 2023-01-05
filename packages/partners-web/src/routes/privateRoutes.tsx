import {lazy} from 'react';
import {RouteObject} from 'react-router-dom';

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
const PasswordReset = lazy(
	() => import('@/features/auth/password-reset/PasswordReset.page')
);
const Inspection = lazy(
	() => import('@/features/inspection/List/InspectionList.page')
);
const Repair = lazy(() => import('@/features/repair/List/RepairList.page'));
const RepairDetail = lazy(
	() => import('@/features/repair/Detail/RepairDetail.page')
);
const ServiceInterwork = lazy(
	() => import('@/features/service-interwork/List/ServiceInterworkList.page')
);
const ServiceInterworkCafe24 = lazy(
	() =>
		import(
			'@/features/service-interwork/Detail/Cafe24/ServiceInterworkCafe24.page'
		)
);
const ServiceInterworkRepair = lazy(
	() =>
		import(
			'@/features/service-interwork/Detail/ServiceInterworkRepair.page'
		)
);
const Cafe24Interwork = lazy(
	() => import('@/features/cafe24/Cafe24Interwork.page')
);

const privateRoutes: RouteObject[] = [
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
			{path: '/b2b/repair/:idx/v2', element: <RepairDetail />},
			{path: '/b2b/interwork/v2', element: <ServiceInterwork />},
			{
				path: '/b2b/interwork/cafe24/v2',
				element: <ServiceInterworkCafe24 />,
			},
			{
				path: '/b2b/interwork/repair/v2',
				element: <ServiceInterworkRepair />,
			},
			{path: '/setting/profile/v2', element: <ProfileSetting />},
			{path: '/setup/guarantee/v2', element: <SetupGuarantee />},
			{path: '/re-setup/guarantee/v2', element: <ResetupGuarantee />},
			{path: '/cafe24/interwork/v2', element: <Cafe24Interwork />},
		],
	},
	{
		element: <IframeChild />,
		children: [{path: '/reset/password/v2', element: <PasswordReset />}],
	},
];

export default privateRoutes;
