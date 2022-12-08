import {useCallback, useMemo, useState} from 'react';

const useCheckboxList = ({
	idxList,
	handleChangeFilter,
}: {
	idxList: number[];
	handleChangeFilter: (newParam: {[key: string]: any}) => void;
}) => {
	const [checkedIdxList, setCheckedIdxList] = useState<number[]>([]);

	const checkedTotal = useMemo(() => {
		if (idxList?.length < 1 || checkedIdxList?.length < 1) {
			return false;
		}
		if (idxList?.length === checkedIdxList?.length) {
			return true;
		}
		return false;
	}, [idxList, checkedIdxList]);

	const onCheckItem = useCallback(
		(idx: number, checked: boolean) => {
			if (checked) {
				setCheckedIdxList((prev) => [...prev, idx]);
				return;
			}
			setCheckedIdxList((prev) => prev.filter((item) => item !== idx));
		},
		[setCheckedIdxList]
	);

	const onCheckTotalItem = useCallback(
		(checked: boolean) => {
			if (checked) {
				setCheckedIdxList(idxList);
				return;
			}
			setCheckedIdxList([]);
		},
		[idxList]
	);

	const onResetCheckedItem = useCallback(() => {
		setCheckedIdxList([]);
	}, []);

	const onHandleChangeFilter = useCallback(
		(newParam: {[key: string]: any}) => {
			onResetCheckedItem();
			handleChangeFilter(newParam);
		},
		[onResetCheckedItem, handleChangeFilter]
	);

	return {
		checkedIdxList,
		checkedTotal,
		onCheckItem,
		onCheckTotalItem,
		onResetCheckedItem,
		onHandleChangeFilter,
	};
};

export default useCheckboxList;
