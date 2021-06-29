import { Empty } from 'antd';
import classNames from 'classnames';
import { NewPagination } from 'components';
import React, { useEffect, useState } from 'react';
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

const DEFAULT_LIST_TAB = ['Favorite','ALL','USDT', 'BTC', 'ETH', 'ALTS'];

interface SearchProp {
	valueSearch?: string;
	setValueSearch?: (value: string) => void;
}
// tslint:disable-next-line: no-empty
export const NewAllMarketList: React.FC<SearchProp> = ({ valueSearch = '', setValueSearch = () => {} }) => {
	const markets = useSelector(selectMarkets);
	const tickers = useSelector(selectMarketTickers);
	const [listTab, setListTab] = useState(DEFAULT_LIST_TAB);
	const [tab, setTab] = useState(DEFAULT_TAB);
	const [listMarket, setListMarket] = useState(markets);
	const [maxPage, setMaxPage] = useState(DEFAULT_MAXPAGE);
	const [pageIndex, setPageIndex] = useState(DEFAULT_PAGEINDEX);
	const [sortBy, setSortBy] = useState(DEFAULT_SORT);
	const [isSort, setIsSort] = useState(DEFAULT_SORT);
	const favoritemMarketsLocal = JSON.parse(localStorage.getItem('favourites_markets') || '[]');

	useEffect(() => {
		if (markets.length > 0) {
			setListTab(DEFAULT_LIST_TAB);
			let listMarketTamp = markets.slice(0, MAX_ELEMENT);
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
			listMarketTamp = listMarketTamp.slice(0, MAX_ELEMENT);
			setListMarket(listMarketTamp);
			setIsSort(DEFAULT_SORT);
		}
	}, [tab]);

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
		const classname = (nameTab: String) =>
			classNames('td-mobile-new-market__body__selection__box__item', {
				'td-mobile-new-market__body__selection__box__item--active': nameTab === tab,
			});

		return listTab.map((name, i) => {
			return (
				<div key={i} className={classname(name)} onClick={() => onChangeTab(name)}>
					{name}
				</div>
			);
		});
	};

	const renderHeaderTable = () => {
		const listHeader = ['Trading Pairs', 'Latest  Price', '24h Change'];
		const renderUiHeader = listHeader.map((name, i) => {
			let classActiveUpDown = 'd-flex flex-column justify-content-center td-mobile-new-market__body__info__item__icon';

			switch (name) {
				case 'Trading Pairs':
					if (isSort.pairs) {
						classActiveUpDown = classNames(
							'd-flex flex-column justify-content-center td-mobile-new-market__body__info__item__icon',
							{ 'td-mobile-new-market__body__info__item__icon--active-up': sortBy.pairs },
							{ 'td-mobile-new-market__body__info__item__icon--active-down': !sortBy.pairs },
						);
					}
					break;
				case 'Latest  Price':
					if (isSort.price) {
						classActiveUpDown = classNames(
							'd-flex flex-column justify-content-center td-mobile-new-market__body__info__item__icon',
							{ 'td-mobile-new-market__body__info__item__icon--active-up': !sortBy.price },
							{ 'td-mobile-new-market__body__info__item__icon--active-down': sortBy.price },
						);
					}
					break;
				case '24h Change':
					if (isSort.change) {
						classActiveUpDown = classNames(
							'd-flex flex-column justify-content-center td-mobile-new-market__body__info__item__icon',
							{ 'td-mobile-new-market__body__info__item__icon--active-up': !sortBy.change },
							{ 'td-mobile-new-market__body__info__item__icon--active-down': sortBy.change },
						);
					}
					break;
				default:
					break;
			}

			return (
				<th key={i}>
					<div className={classNames('td-mobile-new-market__body__info d-flex', { 'justify-content-end': i !== 0 })}>
						<div className="d-flex" onClick={() => onSort(name)}>
							<div className="td-mobile-new-market__body__info__item ">{name}</div>
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
		const child = () => {
			return (
				<tr>
					<td className="td-mobile-new-market__body__markets__desc">Main</td>
					<td></td>
					<td></td>
				</tr>
			);
		};

		return (
			<MarketList listMarket={listMarket} isShowTHead={true} childOfTBody={child()} childOfTHead={renderHeaderTable()} />
		);
	};

	const renderPagination = () => {
		const goToPgae = index => {
			if (index <= maxPage && index >= 1) {
				const indexElemStart = (index - 1) * MAX_ELEMENT;
				const indexElemStop = (index - 1) * MAX_ELEMENT + MAX_ELEMENT;
				const listMarketTamp = markets.slice(indexElemStart, indexElemStop);
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
		<div className="td-mobile-new-market__body ">
			<div className="td-mobile-new-market__body__selection ">
				<div className="td-mobile-new-market__body__selection__box">{renderTab()}</div>
			</div>

			{renderTable()}

			{renderPagination()}
		</div>
	);
};
