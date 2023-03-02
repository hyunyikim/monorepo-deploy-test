import {Menu, MenuList} from '@/@types';
import {
	IcDashboard,
	IcLink,
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
			event: [
				'dashboard_left_dashboard_click',
				'대시보드로 화면으로 이동',
			],
		},
		{
			menu: 'guarantee',
			icon: <IcWallet />,
			title: '개런티 발급관리',
			children: [
				{
					title: '개런티 목록',
					event: [
						'dashboard_left_guaranteelist_click',
						'개런티 목륵으로 이동',
					],
					path: '/b2b/guarantee',
				},
				{
					title: '개런티 발급',
					event: [
						'dashboard_left_guaranteepublish_click',
						'개런티 발급으로 이동',
					],
					path: '/b2b/guarantee/register',
				},
				{
					title: '개런티 대량발급',
					event: [
						'dashboard_left_guaranteeexcel_click',
						'개런티 대량(엑셀)등록으로 이동',
					],
					path: '/b2b/guarantee/excel-upload',
				},
				{
					title: '개런티 설정',
					event: [
						'dashboard_left_guaranteesetting_click',
						'개런티 설정 화면으로 이동',
					],
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
					event: [
						'dashboard_left_itemlist_click',
						'상품목록으로 이동',
					],
					path: '/b2b/product',
				},
				{
					title: '상품 등록',
					event: [
						'dashboard_left_itempublish_click',
						'상품등록으로 이동',
					],
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
			event: ['dashboard_left_userlist_click', '고객관리로 이동'],
			icon: <IcUsers />,
			path: '/b2b/customer',
		},
	],
	[
		{
			menu: 'repair',
			title: '수선신청 관리',
			event: ['dashboard_left_repairlist_click', '수선 신청관리로 이동'],
			icon: <IcRepairScissors />,
			path: '/b2b/repair',
		},
	],
	[
		{
			menu: 'interwork',
			title: '서비스 연동 관리',
			event: [
				'dashboard_left_serviceinterlock_click',
				'서비스 연동관리로 이동',
			],
			icon: <IcLink />,
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

export const getSelectedDepth1Menu = (pathname: string): Menu | null => {
	const menuList: Menu[] = [
		'dashboard',
		'guarantee',
		'product',
		'customer',
		'repair',
		'interwork',
		'payment',
	];
	if (pathname.includes('/b2b/interwork')) {
		return 'interwork';
	}
	return menuList.find((menu) => pathname.includes(menu)) || null;
};

export const checkDepth2MenuSelected = (
	pathname: string,
	comparePath: string
) => {
	// 개런티, 상품은 동등 비교 추가
	if (pathname.includes('guarantee') || pathname.includes('product')) {
		if (
			pathname === '/re-setup/guarantee' &&
			comparePath === '/setup/guarantee'
		) {
			return true;
		}
		// 상세 페이지는 목록 메뉴로 지정
		const isDetailPage = /\/[\w]+\/[\w]+\/[\d]+/g.test(pathname);
		if (isDetailPage) {
			if (
				pathname.includes('guarantee') &&
				comparePath === '/b2b/guarantee'
			) {
				return true;
			}
			if (
				pathname.includes('product') &&
				comparePath === '/b2b/product'
			) {
				return true;
			}
		}
		return pathname === comparePath;
	}
	if (pathname.includes(comparePath)) {
		return true;
	}
	return false;
};
