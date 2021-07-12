import { MarketTradingSvg } from 'assets/images/trading/MarketTradingSvg';
import classnames from 'classnames';
import { OrderComponent, TradingChart } from 'containers';
import threeDotSvg from 'mobile/assets/icons/Trading/threeDot.svg';
import toChartSvg from 'mobile/assets/icons/Trading/toChart.svg';
import toListSvg from 'mobile/assets/icons/Trading/toList.svg';
import { selectCurrentMarket, selectUserLoggedIn } from 'modules';
import React from 'react';
import { ListGroup } from 'react-bootstrap';
import isEqual from 'react-fast-compare';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { NewCreateOrder } from '../NewCreateOrder';
import { NewOrders } from '../NewOrders';
import { OrderBook } from '../OrderBook';

const HistoryOrder: React.FC = () => {
	const userLoggedIn = useSelector(selectUserLoggedIn);

	return userLoggedIn ? <NewOrders /> : null;
};

const OptionList: React.FC = () => {
	const [isShow, setIsShow] = React.useState(false);
	const [favoriteKeyState, setFavoriteKeyState] = React.useState<string[]>([]);
	const currentMarket = useSelector(selectCurrentMarket, isEqual);

	React.useEffect(() => {
		//load favourites_markets
		const listFavoriteKey = JSON.parse(localStorage.getItem('favourites_markets') || '[]') as string[];
		if (listFavoriteKey.length) {
			setFavoriteKeyState(listFavoriteKey);
		}
	}, []);

	React.useEffect(() => {
		localStorage.setItem('favourites_markets', JSON.stringify(favoriteKeyState));
	}, [favoriteKeyState.length]);

	const handleSelectFavorite = () => {
		if (currentMarket) {
			if (favoriteKeyState.includes(currentMarket.id)) {
				setFavoriteKeyState(favoriteKeyState.filter(item => item !== currentMarket.id));
			} else {
				setFavoriteKeyState([...favoriteKeyState].concat([currentMarket.id]));
			}
		}
		setIsShow(false);
	};

	const className = classnames({
		'd-block': isShow,
	});

	return (
		<div className="d-inline-block td-mobile-cpn-current-market-info__header__option">
			<img
				src={threeDotSvg}
				alt=""
				onClick={() => setIsShow(prev => !prev)}
				onMouseOut={() => {
					setTimeout(() => {
						setIsShow(false);
					}, 0);
				}}
			/>
			<ListGroup className={className}>
				<ListGroup.Item onClick={handleSelectFavorite}>
					<MarketTradingSvg active={currentMarket && favoriteKeyState.includes(currentMarket.id)} />
					{currentMarket && favoriteKeyState.includes(currentMarket.id) ? 'Remove from favorites' : 'Add to favorites'}
				</ListGroup.Item>
			</ListGroup>
		</div>
	);
};

export const CurrentMarketInfoComponent: React.FC = () => {
	const [tabKey, setTabKey] = React.useState<'chart' | 'order'>('order');
	const currentMarket = useSelector(selectCurrentMarket, isEqual);

	const onChangeTab = () => {
		tabKey === 'order' ? setTabKey('chart') : setTabKey('order');
	};

	const renderContent = () => {
		if (tabKey === 'chart') {
			return true ? <NewCreateOrder /> : <TradingChart hideHeaderContent />;
		} else {
			return (
				<React.Fragment>
					<div className="pg-mobile-create-order">
						<div className="pg-mobile-create-order__row-double">
							<OrderBook />
							<OrderComponent defaultTabIndex={0} />
						</div>
					</div>
					<div className="td-mobile-cpn-current-market-info__history mt-3">
						<HistoryOrder />
					</div>
				</React.Fragment>
			);
		}
	};

	return (
		<div className="td-mobile-cpn-current-market-info">
			<div className="td-mobile-cpn-current-market-info__header d-flex">
				<div className="td-mobile-cpn-current-market-info__header__left d-flex flex-fill align-items-center">
					<Link to="/markets">
						<img className="mr-3" src={toListSvg} alt="" />
					</Link>
					<h6 className="td-mobile-cpn-current-market-info__header__name m-0">
						{currentMarket && currentMarket.name.toUpperCase()}
					</h6>
				</div>
				<div className="td-mobile-cpn-current-market-info__header__right d-flex justify-content-end flex-fill align-items-center">
					<img
						className="td-mobile-cpn-current-market-info__header__change-tab mr-1 pr-2 pl-2"
						src={toChartSvg}
						alt=""
						onClick={onChangeTab}
					/>
					<OptionList />
				</div>
			</div>
			<div className="td-mobile-cpn-current-market-info__content">{renderContent()}</div>
		</div>
	);
};

export const NewCurrentMarketInfo = React.memo(CurrentMarketInfoComponent);
