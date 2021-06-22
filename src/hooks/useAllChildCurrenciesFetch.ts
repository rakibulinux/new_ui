import { allChildCurrenciesFetch } from 'modules';
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

export const useAllChildCurrenciesFetch = () => {
	const dispatch = useDispatch();
	const dispatchcFetchAllChildCurrencies = useCallback(() => dispatch(allChildCurrenciesFetch()), [dispatch]);

	useEffect(() => {
		dispatchcFetchAllChildCurrencies();
	}, [dispatchcFetchAllChildCurrencies]);
};
