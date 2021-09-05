import * as React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ConvertUsd, Decimal, NewHomeMarketTable } from '../../components';

import { useMarketsFetch, useMarketsTickersFetch, useRangerConnectFetch } from '../../hooks';
import { Market, selectMarkets, selectMarketTickers, setCurrentMarket, selectCurrencies } from '../../modules';

const defaultTicker = {
	amount: '0.0',
	last: '0.0',
	high: '0.0',
	open: '0.0',
	low: '0.0',
	price_change_percent: '+0.00%',
	volume: '0.0',
};

export const HomepageMarket = props => {
	useMarketsFetch();
	useMarketsTickersFetch();
	useRangerConnectFetch();
	const history = useHistory();
	const dispatch = useDispatch();
	const markets = useSelector(selectMarkets);
	const marketTickers = useSelector(selectMarketTickers);
	const currencies = useSelector(selectCurrencies);

	const handleRedirectToTrading = (id: string) => {
		const currentMarket: Market | undefined = markets.find(item => item.id === id);
		if (currentMarket) {
			props.handleChangeCurrentMarket && props.handleChangeCurrentMarket(currentMarket);
			dispatch(setCurrentMarket(currentMarket));
			history.push(`/trading/${currentMarket.id}`);
		}
	};

	const currentBidUnitMarkets = (props.markets || markets) as typeof markets;

	const findIcon = (code: string): string => {
		const currency = currencies.find((currency: any) => String(currency.id).toLowerCase() === code.toLowerCase());
		try {
			return require(`../../../node_modules/cryptocurrency-icons/128/color/${code.toLowerCase()}.png`);
		} catch (err) {
			if (currency) {
				return currency.icon_url;
			}

			return require('../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
		}
	};

	const formattedMarkets = currentBidUnitMarkets.length
		? currentBidUnitMarkets

				// .filter(market => market.base_unit.toLowerCase().includes(searchMarketInputState.toLowerCase()))
				.map(market => {
					return {
						...market,
						last: Decimal.format(Number((marketTickers[market.id] || defaultTicker).last), market.price_precision),
						open: Decimal.format(Number((marketTickers[market.id] || defaultTicker).open), market.price_precision),
						price_change_percent: String((marketTickers[market.id] || defaultTicker).price_change_percent),
						high: Decimal.format(Number((marketTickers[market.id] || defaultTicker).high), market.price_precision),
						low: Decimal.format(Number((marketTickers[market.id] || defaultTicker).low), market.price_precision),
						volume: Decimal.format(
							Number((marketTickers[market.id] || defaultTicker).volume),
							market.amount_precision,
						),
					};
				})
				.map(market => ({
					...market,
					change: Decimal.format((+market.last - +market.open).toFixed(market.price_precision), market.price_precision),
				}))

				.map(market => {
					const marketChangeColor = +(market.change || 0) < 0 ? '#E01E5A' : '#2FB67E';
					const marketName = market.name.split('/');
					const marketID = market.name.toUpperCase();
					const baseCurrency = marketID.split('/')[0];

					return {
						...market,
						name: (
							<div className="d-flex flex-row align-items-center">
								<img width="30px" height="30px" src={findIcon(baseCurrency)} alt="marketName" />
								<span style={{ color: '#737f92', marginLeft: 8 }}>{marketName[0]}</span>
								<span style={{ color: '#737f92' }}>/</span>
								<span style={{ color: '#737f92' }}>{marketName[1]}</span>
							</div>
						),
						last: (
							<span style={{ color: marketChangeColor }} className="d-flex flex-row align-items-center">
								{market.last}
								<p className="m-0 ml-3" style={{ color: 'rgb(115 127 146)' }}>
									$ <ConvertUsd value={+market.last} symbol={marketName[1]} />
								</p>
							</span>
						),
						open: <span style={{ color: marketChangeColor }}>{market.open}</span>,
						change: <span style={{ color: marketChangeColor }}>{market.change}</span>,
						volume: <span style={{ color: marketChangeColor }}>{market.volume}</span>,
						price_change_percent: <span style={{ color: marketChangeColor }}>{market.price_change_percent}</span>,
						trade: (
							<button
								onClick={() => handleRedirectToTrading(market.id)}
								className="home-market__trading-btn"
							>
								Trade
							</button>
						),
					};
				})
		: [];

	const Markets = () => {
		return (
			<div className="cx-homepage-market-item">
				<NewHomeMarketTable  data={formattedMarkets} />
			</div>
		);
	};

	return (
		<div id="marketList">
			<div className="container">
				<div className="row">
					<div className="col-12">
						<div>{Markets()}</div>
					</div>
				</div>
			</div>
		</div>
	);
};
