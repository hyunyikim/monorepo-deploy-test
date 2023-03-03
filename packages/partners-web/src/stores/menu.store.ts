import {useQueries} from '@tanstack/react-query';

import {menuList, initialSearchFilter} from '@/data';
import {useLoginStore} from './auth.store';
import {getPartnershipInfo} from '@/api/partnership.api';
import {getRepairList} from '@/api/repair.api';

export const useGetMenu = () => {
	const token = useLoginStore().token;
	const [data1, data2] = useQueries({
		queries: [
			{
				queryKey: ['partnershipInfo', token],
				queryFn: getPartnershipInfo,
				suspense: true,
			},
			{
				queryKey: ['repairList', token],
				queryFn: () =>
					getRepairList({
						...initialSearchFilter,
						searchType: 'all',
						status: '',
						startDate: '',
						endDate: '',
					}),
				suspense: true,
			},
		],
	});
	const useMenuRepair = data1?.data?.useRepair === 'Y' ? true : false;
	const isRepairDataExisted = data2?.data?.total || 0 > 0 ? true : false;
	const showMenuRepair = useMenuRepair || isRepairDataExisted;
	const finishedGuaranteeSetting = data1?.data?.profileImage ? true : false;

	return menuList
		.map((groupMenu) => {
			const filteredGroupMenu = groupMenu.filter((menu) => {
				if (menu.menu === 'repair' && !showMenuRepair) {
					return false;
				}
				return true;
			});

			const res = filteredGroupMenu.map((menu) => ({
				...menu,
				emphasis:
					menu.menu === 'guarantee' && !finishedGuaranteeSetting
						? true
						: false,
				children: menu.children?.map((child) => ({
					...child,
					emphasis:
						child.path === '/setup/guarantee' &&
						!finishedGuaranteeSetting
							? true
							: false,
				})),
			}));
			return res;
		})
		.filter((groupMenu) => groupMenu && groupMenu.length > 0);
};
