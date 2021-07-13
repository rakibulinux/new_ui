import { MarketTradingSvg } from 'assets/images/trading/MarketTradingSvg';
import classnames from 'classnames';
import { NewTabPanel } from 'components';
import { TradingChart, TradingTradeHistory } from 'containers';
import threeDotSvg from 'mobile/assets/icons/Trading/threeDot.svg';
import toChartSvg from 'mobile/assets/icons/Trading/toChart.svg';
import toListSvg from 'mobile/assets/icons/Trading/toList.svg';
import { selectCurrentMarket } from 'modules';
import { TabPane, TabsProps } from 'rc-tabs';
import React from 'react';
import { ListGroup } from 'react-bootstrap';
import isEqual from 'react-fast-compare';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { NewCreateOrder } from '../NewCreateOrder';
import { NewOrderBook } from '../NewOrderBook';

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

const ChartTab: React.FC = () => {
	const intl = useIntl();
	const [tabIndex, setTabIndex] = React.useState(0);

	const TAB_LIST_INFO = [
		{
			content: tabIndex === 0 ? <NewOrderBook horizontal /> : null,
			label: intl.formatMessage({ id: 'page.mobile.charts.label.orderBook' }),
		},
		{
			content: tabIndex === 1 ? <TradingTradeHistory /> : null,
			label: intl.formatMessage({ id: 'page.mobile.charts.label.trades' }),
		},
	];

	const onChangeTabIndex: TabsProps['onChange'] = index => {
		setTabIndex(Number(index));
	};

	return (
		<React.Fragment>
			<div className="td-mobile-cpn-current-market-info__chart mb-3">
				<TradingChart hideHeaderContent />
			</div>

			<div className="td-mobile-cpn-current-market-info__history">
				<NewTabPanel onChange={onChangeTabIndex}>
					{TAB_LIST_INFO.map((tabInfo, i) => (
						<TabPane key={i.toString()} tab={tabInfo.label}>
							{tabInfo.content}
						</TabPane>
					))}
				</NewTabPanel>
			</div>
		</React.Fragment>
	);
};

export const CurrentMarketInfoComponent: React.FC = () => {
	const [modeKey, setModeKey] = React.useState<'chart' | 'order'>('order');
	const currentMarket = useSelector(selectCurrentMarket, isEqual);

	const onChangeMode = () => {
		modeKey === 'order' ? setModeKey('chart') : setModeKey('order');
	};

	const renderContent = () => {
		if (modeKey === 'chart') {
			return <ChartTab />;
		} else {
			return <NewCreateOrder />;
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
						onClick={onChangeMode}
					/>
					<OptionList />
				</div>
			</div>
			<div className="td-mobile-cpn-current-market-info__content">{renderContent()}</div>
		</div>
	);
};

export const NewCurrentMarketInfo = React.memo(CurrentMarketInfoComponent);
