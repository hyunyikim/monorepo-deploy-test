import {instance, bearerTokenInstance} from '@/api';
import {
	DashboardGuranteeParamsType,
	DashboardCustomersParamsType,
} from '@/@types/dashboard.types';

/* 대시보드 공지사항 불러오기 */
export const getNoticeTableList = async () => {
	const data = await fetch(
		`https://notion-api.splitbee.io/v1/table/55a4847010be4506aa3772ba2790941b`
	).then((res) => res.json());

	return data;
};

/* 개런티 발급 현황 데이터 */
export const getDashboardGuaranteeOverview = async (
	params: DashboardGuranteeParamsType
) => {
	return await bearerTokenInstance.get('/v1/admin/nft/dashboard', {
		params: {
			dateType: params.dateType,
		},
	});
};

/* 고객현황 데이터 */
export const getDashboardCustomerOverview = async (
	params: DashboardCustomersParamsType
) => {
	return await bearerTokenInstance.get('/v1/admin/customers/dashboard', {
		params: {
			from: params.from,
			to: params.to,
		},
	});
};

/* 수선현황 데이터 */
export const getDashboardRepairOverview = async (
	params: DashboardCustomersParamsType
) => {
	return await bearerTokenInstance.get('/v1/admin/repair/dashboard', {
		params: {
			from: params.from,
			to: params.to,
		},
	});
};

// export const getDashboardRepairOverview = async () => {
// 	return await bearerTokenInstance.get('/v1/admin/nft/dashboard', data);
// };
