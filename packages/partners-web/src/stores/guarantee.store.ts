import create from 'zustand';

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
