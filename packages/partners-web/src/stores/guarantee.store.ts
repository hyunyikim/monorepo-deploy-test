import create from 'zustand';
import {useQuery} from '@tanstack/react-query';

import {getPlatformList} from '@/api/guarantee.api';
import {useLoginStore} from './auth.store';

interface GuaranteePreviewState {
	data: any;
	setData: (value: any) => void;
	resetData: () => void;
}

export const useGuaranteePreviewStore = create<GuaranteePreviewState>(
	(set, get) => ({
		data: null,
		setData: (value: any) =>
			set((state) => {
				return {
					data: {
						...state.data,
						...value,
					},
				};
			}),
		resetData: () =>
			set(() => ({
				data: null,
			})),
	})
);

export const useGetPlatformList = () => {
	const token = useLoginStore().token;
	return useQuery({
		queryKey: ['sellerList', token],
		queryFn: getPlatformList,
		select: (data) =>
			data.map((item) => ({
				value: item.platformIdx,
				label: item.platformName,
			})),
	});
};
