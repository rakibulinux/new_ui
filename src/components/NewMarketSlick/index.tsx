import * as React from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Decimal } from '../../components';
import Slider from 'react-slick';
import { currenciesFetch, selectMarkets, selectMarketTickers, Market, setCurrentMarket } from '../../modules';
import Down from './icon/down.svg';
import Up from './icon/up.svg';


const ChartWrap = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	background-color: rgb(37, 42, 59);

	.market-slick {
		width: 100%;
		div{
			.slick-slider {
				.slick-list {
					.slick-track {
						width: auto;
						margin: 0;
						.slick-slide {
							max-width: 290px;
							width: 100%;
							padding: 0;
							height: 60px;
							border-left: 1px solid rgb(66, 66, 66);
						}
					}
				} 
			}
		}
	}
`;
const MarketChartItem = styled.div`
	min-height: 60px;
	border-radius: 4px;
	background-color: rgb(38, 40, 58);
	:hover {
		cursor: pointer;
	}
`;

const BASE_MARKET_URL = 'https://www.cx.finance/api/v2/peatio/public/markets';

export const NewMarketSlick: React.FC<any> = () => {
	const defaultTicker = {
		amount: '0.0',
		last: '0.0',
		high: '0.0',
		open: '0.0',
		low: '0.0',
		price_change_percent: '+0.00%',
		volume: '0.0',
	};

	const settings = {
		dots: false,
		infinite: false,
		speed: 500,
		slidesToShow: 6,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 3000,
		pauseOnHover: true
	};

	const dispatch = useDispatch();
	const [marketNames, setMarketNames] = React.useState<string[]>([]);
	const [kLinesState, setKlinesState] = React.useState<{ pv: string }[]>([]);

	const markets = useSelector(selectMarkets);
	const marketTickers = useSelector(selectMarketTickers);

	React.useEffect(() => {
		dispatch(currenciesFetch());
	}, [dispatch]);

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

				const marketNames = marketListToState.slice(0, 10).map(market => {
					return market.name;
				});
				setMarketNames(marketNames);
			}
		}
	}, [marketTickers, markets, dispatch, defaultTicker, marketNames.length]);

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
				} catch (error) { }
				return;
			};
			drawMarketLines();
		}
	}, [marketNames]);

	const history = useHistory();
	const handleRedirectToTrading = (id: string) => {
		const currentMarket: Market | undefined = markets.find(item => item.id === id);

		if (currentMarket) {
			dispatch(setCurrentMarket(currentMarket));
			history.push(`/market/${currentMarket.id}`);
		}
	};

	const MarketChart = (data: any, marketID: string) => {
		const market = markets.find(
			market =>
				market.quote_unit.toLowerCase() === marketID.split('/')[1].toLowerCase() &&
				market.base_unit.toLowerCase() === marketID.split('/')[0].toLowerCase(),
		);

		if (market) {
			const marketID = market.name.toUpperCase();
			const last = Decimal.format(Number((marketTickers[market.id] || defaultTicker).last), market.price_precision);
			const open = Number((marketTickers[market.id] || defaultTicker).open);
			const price_change_percent = (marketTickers[market.id] || defaultTicker).price_change_percent;
			const change = +last - +open;
			const marketChangeColor = +(change || 0) < 0 ? 'var(--system-red)' : 'var(--system-green)';
			const price_change_percent_change = +(change || 0) < 0 ? Down : Up;
			return (
				<MarketChartItem>
					<div className="container" onClick={() => handleRedirectToTrading(market.id)}>
						<div className="row">
							<div className="col-12 d-flex justify-content-between">
								<div className="d-flex justify-content-between">
									<span style={{ fontSize: '14px', margin: '5px', color: "#8D8D8D" }}>
										{marketID.toUpperCase()}
									</span>
								</div>
								<div className="col-6 d-flex justify-content-end align-items-center">
									<span style={{ marginRight: '5px', color: marketChangeColor, fontWeight: 'bold' }}>
										{price_change_percent}
									</span>
								</div>

							</div>
						</div>
						<div className="row d-flex justify-content-between">
							<div className="d-flex justify-content-start align-items-center">
								<span style={{ marginLeft: '20px', fontSize: '16px', color: '#fff' }}>{last}</span>
							</div>
							<div style={{ marginRight: '40px'}}>
								<img src={price_change_percent_change} alt="price_change_percent_change" />
							</div>
						</div>
					</div>
				</MarketChartItem>
			);
		}
		return '';
	};

	return (
		<ChartWrap>
			<div className="market-slick" style={{ borderRadius: '1rem' }}>
				<div>
					<Slider {...settings}>
						{kLinesState.map((kline, i) => (
							<div key={i}>{MarketChart(kline, marketNames[i])}</div>
						))}
					</Slider>
				</div>
			</div>
		</ChartWrap>
	);
};
