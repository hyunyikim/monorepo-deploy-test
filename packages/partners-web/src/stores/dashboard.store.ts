import create from 'zustand';

interface GuaranteeOverviewState {
	data: any;
	setData: (value: any) => void;
}

export const dashboardGuaranteeStore = create<GuaranteeOverviewState>(
	(set, get) => ({
		data: {
			WEEKLY: null,
			MONTHLY: null,
		},
		setData: (value: any) =>
			set((state) => {
				return {
					data: {
						...state.data,
						...value,
					},
				};
			}),
	})
);

export const dashboardCustomerStore = create<GuaranteeOverviewState>(
	(set, get) => ({
		data: {
			WEEKLY: null,
			MONTHLY: null,
		},
		setData: (value: any) =>
			set((state) => {
				return {
					data: {
						...state.data,
						...value,
					},
				};
			}),
	})
);

export const dashboardRepairStore = create<GuaranteeOverviewState>(
	(set, get) => ({
		data: {
			WEEKLY: null,
			MONTHLY: null,
		},
		setData: (value: any) =>
			set((state) => {
				return {
					data: {
						...state.data,
						...value,
					},
				};
			}),
	})
);
