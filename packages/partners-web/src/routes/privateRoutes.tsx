import {lazy} from 'react';
import {RouteObject} from 'react-router-dom';

import IframeChild from '@/components/common/layout/IframeChild';
import Layout from '@/components/common/layout/Layout';
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
	// 기존 VP 안에 iframe 형태로 들어갈 컴포넌트
	{
		element: <IframeChild />,
		children: [
			/* TODO: 대쉬보드 작업때 주석 제거! */
			/* {path: '/dashboard/v2', element: <Dashboard />}, */
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
			{
				path: '/b2b/guarantee/excel-upload/v2/v2',
				element: <GuaranteeExcelUpload />,
			},
			{path: '/b2b/product/v2', element: <Product />},
			{path: '/b2b/product/:idx/v2', element: <ProductDetail />},
			{path: '/b2b/product/register/v2', element: <ProductRegister />},
			{path: '/b2b/product/edit/:idx/v2', element: <ProductRegister />},
			{
				path: '/b2b/product/excel-upload/v2/v2',
				element: <ProductExcelUpload />,
			},
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
			{
				path: '/b2b/interwork/kakao/v2',
				element: <ServiceInterworkKakao />,
			},
			{
				path: '/b2b/payment/subscribe/v2',
				element: <SubscribeManagement />,
			},
			{
				path: '/b2b/payment/information/v2',
				element: <PaymentInformation />,
			},
			{path: '/setting/profile/v2', element: <ProfileSetting />},
			{path: '/setting/signout/v2', element: <Signout />},
			{path: '/setup/guarantee/v2', element: <SetupGuarantee />},
			{path: '/re-setup/guarantee/v2', element: <ResetupGuarantee />},
			{path: '/cafe24/interwork/v2', element: <Cafe24Interwork />},
		],
	},
	{
		element: (
			<IframeChild>
				<Layout hasSidebar={false} />
			</IframeChild>
		),
		children: [
			{path: '/reset/password/v2', element: <PasswordReset />},
			{
				path: '/signedout/v2',
				element: <Signedout />,
			},
		],
	},
];

export default privateRoutes;
