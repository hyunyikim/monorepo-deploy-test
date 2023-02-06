import {
	MenuList,
	MenuName,
	CurrentMenu,
	PartnershipViewMenuYN,
	YNType,
} from '@/@types';
import {
	IcConcierge,
	IcDashboard,
	IcLink,
	IcList2,
	IcRepairClothes,
	IcShoppingBagCheck,
	IcUser,
	IcUsers,
	IcWallet,
} from '@/assets/icon';

export const headerHeight = '60px';
export const sidebarWidth = '260px';

export const menuData: MenuList = [
	{
		caption: 'Home',
		list: [
			{
				num: 0,
				menu: 'dashboard',
				title: '대시보드',
				icon: <IcDashboard />,
				path: '/',
			},
		],
	},
	{
		caption: '서비스',
		list: [
			{
				menu: 'guarantee',
				title: '개런티 발급관리',
				icon: <IcWallet />,
				children: [
					{
						num: 21,
						title: '개런티 목록',
						path: '/guarantee',
					},
					{
						num: 22,
						title: '개런티 발급',
						path: '/guarantee/register',
					},
					{
						num: 23,
						title: '개런티 대량발급',
						path: '/guarantee/excel-upload',
					},
				],
			},
			{
				menu: 'product',
				title: '상품관리',
				icon: <IcShoppingBagCheck />,
				children: [
					{
						num: 31,
						title: '상품 목록',
						path: '/product',
					},
					{
						num: 32,
						title: '상품 등록',
						path: '/product/register',
					},
				],
			},
			{
				num: 2,
				menu: 'customer',
				title: '고객 관리',
				icon: <IcUsers />,
				path: '/customer',
			},
			{
				num: 3,
				menu: 'inspection',
				title: '감정 신청관리',
				icon: <IcConcierge />,
				path: '/inspection',
			},
			{
				num: 4,
				menu: 'repair',
				title: '수선 신청관리',
				icon: <IcRepairClothes />,
				path: '/repair',
			},
		],
	},
	{
		caption: '설정',
		list: [
			{
				num: 10,
				menu: 'interwork',
				title: '서비스 연동 관리',
				icon: <IcLink />,
				path: '/interwork',
			},
			{
				num: 11,
				menu: 'guarantee-setting',
				title: '개런티 설정',
				icon: <IcList2 />,
				path: '/auth/setup',
			},
			{
				num: 12,
				menu: 'profile-setting',
				title: '프로필 설정',
				icon: <IcUser />,
				path: '/setting/profile',
			},
			{
				num: 12,
				menu: 'profile-setting',
				title: '회원 탈퇴',
				icon: <IcUser />,
				path: '/setting/signout',
			},
		],
	},
	{
		caption: '정산',
		list: [
			{
				num: 6,
				menu: 'settlement-inspection',
				title: '감정 정산',
				icon: <IcWallet />,
				path: '/settlement/inspection',
			},
			{
				num: 7,
				menu: 'settlement-repair',
				title: '수선 정산',
				icon: <IcWallet />,
				path: '/settlement/repair',
			},
		],
	},
];

export const matchViewMenu = (
	partnershipViewMenuYN: PartnershipViewMenuYN | null
): MenuList => {
	if (!partnershipViewMenuYN) return [];

	const viewMenuYN: {[key in MenuName]?: YNType} = {
		// unipass: partnershipViewMenuYN.useUnipass,
		inspection: partnershipViewMenuYN.useInspect,
		'settlement-inspection': partnershipViewMenuYN.useInspect,
		repair: partnershipViewMenuYN.useRepair,
		'settlement-repair': partnershipViewMenuYN.useRepair,
	};
	return menuData.map((group) => {
		const list = group.list.filter((item) => {
			// use00로 값이 전달 되지 않는 메뉴는 모두 노출
			return (
				!viewMenuYN.hasOwnProperty(item.menu) ||
				viewMenuYN[item.menu] === 'Y'
			);
		});
		return list.length > 0 ? {...group, list} : {};
	}) as MenuList;
};

const initialMenu: CurrentMenu = {
	num: 0,
	menu: 'dashboard',
	title: '대시보드',
};

export const getCurrentMenu = (): CurrentMenu => {
	const pathname = window.location.pathname;
	let currentMenu: CurrentMenu = initialMenu;

	menuData.forEach((group) => {
		group.list?.forEach((item) => {
			if (item?.path === pathname) {
				currentMenu = {
					num: item?.num as number,
					menu: item.menu,
					title: item.title,
				};
				return;
			}
			item?.children?.forEach((child) => {
				if (child.path === pathname) {
					currentMenu = {
						num: child.num,
						menu: item.menu,
						title: child.title,
					};
					return;
				}
			});
		});
	});
	return currentMenu;
};
