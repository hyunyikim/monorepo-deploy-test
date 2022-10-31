import create from 'zustand';

import {PartnershipInfoResponse} from '@/@types';

interface PartnershipState {
	data: PartnershipInfoResponse | null;
	setData: (value: PartnershipInfoResponse) => void;
	adminIdx: () => number | null;
	parentIdx: () => number | null;
}

export const usePartnershipStore = create<PartnershipState>((set, get) => ({
	data: null,
	setData: (value) => set(() => ({data: value})),
	adminIdx: () => get().data?.idx ?? null,
	parentIdx: () => get().data?.parentIdx ?? null,
}));
