import {useCallback, useMemo} from 'react';
import {parse, stringify} from 'qs';
import {useLocation, useNavigate} from 'react-router-dom';

interface RequestParam {
	key: string;
	defaultValue: string;
}

const useTabQueryParam = ({key, defaultValue}: RequestParam) => {
	const navigate = useNavigate();
	const location = useLocation();

	const parsedParam = useMemo(() => {
		return parse(location.search, {
			ignoreQueryPrefix: true,
		});
	}, [location.search]);

	const selectedValue = useMemo(() => {
		if (parsedParam && parsedParam?.hasOwnProperty(key)) {
			return parsedParam[key];
		}
		return defaultValue;
	}, [parsedParam, key, defaultValue]);

	const handleChangeTab = useCallback(
		(value: string) => {
			const newQueryParam = stringify(
				{
					...parsedParam,
					...{[key]: value},
				},
				{
					addQueryPrefix: true,
				}
			);
			navigate(`${location.pathname}${newQueryParam}`, {
				replace: true,
			});
		},
		[location.pathname, parsedParam, key]
	);
	return {
		selectedValue,
		handleChangeTab,
	};
};

export default useTabQueryParam;
