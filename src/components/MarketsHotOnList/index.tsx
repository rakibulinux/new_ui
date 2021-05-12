import axios from 'axios';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';
import {
	currenciesFetch,
	Market,
	selectCurrencies,
	selectCurrentMarket,
	selectMarkets,
	selectMarketTickers,
	Ticker,
} from '../../modules';

export const MarketsHotOnlist: React.FC<any> = () => {
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
		transition: all 0.3s;
		:hover {
			cursor: pointer;
			box-shadow: #7d82b8 0px 0px 10px 0px;
		}
	`;
	const defaultTicker = {
		amount: '0.0',
		last: '0.0',
		high: '0.0',
		open: '0.0',
		low: '0.0',
		price_change_percent: '+0.00%',
		volume: '0.0',
	};

	const marketIds = ['btc/usdt', 'eth/usdt', 'esc/usdt', 'kobe/usdt'];

	const dispatch = useDispatch();
	const dispatchFetchCurrencies = () => dispatch(currenciesFetch());

	React.useEffect(() => {
		dispatchFetchCurrencies();
	}, []);

	const markets = useSelector(selectMarkets);
	const marketTickers = useSelector(selectMarketTickers);
	const currencies = useSelector(selectCurrencies);
	const currentMarket = useSelector(selectCurrentMarket);

	//state
	const [KlineState1, setKline1State] = React.useState<{ pv: string }>();
	const [KlineState2, setKline2State] = React.useState<{ pv: string }>();
	const [KlineState3, setKline3State] = React.useState<{ pv: string }>();
	const [KlineState4, setKline4State] = React.useState<{ pv: string }>();

	const BASE_MARKET_URL = 'https://www.cx.finance/api/v2/peatio/public/markets';
	const fetchMarketsKlines = async (marketId: string, from: number, to: number) => {
		try {
			const klines = await axios.get(
				`${BASE_MARKET_URL}/${marketId.split('/').join('')}/k-line?period=30&time_from=${from}&time_to=${to}`,
			);

			return klines.data.map((kline, index) => ({ pv: kline[3] }));
		} catch (error) {
			return [];
		}
	};
	React.useEffect(() => {
		const from = Math.floor(Date.now() / 1000) - 60 * 1 * 60 * 1000;
		const to = Math.floor(Date.now() / 1000);
		const drawMarketLines = async () => {
			try {
				const klines1 = await fetchMarketsKlines(marketIds[0], from, to);
				const klines2 = await fetchMarketsKlines(marketIds[1], from, to);
				const klines3 = await fetchMarketsKlines(marketIds[2], from, to);
				const klines4 = await fetchMarketsKlines(marketIds[3], from, to);

				setKline1State(klines1);
				setKline2State(klines2);
				setKline3State(klines3);
				setKline4State(klines4);
			} catch (error) {
				//console.log(JSON.stringify(error));
			}

			return;
		};
		// tslint:disable-next-line: no-floating-promises
		drawMarketLines();
	}, []);

	const findIcon = (code: string): string => {
		const currency = currencies.find(currencyParam => currencyParam.id.toLowerCase() === code.toLowerCase());
		try {
			return require(`../../../node_modules/cryptocurrency-icons/128/color/${code.toLowerCase()}.png`);
		} catch (err) {
			if (currency) {
				return currency.icon_url;
			}

			return require('../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
		}
	};

	const history = useHistory();

	const MarketChart = (data: any, marketIdParam: string) => {
		const market = markets.find(
			marketParam => marketParam.base_unit.toLowerCase() === marketIdParam.split('/')[0].toLowerCase(),
		);
		const getTickerValue = React.useCallback((cMarket: Market, tickers: { [key: string]: Ticker }) => {
			return tickers[cMarket.id] || defaultTicker;
		}, []);

		const currentTicker = (currentMarket && getTickerValue(currentMarket, marketTickers)) || { volume: 0 };
		// console.log(currentTicker);

		if (market) {
			const marketID = market.name.toUpperCase();
			const baseCurrency = marketID.split('/')[0];
			const quoteCurrency = marketID.split('/')[1];
			const last = Number((marketTickers[market.id] || defaultTicker).last);
			const open = Number((marketTickers[market.id] || defaultTicker).open);
			const price_change_percent = (marketTickers[market.id] || defaultTicker).price_change_percent;
			const volume = Number((currentTicker[market.id] || defaultTicker).volume);
			const change = +last - +open;
			// color
			const marketChangeColor = +(change || 0) < 0 ? 'var(--system-red)' : 'var(--system-green)';

			return (
				<MarketChartItem>
					<div
						className="container"
						onClick={() => history.push(`/trading/${baseCurrency.toLowerCase() + quoteCurrency.toLowerCase()}`)}
					>
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
								<ResponsiveContainer ani width="100%" aspect={2.5 / 1}>
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
						<div className="col-lg-3 col-md-6 mb-2">{MarketChart(KlineState1, marketIds[0])}</div>
						<div className="col-lg-3 col-md-6">{MarketChart(KlineState2, marketIds[1])}</div>
						<div className="col-lg-3 col-md-6">{MarketChart(KlineState3, marketIds[2])}</div>
						<div className="col-lg-3 col-md-6">{MarketChart(KlineState4, marketIds[3])}</div>
					</div>
				</div>
			</ChartWrap>
		);
	};

	return <React.Fragment>{renderChart()}</React.Fragment>;
};
