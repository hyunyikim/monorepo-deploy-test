import {useEffect} from 'react';

import {useBackgroundColorStore} from '@/stores';

/**
 * 배경색상을 정의하는 custom hook
 * - page 단위에서 호출해야 합니다.
 * - 배경색상이 없는 경우 해당 hook을 호출하지 않아도 됩니다.
 *
 * @param {string?} color
 */
const useBackground = (color?: string) => {
	const setBackgroundColor = useBackgroundColorStore(
		(state) => state.setBackgroundColor
	);
	const resetBackgroundColor = useBackgroundColorStore(
		(state) => state.resetBackgroundColor
	);

	useEffect(() => {
		if (color) {
			setBackgroundColor(color);
		}
		return () => {
			resetBackgroundColor();
		};
	}, []);
};

export default useBackground;
