import { Empty } from 'antd';
import classNames from 'classnames';
import { NewPagination } from 'components';
import React, { useEffect, useState } from 'react';
import { FaSortDown, FaSortUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { selectMarkets, selectMarketTickers, Ticker } from '../../../modules/public/markets';
import { HeaderSearch } from './HeaderSearch';
import { RowTable } from './RowTable';

const MAXELEMENT = 10;
const defaultTicker: Ticker = {
	amount: '0.0',
	last: '0.0',
	high: '0.0',
	open: '0.0',
	low: '0.0',
	price_change_percent: '+0.00%',
	volume: '0.0',
	avg_price: '0',
};

const DEFAULTSORT = { pairs: false, price: false, change: false };

const DEFAULTMAXPAGE = 1;

const DEFAULTPAGEINDEX = 1;

const DEFAULTTAB = 'all';

export const NewMarkets = () => {
	const markets = useSelector(selectMarkets);
	const tickers = useSelector(selectMarketTickers);
	const [listTab, setListTab] = useState(['']);
	const [tab, setTab] = useState(DEFAULTTAB);
	const [listMarket, setListMarket] = useState(markets);
	const [maxPage, setMaxPage] = useState(DEFAULTMAXPAGE);
	const [pageIndex, setPageIndex] = useState(DEFAULTPAGEINDEX);
	const [valueSearch, setValueSearch] = useState('');
	const [sortBy, setSortBy] = useState(DEFAULTSORT);
	const [isSort, setIsSort] = useState(DEFAULTSORT);

	useEffect(() => {
		const formatFilteredMarkets = (list: string[], market) => {
			if (!list.includes(market.quote_unit)) {
				list.push(market.quote_unit);
			}

			return list;
		};

		if (markets.length > 0) {
			const currentBidUnitsList = markets.reduce(formatFilteredMarkets, ['all']);
			setListTab(currentBidUnitsList);
			let listMarketTamp = markets.slice(0, MAXELEMENT);
			listMarketTamp = sortForAZ(listMarketTamp, true);
			setListMarket(listMarketTamp);
			setMaxPage(Math.ceil(markets.length / MAXELEMENT));
		}
	}, [markets]);

	useEffect(() => {
		if (tab !== '') {
			if (tab === 'all') {
				setValueSearch('');
			}

			let listMarketTamp = markets.filter(e => {
				if (tab === 'all') {
					return true;
				}

				return e.quote_unit === tab;
			});
			listMarketTamp = sortForAZ(listMarketTamp, true);
			setPageIndex(DEFAULTPAGEINDEX);
			setMaxPage(Math.ceil(listMarketTamp.length / MAXELEMENT));
			listMarketTamp = listMarketTamp.slice(0, MAXELEMENT);
			setListMarket(listMarketTamp);
			setIsSort(DEFAULTSORT);
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
			setIsSort(DEFAULTSORT);
			setListMarket(listMarketTamp);
		}
	}, [valueSearch]);

	const onChangeTab = (nameTab: string) => {
		if (tab !== nameTab) {
			setTab(nameTab);
		}
	};

	const sortForAZ = (listMarketTamp, upOrDown) => {
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

				setSortBy({ ...DEFAULTSORT, pairs: !sortBy.pairs });

				break;
			case 'Latest  Price':
				if (!isSort.price) {
					setIsSort({ pairs: false, price: true, change: false });
				}
				if (sortBy.price) {
					listMarketTamp.sort((a, b) => {
						const priceA = tickers[a.id] || defaultTicker;
						const PriceB = tickers[b.id] || defaultTicker;

						return Number(priceA.last) - Number(PriceB.last);
					});
				} else {
					listMarketTamp.sort((a, b) => {
						const priceA = tickers[a.id] || defaultTicker;
						const PriceB = tickers[b.id] || defaultTicker;

						return Number(PriceB.last) - Number(priceA.last);
					});
				}

				setSortBy({ ...DEFAULTSORT, price: !sortBy.price });

				break;
			case '24h Change':
				if (!isSort.change) {
					setIsSort({ pairs: false, price: false, change: true });
				}
				if (sortBy.change) {
					listMarketTamp.sort((a, b) => {
						const priceA = tickers[a.id] || defaultTicker;
						const priceB = tickers[b.id] || defaultTicker;

						return (
							Number(priceA.price_change_percent.replace(/[+%]/g, '')) -
							Number(priceB.price_change_percent.replace(/[+%]/g, ''))
						);
					});
				} else {
					listMarketTamp.sort((a, b) => {
						const priceA = tickers[a.id] || defaultTicker;
						const priceB = tickers[b.id] || defaultTicker;

						return (
							Number(priceB.price_change_percent.replace(/[+%]/g, '')) -
							Number(priceA.price_change_percent.replace(/[+%]/g, ''))
						);
					});
				}
				setSortBy({ ...DEFAULTSORT, change: !sortBy.change });
				break;

			default:
				break;
		}

		setListMarket(listMarketTamp);
	};

	const onSearch = value => {
		setValueSearch(value);
	};

	const backToAllList = () => {
		setTab(DEFAULTTAB);
	};

	const renderTab = () => {
		const classname = (nameTab: String) =>
			classNames('td-mobile-new-market__body__selection__box__item', {
				'td-mobile-new-market__body__selection__box__item--active': nameTab === tab,
			});

		return listTab.map((name, i) => {
			return (
				<div key={i} className={classname(name)} onClick={() => onChangeTab(name)}>
					{name.toUpperCase()}
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

		return (
			<thead>
				<tr>{renderUiHeader}</tr>
			</thead>
		);
	};

	const renderBodyTable = () => {
		const BodyTableMarkets = () => {
			const renderRowTable = () => {
				return listMarket.map((e, index) => <RowTable key={index} market={e} />);
			};

			return (
				<React.Fragment>
					<tbody className="td-mobile-new-market__body__markets">
						<tr>
							<td className="td-mobile-new-market__body__markets__desc">Main</td>
							<td></td>
							<td></td>
						</tr>
						{renderRowTable()}
					</tbody>
				</React.Fragment>
			);
		};

		return BodyTableMarkets();
	};

	const renderPagination = () => {
		const goToPgae = index => {
			if (index <= maxPage && index >= 1) {
				const indexElemStart = (index - 1) * MAXELEMENT;
				const indexElemStop = (index - 1) * MAXELEMENT + MAXELEMENT;
				const listMarketTamp = markets.slice(indexElemStart, indexElemStop);
				setListMarket(listMarketTamp);
				setPageIndex(index);
				setIsSort(DEFAULTSORT);
			}
		};

		return listMarket.length === 0 ? (
			<Empty />
		) : (
			<NewPagination page={pageIndex === 0 ? 1 : pageIndex} total={maxPage} toPage={goToPgae} />
		);
	};

	return (
		<div className="td-mobile-new-market">
			<HeaderSearch onSearch={onSearch} backToAll={backToAllList} />

			<div className="td-mobile-new-market__body ">
				<div className="td-mobile-new-market__body__selection ">
					<div className="td-mobile-new-market__body__selection__box">{renderTab()}</div>
				</div>

				<table>
					{renderHeaderTable()}
					{renderBodyTable()}
				</table>

				{renderPagination()}
			</div>
		</div>
	);
};
