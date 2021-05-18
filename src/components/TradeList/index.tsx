import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { selectMarkets, marketsFetch, Market, setCurrentMarket } from '../../modules';

interface TradeListProps {
	currency_id: string;
}

export const TradeList: React.FC<TradeListProps> = (props: TradeListProps) => {
	const { currency_id } = props;

	const markets = useSelector(selectMarkets);
	const dispatch = useDispatch();
	const history = useHistory();
	const dispatchFetchMarkets = () => dispatch(marketsFetch());
	React.useEffect(() => {
		dispatchFetchMarkets();
	}, []);

	const handleRedirectToTrading = (id: string) => {
		const currentMarket: Market | undefined = markets.find(item => item.id === id);

		if (currentMarket) {
			dispatch(setCurrentMarket(currentMarket));
			history.push(`/trading/${currentMarket.id}`);
		}
	};

	return (
		<div>
			{markets
				.filter(market => market.base_unit.toLowerCase() === currency_id.toLowerCase())
				.map(market => (
					<a
						style={{ color: '#fff', marginRight: '1rem', borderBottom: '1px solid #fff' }}
						onClick={() => handleRedirectToTrading(market.id)}
					>
						{market.name}
					</a>
				))}
		</div>
	);
};
