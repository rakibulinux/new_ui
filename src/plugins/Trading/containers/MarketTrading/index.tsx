import classnames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import * as React from 'react';
import isEqual from 'react-fast-compare';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { incrementalOrderBook } from '../../../../api';
import { Decimal } from '../../../../components';
import { getUrlPart, setDocumentTitle } from '../../../../helpers';
import {
	depthFetch,
	Market,
	marketsFetch,
	selectCurrentMarket,
	selectMarkets,
	selectMarketTickers,
	selectUserLoggedIn,
	setCurrentMarket,
	setCurrentPrice,
} from '../../../../modules';
import { rangerConnectFetch } from '../../../../modules/public/ranger';
import { selectRanger } from '../../../../modules/public/ranger/selectors';
import searchSvg from '../../assets/search.svg';
import { MarketTradingSvg } from '../../components/Icon/MarketTradingSvg';
import { MarketsListTrading } from './MarketsListTrading';
import { MarketTradingStyle, SearchBlockStyle, StarBlockStyle } from './styles';

const STAR_LIST_KEYS = ['Favorite', 'All', 'BTC', 'ETH'];

const MarketTradingContainer: React.FC = () => {
	const history = useHistory();
	const dispatch = useDispatch();

	const markets = useSelector(selectMarkets, isEqual);
	const currentMarket = useSelector(selectCurrentMarket);
	const rangerState = useSelector(selectRanger);
	const userLoggedIn = useSelector(selectUserLoggedIn);
	const tickers = useSelector(selectMarketTickers);

	const [searchFieldState, setSearchFieldState] = React.useState<string>('');
	const [starSelectedState, setStarSelectedState] = React.useState<string>(STAR_LIST_KEYS[1]);
	const [favoriteKeyState, setFavoriteKeyState] = React.useState<string[]>([]);
	const [radioSelectedState, setRadioSelectedState] = React.useState<'change' | 'volume'>('change');

	React.useEffect(() => {
		//load favoriteMarketTrading
		const listFavoriteKey = JSON.parse(localStorage.getItem('favoriteMarketTrading') || '[]') as string[];
		if (listFavoriteKey.length) {
			setFavoriteKeyState(listFavoriteKey);
		}

		setDocumentTitle('Trading');
		const { connected, withAuth } = rangerState;

		if (markets.length < 1) {
			dispatch(marketsFetch());
		}

		if (currentMarket && !incrementalOrderBook()) {
			dispatch(depthFetch(currentMarket));
		}

		if (!connected) {
			dispatch(rangerConnectFetch({ withAuth: userLoggedIn }));
		}

		if (userLoggedIn && !withAuth) {
			dispatch(rangerConnectFetch({ withAuth: userLoggedIn }));
		}

		return () => {
			dispatch(setCurrentPrice(undefined));
		};
	}, []);

	React.useEffect(() => {
		localStorage.setItem('favoriteMarketTrading', JSON.stringify(favoriteKeyState));
	}, [favoriteKeyState.length]);

	React.useEffect(() => {
		if (userLoggedIn) {
			dispatch(rangerConnectFetch({ withAuth: userLoggedIn }));
		}
	}, [userLoggedIn]);

	React.useEffect(() => {
		setMarketFromUrlIfExists();
	}, [markets.length]);

	React.useEffect(() => {
		if (currentMarket) {
			const marketFromUrl = history.location.pathname.split('/');
			const marketNotMatched = currentMarket.id !== marketFromUrl[marketFromUrl.length - 1];
			if (marketNotMatched) {
				history.replace(`/trading/${currentMarket.id}`);

				if (!incrementalOrderBook()) {
					dispatch(depthFetch(currentMarket));
				}
			}
		}
	}, [currentMarket]);

	React.useEffect(() => {
		if (currentMarket && tickers) {
			setTradingTitle(currentMarket);
		}
	}, [currentMarket, tickers]);

	// tslint:disable-next-line: no-shadowed-variable
	const setMarketFromUrlIfExists = (): void => {
		const urlMarket: string = getUrlPart(2, window.location.pathname);
		const market: Market | undefined = markets.find(item => item.id === urlMarket);

		if (market) {
			dispatch(setCurrentMarket(market));
		}
	};

	const setTradingTitle = (market: Market) => {
		const tickerPrice = tickers[market.id] ? tickers[market.id].last : '0.0';
		document.title = `${Decimal.format(tickerPrice, market.price_precision)} ${market.name}`;
	};

	const searchFieldChangeHandler: React.InputHTMLAttributes<HTMLInputElement>['onChange'] = e => {
		setSearchFieldState(e.target.value);
	};

	const handleChangeRadio = (key: typeof radioSelectedState) => {
		if (key === radioSelectedState) {
			return;
		}
		setRadioSelectedState(key);
	};

	const renderSearch = () => {
		return (
			<SearchBlockStyle className="d-flex">
				<div className="search-wrapper w-50">
					<img className="search-icon" src={searchSvg} />
					<input
						className="search-input"
						type="text"
						placeholder="Search"
						value={searchFieldState}
						onChange={searchFieldChangeHandler}
					/>
				</div>
				<div className="select-wrapper flex-fill d-flex align-items-center justify-content-center">
					<div
						className="select-item d-flex align-items-center justify-content-center h-100"
						onClick={() => handleChangeRadio('change')}
					>
						<i className={classnames({ active: radioSelectedState === 'change' })} />
						<label className="d-flex align-items-center mb-0 mr-2">Change</label>
					</div>
					<div
						className="select-item d-flex align-items-center justify-content-center h-100"
						onClick={() => handleChangeRadio('volume')}
					>
						<i className={classnames({ active: radioSelectedState === 'volume' })} />
						<label className="d-flex align-items-center mb-0">Volume</label>
					</div>
				</div>
			</SearchBlockStyle>
		);
	};

	const getData = () => {
		let data: Market[] = cloneDeep(markets);
		if (starSelectedState === STAR_LIST_KEYS[0]) {
			data = data.filter(market => favoriteKeyState.includes(market.id));
		} else if (starSelectedState !== STAR_LIST_KEYS[1]) {
			data = data.filter(market => market.name.toLowerCase().split('/')[1].includes(starSelectedState.toLowerCase()));
		}
		data = data.filter(market => market.name.toLowerCase().includes(searchFieldState.toLowerCase()));

		return data;
	};

	const handleSelectedStar = (key: string) => {
		if (starSelectedState !== key) {
			setStarSelectedState(key);
		}
	};

	const handleSelectFavorite = (id: string) => {
		if (favoriteKeyState.includes(id)) {
			setFavoriteKeyState(favoriteKeyState.filter(item => item !== id));
		} else {
			setFavoriteKeyState([...favoriteKeyState].concat([id]));
		}
	};

	const renderStarList = () => {
		return (
			<StarBlockStyle>
				{STAR_LIST_KEYS.map((key, i) => (
					<button
						className={classnames({
							active: starSelectedState === key,
						})}
						onClick={() => handleSelectedStar(key)}
						key={i}
					>
						{i === 0 ? <MarketTradingSvg /> : key}
					</button>
				))}
			</StarBlockStyle>
		);
	};

	const dataTable = getData();

	return (
		<MarketTradingStyle>
			{renderStarList()}
			{renderSearch()}
			<MarketsListTrading
				listFavoriteKey={favoriteKeyState}
				onSelectFavorite={handleSelectFavorite}
				type={radioSelectedState}
				data={dataTable}
			/>
		</MarketTradingStyle>
	);
};

export const MarketTrading = MarketTradingContainer;
