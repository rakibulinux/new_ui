import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { orderBookFetch, selectCurrentMarket } from '../modules';

export const useOrderBookFetch = () => {
	const dispatch = useDispatch();
	const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
	const currentMarket = useSelector(selectCurrentMarket);

	React.useEffect(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}
		if (currentMarket) {
			dispatch(orderBookFetch(currentMarket));
			intervalRef.current = setInterval(() => {
				dispatch(orderBookFetch(currentMarket));
			}, 3000);
		}

		return () => {
			intervalRef.current && clearInterval(intervalRef.current);
		};
	}, [currentMarket]);
};
