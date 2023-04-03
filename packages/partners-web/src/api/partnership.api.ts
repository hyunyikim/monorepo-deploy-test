import {instance} from '@/api';
import {useLoginStore} from '@/stores';

import {PartnershipInfoResponse, Options} from '@/@types';

const setLogout = useLoginStore.getState().setLogout;

export const getPartnershipInfo = async () => {
	try {
		return await instance.get<PartnershipInfoResponse>(
			'/v1/admin/partnerships'
		);
	} catch (e) {
		if (e?.response?.status === 404) {
			alert('로그아웃 되었습니다. 다시 로그인 후 사용해주세요.');
			setLogout();
			window.location.reload();
			return;
		}
	}
};
