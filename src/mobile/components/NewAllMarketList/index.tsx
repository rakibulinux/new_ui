import { EllipsisOutlined } from '@ant-design/icons';
import { Dropdown, Empty, Menu } from 'antd';
import classNames from 'classnames';
import { NewPagination, NewTabPanel } from 'components';
import { TabPane } from 'rc-tabs';
import React, { useEffect, useRef, useState } from 'react';
import { FaSortDown, FaSortUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Market, selectMarkets, selectMarketTickers, Ticker } from '../../../modules/public/markets';
import { MarketList } from '../../components/';

const MAX_ELEMENT = 10;
const DEFAULT_TICKER: Ticker = {
	amount: '0.0',
	last: '0.0',
	high: '0.0',
	open: '0.0',
	low: '0.0',
	price_change_percent: '+0.00%',
	volume: '0.0',
	avg_price: '0',
};

const DEFAULT_SORT = { pairs: false, price: false, change: false };

const DEFAULT_MAXPAGE = 1;

const DEFAULT_PAGEINDEX = 1;

const DEFAULT_TAB = 'ALL';

interface SearchProp {
	valueSearch?: string;
	setValueSearch?: (value: string) => void;
	pagination?: boolean;
	hideFavorite?: boolean;
}
// tslint:disable-next-line: no-empty
export const NewAllMarketList: React.FC<SearchProp> = ({
	valueSearch = '',
	// tslint:disable-next-line: no-empty
	setValueSearch = () => {},
	pagination = true,
	hideFavorite,
}) => {
	const tabsRef = useRef<HTMLDivElement>(null);
	const markets = useSelector(selectMarkets);
	const tickers = useSelector(selectMarketTickers);
	const [showDropdown, setShowDropdown] = useState(false);
	const DEFAULT_LIST_TAB = ['ALL', 'USDT', 'BTC', 'ETH', 'ALTS'].concat(!hideFavorite ? ['Favorite'] : []);
	const [listTab, setListTab] = useState(DEFAULT_LIST_TAB);
	const [tab, setTab] = useState(DEFAULT_TAB);
	const [listMarket, setListMarket] = useState(markets);
	const [maxPage, setMaxPage] = useState(DEFAULT_MAXPAGE);
	const [pageIndex, setPageIndex] = useState(DEFAULT_PAGEINDEX);
	const [sortBy, setSortBy] = useState(DEFAULT_SORT);
	const [isSort, setIsSort] = useState(DEFAULT_SORT);
	const [favoritemMarketsLocal, setFavoritemMarketsLocal] = useState(
		JSON.parse(localStorage.getItem('favourites_markets') || '[]'),
	);

	useEffect(() => {
		window.addEventListener('storage', () => {
			const tempFavoritemMarketsLocal = JSON.parse(localStorage.getItem('favourites_markets') || '[]');
			if (tempFavoritemMarketsLocal.length !== favoritemMarketsLocal.length) {
				setFavoritemMarketsLocal(tempFavoritemMarketsLocal);
			}
		});
	}, []);

	useEffect(() => {
		if (tabsRef.current || !showDropdown) {
			const elmDom = document.querySelector('.td-mobile-cpn-all-market__body .td-tabs-nav-wrap');
			if (elmDom && elmDom.scrollWidth && elmDom.clientWidth !== 0 && elmDom.scrollWidth > elmDom.clientWidth) {
				setShowDropdown(true);
			}
		}
	});

	useEffect(() => {
		if (markets.length > 0) {
			setListTab(DEFAULT_LIST_TAB);
			let listMarketTamp = pagination ? markets.slice(0, MAX_ELEMENT) : markets;
			listMarketTamp = sortForAZ(listMarketTamp, false);
			listMarketTamp = listMarketTamp.filter(e => true);
			setListMarket(listMarketTamp);
			setMaxPage(Math.ceil(markets.length / MAX_ELEMENT));
		}
	}, [markets]);

	useEffect(() => {
		if (tab !== '') {
			if (valueSearch !== '') {
				setValueSearch('');
			}

			let listMarketTamp = markets.filter(e => {
				switch (tab) {
					case 'ALTS':
						return (
							e.quote_unit !== DEFAULT_LIST_TAB[1].toLowerCase() &&
							e.quote_unit !== DEFAULT_LIST_TAB[2].toLowerCase() &&
							e.quote_unit !== DEFAULT_LIST_TAB[3].toLowerCase()
						);
					case 'Favorite':
						return favoritemMarketsLocal.includes(e.id);
					case 'ALL':
						return true;
					default:
						return e.quote_unit === tab.toLowerCase();
				}
			});
			listMarketTamp = sortForAZ(listMarketTamp, false);
			setPageIndex(DEFAULT_PAGEINDEX);
			setMaxPage(Math.ceil(listMarketTamp.length / MAX_ELEMENT));
			listMarketTamp = pagination ? listMarketTamp.slice(0, MAX_ELEMENT) : listMarketTamp;
			setListMarket(listMarketTamp);
			setIsSort(DEFAULT_SORT);
		}
	}, [tab, favoritemMarketsLocal]);

	useEffect(() => {
		if (valueSearch !== '') {
			setTab('');
			let listMarketTamp;
			// tslint:disable-next-line: prefer-conditional-expression
			if (valueSearch.search('/') > 0) {
				listMarketTamp = markets.filter(e => e.name === valueSearch.toUpperCase());
			} else {
				listMarketTamp = markets.filter(e => e.name.split('/')[0] === valueSearch.toUpperCase());
			}
			setIsSort(DEFAULT_SORT);
			setListMarket(listMarketTamp);
		} else {
			setTab(DEFAULT_TAB);
		}
	}, [valueSearch]);

	const onChangeFavorite = () => {
		if (tab === 'Favorite') {
			const favoritemMarketsLocalTmp = JSON.parse(localStorage.getItem('favourites_markets') || '[]');

			let listMarketTamp = markets.filter(e => {
				return favoritemMarketsLocalTmp.includes(e.id);
			});
			listMarketTamp = sortForAZ(listMarketTamp, false);
			setPageIndex(DEFAULT_PAGEINDEX);
			setMaxPage(Math.ceil(listMarketTamp.length / MAX_ELEMENT));
			listMarketTamp = pagination ? listMarketTamp.slice(0, MAX_ELEMENT) : listMarketTamp;
			setListMarket(listMarketTamp);
			setIsSort(DEFAULT_SORT);
		}
	};

	const onChangeTab = (nameTab: string) => {
		if (tab !== nameTab) {
			setTab(nameTab);
		}
	};

	const sortForAZ = (listMarketTamp: Market[], upOrDown: boolean) => {
		return listMarketTamp.sort((a, b) => {
			const textA = a.name.charAt(0);
			const textB = b.name.charAt(0);
			if (upOrDown) {
				return textA > textB ? -1 : textA < textB ? 1 : 0;
			} else {
				return textA < textB ? -1 : textA > textB ? 1 : 0;
			}
		});
	};

	const onSort = (typeSort: string) => {
		let listMarketTamp = listMarket;
		switch (typeSort) {
			case 'Trading Pairs':
				if (!isSort.pairs) {
					setIsSort({ pairs: true, price: false, change: false });
				}
				// tslint:disable-next-line: prefer-conditional-expression
				if (sortBy.pairs) {
					listMarketTamp = sortForAZ(listMarketTamp, sortBy.pairs);
				} else {
					listMarketTamp = sortForAZ(listMarketTamp, sortBy.pairs);
				}

				setSortBy({ ...DEFAULT_SORT, pairs: !sortBy.pairs });

				break;
			case 'Latest  Price':
				if (!isSort.price) {
					setIsSort({ pairs: false, price: true, change: false });
				}
				if (sortBy.price) {
					listMarketTamp.sort((a, b) => {
						const priceA = tickers[a.id] || DEFAULT_TICKER;
						const PriceB = tickers[b.id] || DEFAULT_TICKER;

						return Number(priceA.last) - Number(PriceB.last);
					});
				} else {
					listMarketTamp.sort((a, b) => {
						const priceA = tickers[a.id] || DEFAULT_TICKER;
						const PriceB = tickers[b.id] || DEFAULT_TICKER;

						return Number(PriceB.last) - Number(priceA.last);
					});
				}

				setSortBy({ ...DEFAULT_SORT, price: !sortBy.price });

				break;
			case '24h Change':
				if (!isSort.change) {
					setIsSort({ pairs: false, price: false, change: true });
				}
				if (sortBy.change) {
					listMarketTamp.sort((a, b) => {
						const priceA = tickers[a.id] || DEFAULT_TICKER;
						const priceB = tickers[b.id] || DEFAULT_TICKER;

						return (
							Number(priceA.price_change_percent.replace(/[+%]/g, '')) -
							Number(priceB.price_change_percent.replace(/[+%]/g, ''))
						);
					});
				} else {
					listMarketTamp.sort((a, b) => {
						const priceA = tickers[a.id] || DEFAULT_TICKER;
						const priceB = tickers[b.id] || DEFAULT_TICKER;

						return (
							Number(priceB.price_change_percent.replace(/[+%]/g, '')) -
							Number(priceA.price_change_percent.replace(/[+%]/g, ''))
						);
					});
				}
				setSortBy({ ...DEFAULT_SORT, change: !sortBy.change });
				break;

			default:
				break;
		}

		setListMarket(listMarketTamp);
	};

	const renderTab = () => {
		return (
			<NewTabPanel
				activeKey={tab}
				onChange={onChangeTab}
				tabBarExtraContent={
					showDropdown ? (
						<Dropdown
							placement="bottomRight"
							className="td-mobile-cpn-all-market__body__wrapper__more_btn"
							overlay={renderMenuDropdown()}
							trigger={['click']}
						>
							<EllipsisOutlined />
						</Dropdown>
					) : undefined
				}
			>
				{listTab.map(name => (
					<TabPane key={name} tab={name}>
						{renderTable()}
					</TabPane>
				))}
			</NewTabPanel>
		);
	};

	const renderMenuDropdown = () => {
		return (
			<Menu style={{ background: '#313445' }}>
				{listTab.map(name => (
					<Menu.Item key={name} onClick={() => onChangeTab(name)}>
						{name}
					</Menu.Item>
				))}
			</Menu>
		);
	};

	const renderHeaderTable = () => {
		const listHeader = ['Trading Pairs', 'Latest  Price', '24h Change'];
		const renderUiHeader = listHeader.map((name, i) => {
			let classActiveUpDown = 'd-flex flex-column justify-content-center td-mobile-cpn-all-market__body__info__item__icon';

			switch (name) {
				case 'Trading Pairs':
					if (isSort.pairs) {
						classActiveUpDown = classNames(
							'd-flex flex-column justify-content-center td-mobile-cpn-all-market__body__info__item__icon',
							{ 'td-mobile-cpn-all-market__body__info__item__icon--active-up': sortBy.pairs },
							{ 'td-mobile-cpn-all-market__body__info__item__icon--active-down': !sortBy.pairs },
						);
					}
					break;
				case 'Latest  Price':
					if (isSort.price) {
						classActiveUpDown = classNames(
							'd-flex flex-column justify-content-center td-mobile-cpn-all-market__body__info__item__icon',
							{ 'td-mobile-cpn-all-market__body__info__item__icon--active-up': !sortBy.price },
							{ 'td-mobile-cpn-all-market__body__info__item__icon--active-down': sortBy.price },
						);
					}
					break;
				case '24h Change':
					if (isSort.change) {
						classActiveUpDown = classNames(
							'd-flex flex-column justify-content-center td-mobile-cpn-all-market__body__info__item__icon',
							{ 'td-mobile-cpn-all-market__body__info__item__icon--active-up': !sortBy.change },
							{ 'td-mobile-cpn-all-market__body__info__item__icon--active-down': sortBy.change },
						);
					}
					break;
				default:
					break;
			}

			return (
				<th key={i}>
					<div
						className={classNames('td-mobile-cpn-all-market__body__info d-flex', { 'justify-content-end': i !== 0 })}
					>
						<div className="d-flex" onClick={() => onSort(name)}>
							<div className="td-mobile-cpn-all-market__body__info__item ">{name}</div>
							<div className={classActiveUpDown}>
								<FaSortUp />
								<FaSortDown />
							</div>
						</div>
					</div>
				</th>
			);
		});

		return <tr>{renderUiHeader}</tr>;
	};

	const renderTable = () => {
		return (
			<MarketList
				listMarket={listMarket}
				isShowTHead={true}
				childOfTHead={renderHeaderTable()}
				onchangeFavorite={onChangeFavorite}
			/>
		);
	};

	const renderPagination = () => {
		const goToPgae = index => {
			if (index <= maxPage && index >= 1) {
				const indexElemStart = (index - 1) * MAX_ELEMENT;
				const indexElemStop = (index - 1) * MAX_ELEMENT + MAX_ELEMENT;
				const listMarketTamp = pagination ? markets.slice(indexElemStart, indexElemStop) : markets;
				setListMarket(listMarketTamp);
				setPageIndex(index);
				setIsSort(DEFAULT_SORT);
			}
		};

		return listMarket.length === 0 ? (
			<Empty />
		) : (
			<NewPagination page={pageIndex === 0 ? 1 : pageIndex} total={maxPage} toPage={goToPgae} />
		);
	};

	return (
		<div className="td-mobile-cpn-all-market__body">
			<div className="td-mobile-cpn-all-market__body__wrapper" ref={tabsRef}>
				{renderTab()}
			</div>
			{pagination ? renderPagination() : undefined}
		</div>
	);
};
