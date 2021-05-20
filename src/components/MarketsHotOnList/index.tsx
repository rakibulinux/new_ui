import * as React from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import {
	currenciesFetch,
	selectCurrencies,
	selectMarkets,
	selectMarketTickers,
	Market,
	selectCurrentMarket,
	Ticker,
	setCurrentMarket,
} from '../../modules';

const ChartWrap = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
`;
const MarketChartItem = styled.div`
	min-height: 100px;
	padding: 10px 0;
	border-radius: 4px;
	background-color: var(--tab-panel-background-color);
	:hover {
		cursor: pointer;
		box-shadow: #7d82b8 0px 0px 10px 0px;
	}
`;

export const MarketsHotOnlist: React.FC<any> = () => {
	const defaultTicker = {
		amount: '0.0',
		last: '0.0',
		high: '0.0',
		open: '0.0',
		low: '0.0',
		price_change_percent: '+0.00%',
		volume: '0.0',
	};

	const dispatch = useDispatch();
	const [marketNames, setMarketNames] = React.useState<string[]>([]);
	const [kLinesState, setKlinesState] = React.useState<{ pv: string }[]>([]);

	const markets = useSelector(selectMarkets);
	const marketTickers = useSelector(selectMarketTickers);
	const currencies = useSelector(selectCurrencies);
	const currentMarket = useSelector(selectCurrentMarket);

	React.useEffect(() => {
		dispatch(currenciesFetch());
	}, []);

	React.useEffect(() => {
		if (markets.length) {
			const marketListToState = markets.map(market => {
				let price_change_percent = (marketTickers[market.id] || defaultTicker).price_change_percent;
				let result = 0;
				if (price_change_percent[0] === '+') {
					result = +price_change_percent.split('+').join('').split('%').join('');
				} else {
					result = -price_change_percent.split('-').join('').split('%').join('');
				}
				return {
					id: market.id,
					name: market.name.toLowerCase(),
					price_change_percent: result,
				};
			});
			const isEmpty = marketListToState.reduce((prev, current) => {
				if (current.price_change_percent !== 0) {
					prev = false;
				}
				return prev;
			}, true);
			if (marketTickers && !marketNames.length && !isEmpty) {
				marketListToState.sort((a, b) => {
					return b.price_change_percent - a.price_change_percent;
				});

				const marketNames = marketListToState.slice(0, 4).map(market => {
					return market.name;
				});
				setMarketNames(marketNames);
			}
		}
	}, [marketTickers, markets]);

	const BASE_MARKET_URL = 'https://www.cx.finance/api/v2/peatio/public/markets';
	const fetchMarketsKlines = async (marketId: string, from: number, to: number) => {
		try {
			const klines = await axios.get(
				`${BASE_MARKET_URL}/${marketId.split('/').join('')}/k-line?period=30&time_from=${from}&time_to=${to}`,
			);

			return klines.data.map((kline, index) => {
				return { pv: kline[3] };
			});
		} catch (error) {
			return [];
		}
	};
	React.useEffect(() => {
		if (marketNames) {
			const from = Math.floor(Date.now() / 1000) - 60 * 1 * 60 * 1000;
			const to = Math.floor(Date.now() / 1000);
			const drawMarketLines = async () => {
				try {
					for (let i = 0; i < marketNames.length; i++) {
						const klines = await fetchMarketsKlines(marketNames[i], from, to);
						setKlinesState(prev => [...prev, klines]);
					}
				} catch (error) {
					// console.log(JSON.stringify(error));
				}
				return;
			};
			drawMarketLines();
		}
	}, [marketNames]);

	const findIcon = (code: string): string => {
		const currency = currencies.find((currency: any) => String(currency.id).toLowerCase() === code.toLowerCase());
		try {
			return require(`../../../node_modules/cryptocurrency-icons/128/color/${code.toLowerCase()}.png`);
		} catch (err) {
			if (currency) return currency.icon_url;
			return require('../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
		}
	};

	const history = useHistory();
	const handleRedirectToTrading = (id: string) => {
		const currentMarket: Market | undefined = markets.find(item => item.id === id);

		if (currentMarket) {
			dispatch(setCurrentMarket(currentMarket));
			history.push(`/trading/${currentMarket.id}`);
		}
	};

	const MarketChart = (data: any, marketID: string) => {
		const market = markets.find(market => market.base_unit.toLowerCase() === marketID.split('/')[0].toLowerCase());
		const getTickerValue = (cMarket: Market, tickers: { [key: string]: Ticker }) => {
			const defaultTicker = { amount: 0, low: 0, last: 0, high: 0, volume: 0, open: 0, price_change_percent: '+0.00%' };

			return tickers[cMarket.id] || defaultTicker;
		};

		const currentTicker = (currentMarket && getTickerValue(currentMarket, marketTickers)) || { volume: 0 };

		if (market) {
			const marketID = market.name.toUpperCase();
			const baseCurrency = marketID.split('/')[0];
			const quoteCurrency = marketID.split('/')[1];
			const last = Number((marketTickers[market.id] || defaultTicker).last);
			const open = Number((marketTickers[market.id] || defaultTicker).open);
			const price_change_percent = (marketTickers[market.id] || defaultTicker).price_change_percent;
			const volume = Number((currentTicker[market.id] || defaultTicker).volume);
			const change = +last - +open;
			const marketChangeColor = +(change || 0) < 0 ? 'var(--system-red)' : 'var(--system-green)';
			return (
				<MarketChartItem>
					<div className="container" onClick={() => handleRedirectToTrading(market.id)}>
						<div className="row">
							<div className="col-12 d-flex justify-content-between">
								<div>
									<img width="30px" height="30px" src={findIcon(baseCurrency)} alt={baseCurrency} />
									<span style={{ fontSize: '1.2rem', margin: '5px' }} className="text-white">
										{marketID.toUpperCase()}
									</span>
								</div>
							</div>
						</div>
						<div className="row mt-1">
							<div className="col-6 d-flex justify-content-start align-items-center">
								<span style={{ marginLeft: '5px', fontSize: '1.4rem', color: '#fff' }}>{last.toFixed(6)}</span>
							</div>

							<div className="col-6 d-flex justify-content-end align-items-center">
								<ResponsiveContainer ani width="100%" aspect={2.5 / 1.0}>
									<AreaChart
										width={200}
										height={60}
										data={data}
										margin={{
											top: 5,
											right: 0,
											left: 0,
											bottom: 5,
										}}
									>
										<Area
											isAnimationActive={false}
											type="monotone"
											dataKey="pv"
											stroke="#fff"
											fill="#7d82b8"
										/>
									</AreaChart>
								</ResponsiveContainer>
							</div>
						</div>
						<div className="row">
							<div className="col-12 d-flex justify-content: center">
								<span style={{ marginRight: '5px', color: marketChangeColor, fontWeight: 'bold' }}>
									{price_change_percent}
								</span>
								<div className="ml-2">
									<span style={{ color: '#ced4da' }}>Volume:</span>
									<span className="ml-2" style={{ marginRight: '5px', color: '#ced4da', fontWeight: 'bold' }}>
										{volume}
									</span>
									<span style={{ color: '#ced4da' }}>{quoteCurrency.toUpperCase()}</span>
								</div>
							</div>
						</div>
					</div>
				</MarketChartItem>
			);
		}
		return '';
	};

	const renderChart = () => {
		return (
			<ChartWrap>
				<div className="container" style={{ backgroundColor: 'transparent', padding: '25px 0px', borderRadius: '1rem' }}>
					<div className="row">
						{kLinesState.map((kline, i) => (
							<div className="col-lg-3 col-md-6 mb-2" key={i}>
								{MarketChart(kline, marketNames[i])}
							</div>
						))}
					</div>
				</div>
			</ChartWrap>
		);
	};
	return <React.Fragment>{renderChart()}</React.Fragment>;
};
