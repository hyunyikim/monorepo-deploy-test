import {MenuList} from '@/@types';
import {
	IcConcierge,
	IcDashboard,
	IcRepairScissors,
	IcShoppingBagCheck,
	IcUsers,
	IcWallet,
	IcWalletList,
} from '@/assets/icon';

export const headerHeight = '60px';
export const sidebarWidth = '260px';

export const menuList: MenuList = [
	// divider로 나눠짐
	[
		{
			menu: 'dashboard',
			icon: <IcDashboard />,
			title: '대시보드',
			path: '/dashboard',
		},
		{
			menu: 'guarantee',
			icon: <IcWallet />,
			title: '개런티 발급관리',
			children: [
				{
					title: '개런티 목록',
					path: '/b2b/guarantee',
				},
				{
					title: '개런티 발급',
					path: '/b2b/guarantee/register',
				},
				{
					title: '개런티 대량발급',
					path: '/b2b/guarantee/excel-upload',
				},
				{
					title: '개런티 설정',
					path: '/setup/guarantee',
				},
			],
		},
		{
			menu: 'product',
			title: '상품관리',
			icon: <IcShoppingBagCheck />,
			children: [
				{
					title: '상품 목록',
					path: '/b2b/product',
				},
				{
					title: '상품 등록',
					path: '/b2b/product/register',
				},
				{
					title: '상품 대량등록',
					path: '/b2b/product/excel-upload',
				},
			],
		},
		{
			menu: 'customer',
			title: '고객 관리',
			icon: <IcUsers />,
			path: '/b2b/customer',
		},
	],
	[
		{
			menu: 'repair',
			title: '수선신청 관리',
			icon: <IcRepairScissors />,
			path: '/b2b/repair',
		},
	],
	[
		{
			menu: 'interwork',
			title: '서비스 연동 관리',
			icon: <IcConcierge />,
			path: '/b2b/interwork',
		},
		{
			menu: 'payment',
			title: '구독 및 결제 관리',
			icon: <IcWalletList />,
			children: [
				{
					title: '서비스 구독 관리',
					path: '/b2b/payment/subscribe',
				},
				{
					title: '결제 정보 관리',
					path: '/b2b/payment/information',
				},
			],
		},
	],
];
