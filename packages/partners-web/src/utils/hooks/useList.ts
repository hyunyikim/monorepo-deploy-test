import {useEffect, useCallback, useState, useMemo, ChangeEvent} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import qs from 'qs';

import {defaultPageSize} from '@/data';
import {sortObjectByKey} from '@/utils';

interface Props<D, F> {
	apiFunc: (value: F, ...rest: any[]) => Promise<D>;
	apiRestParam?: unknown[];
	initialFilter: F;
}

/**
 * url 쿼리스트링으로 조회할 파라미터의 상태를 관리한다.
 */
const useList = <
	D extends {total?: number; totalNo?: number},
	F extends object
>({
	apiFunc,
	apiRestParam = [],
	initialFilter,
}: Props<D, F>) => {
	const navigate = useNavigate();
	const {pathname, search} = useLocation();
	const [data, setData] = useState<D | null>(null);

	const parsedSearch = useMemo<F>(() => {
		const res = qs.parse(search, {
			ignoreQueryPrefix: true,
		}) as unknown as F & {
			token: string;
			b2btype: string;
			email: string;
			useFieldModelNum?: string;
		};
		const {token, b2btype, email, useFieldModelNum, ...otherSearch} = res;
		return otherSearch as F;
	}, [search]);

	const totalSize = useMemo<number>(() => {
		if (data) {
			return data?.total ?? data?.totalNo ?? 0;
		}
		return 0;
	}, [data]);

	// TODO: 선언적으로 로딩/에러 다룰 수 있도록 변경하기
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<any | null>(null);

	const handleLoadData = useCallback((params: F) => {
		(async () => {
			try {
				setIsLoading(true);
				setError(null);
				const data = await apiFunc(params, ...apiRestParam);
				setData(data);
			} catch (e: any) {
				console.log('e :>> ', e);
				setError(e);
			} finally {
				setIsLoading(false);
			}
		})();
	}, []);

	useEffect(() => {
		// 최초 해당 메뉴 진입시 init filter
		const isInitialSearch = Object.keys(parsedSearch).length === 0;
		// 조회되어야 하는 필터의 개수와 맞지 않을 경우(url을 통해서 부분 필터만 전달 되었을 경우)
		const isSeveralSearch =
			Object.keys(initialFilter).length !==
			Object.keys(parsedSearch).length;

		if (isInitialSearch || isSeveralSearch) {
			const param = {
				...initialFilter,
				...parsedSearch,
			};
			navigate(`${pathname}?${qs.stringify(param)}`, {
				replace: true,
			});
			return;
		}
		handleLoadData(parsedSearch);
	}, [parsedSearch]);

	const handleChangeFilter = useCallback(
		(newParam: {[key: string]: any}) => {
			// Pagination이 눌렸을 때만, 페이지 값 변경
			// 그 외 필터 변경 되었을 때는 페이지 초기화
			const pageParam: {
				currentPage?: number;
				page?: number;
			} = {};

			if (newParam.hasOwnProperty('currentPage')) {
				pageParam['currentPage'] = newParam?.currentPage;
			}
			const chaningQuery = qs.stringify({
				...parsedSearch,
				...newParam,
				...pageParam,
			});
			navigate(`${pathname}?${chaningQuery}`, {
				replace: true,
			});
		},
		[pathname, parsedSearch]
	);

	const handleSearch = (param: F) => {
		const sortedParsedSearch = sortObjectByKey(parsedSearch);
		const newParam = {
			...parsedSearch,
			...param,
		};
		const sortedParam = sortObjectByKey(newParam);

		const paramChanged =
			JSON.stringify(sortedParsedSearch) !== JSON.stringify(sortedParam);

		// 신규 파라미터라면, query string 변경
		if (paramChanged) {
			handleChangeFilter(newParam);
			return;
		}

		// 동일한 파라미터라면, 데이터 재호출
		handleLoadData(parsedSearch);
	};

	const handleReset = useCallback(() => {
		handleChangeFilter(initialFilter);
	}, []);

	const paginationProps = useMemo(() => {
		const currentPage = Number(
			(parsedSearch as F & {currentPage: number})?.currentPage ?? 1
		);
		const pageMaxNum = Number(
			(parsedSearch as F & {pageMaxNum: number})?.pageMaxNum ??
				defaultPageSize
		);
		const count = Math.ceil(totalSize / pageMaxNum);
		return {
			page: currentPage,
			count,
			onChange: (_: ChangeEvent<unknown>, page: number) => {
				handleChangeFilter({
					currentPage: Number(page),
				});
			},
		};
	}, [parsedSearch, totalSize, handleChangeFilter]);

	return {
		isLoading,
		error,
		data,
		totalSize,
		paginationProps,
		filter: parsedSearch,
		handleChangeFilter,
		handleSearch,
		handleReset,
	};
};

export default useList;