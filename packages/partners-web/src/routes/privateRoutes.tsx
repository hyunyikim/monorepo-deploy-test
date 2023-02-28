import {lazy} from 'react';
import {RouteObject} from 'react-router-dom';

import Layout from '@/components/common/layout/Layout';
import CheckAuth from '@/components/common/layout/CheckAuth';
import ServiceInterworkKakao from '@/features/service-interwork/Detail/ServiceInterworkKakao.page';

const Dashboard = lazy(() => import('@/features/dashboard/Dashboard.page'));
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
const GuaranteeExcelUpload = lazy(
	() => import('@/features/guarantee/ExcelUpload/GuaranteeExcelUpload.page')
);
const GuaranteeDetail = lazy(
	() => import('@/features/guarantee/Detail/GuaranteeDetail.page')
);
const Product = lazy(() => import('@/features/product/List/ProductList.page'));
const ProductDetail = lazy(
	() => import('@/features/product/Detail/ProductDetail.page')
);
const ProductRegister = lazy(
	() => import('@/features/product/Register/ProductRegister.page')
);
const ProductExcelUpload = lazy(
	() => import('@/features/product/ExcelUpload/ProductExcelUpload.page')
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
const Signout = lazy(() => import('@/features/profileSetting/Signout.page'));
const Signedout = lazy(
	() => import('@/features/profileSetting/Signedout.page')
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
const SubscribeManagement = lazy(
	() => import('@/features/payment/Subscribe/SubscribeManagement.page')
);
const PaymentInformation = lazy(
	() =>
		import('@/features/payment/PaymentInformation/PaymentInformation.page')
);
const Cafe24Interwork = lazy(
	() => import('@/features/cafe24/Cafe24Interwork.page')
);

const privateRoutes: RouteObject[] = [
	{
		element: <CheckAuth />,
		children: [
			{
				element: <Layout />,
				children: [
					{
						path: '/dashboard',
						element: <Dashboard />,
					},
					{
						path: '/b2b/guarantee',
						element: <Guarantee />,
					},
					{
						path: '/b2b/guarantee/register',
						element: <GuaranteeRegister />,
					},
					{
						path: '/b2b/guarantee/:idx',
						element: <GuaranteeDetail />,
					},
					{
						path: '/b2b/guarantee/edit/:idx',
						element: <GuaranteeRegister />,
					},
					{
						path: '/b2b/guarantee/excel-upload',
						element: <GuaranteeExcelUpload />,
					},
					{path: '/b2b/product', element: <Product />},
					{path: '/b2b/product/:idx', element: <ProductDetail />},
					{
						path: '/b2b/product/register',
						element: <ProductRegister />,
					},
					{
						path: '/b2b/product/edit/:idx',
						element: <ProductRegister />,
					},
					{path: '/b2b/customer', element: <Customer />},
					{
						path: '/b2b/product/guarantee-upload',
						element: <GuaranteeRegister />,
					},
					{path: '/b2b/product', element: <Product />},
					{path: '/b2b/product/:idx', element: <ProductDetail />},
					{
						path: '/b2b/product/register',
						element: <ProductRegister />,
					},
					{
						path: '/b2b/product/edit/:idx',
						element: <ProductRegister />,
					},
					{
						path: '/b2b/product/excel-upload',
						element: <ProductExcelUpload />,
					},
					{path: '/b2b/customer', element: <Customer />},
					{
						path: '/b2b/customer/:name/:phone',
						element: <CustomerDetail />,
					},
					{path: '/b2b/inspection', element: <Inspection />},
					{path: '/b2b/repair', element: <Repair />},
					{path: '/b2b/repair/:idx', element: <RepairDetail />},
					{path: '/b2b/interwork', element: <ServiceInterwork />},
					{
						path: '/b2b/interwork/cafe24',
						element: <ServiceInterworkCafe24 />,
					},
					{
						path: '/b2b/interwork/repair',
						element: <ServiceInterworkRepair />,
					},
					{
						path: '/b2b/interwork/kakao',
						element: <ServiceInterworkKakao />,
					},
					{
						path: '/b2b/payment/subscribe',
						element: <SubscribeManagement />,
					},
					{
						path: '/b2b/payment/information',
						element: <PaymentInformation />,
					},
					{path: '/setting/profile', element: <ProfileSetting />},
					{path: '/setting/signout', element: <Signout />},
					{path: '/setup/guarantee', element: <SetupGuarantee />},
					{
						path: '/re-setup/guarantee',
						element: <ResetupGuarantee />,
					},
					{path: '/cafe24/interwork', element: <Cafe24Interwork />},
				],
			},
			{
				path: '/reset/password',
				element: <PasswordReset />,
			},
			{
				path: '/signedout',
				element: <Signedout />,
			},
		],
	},
];

export default privateRoutes;
