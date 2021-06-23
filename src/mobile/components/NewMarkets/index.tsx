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
export const NewMarkets = () => {
	const markets = useSelector(selectMarkets);
	const tickers = useSelector(selectMarketTickers);
	const [listTab, setListTab] = useState(['']);
	const [tab, setTab] = useState('all');
	const [listMarket, setListMarket] = useState(markets);
	const [maxPage, setMaxPage] = useState(1);
	const [pageIndex, setPageIndex] = useState(1);
	const [valueSearch, setValueSearch] = useState('');
	const [sortPairs, setSortPairs] = useState(false);
	const [sortPrice, setSortPrice] = useState(false);
	const [sortChange, setSortChanges] = useState(false);
	const [isSortPairs, setIsSortPairs] = useState(false);
	const [isSortPrice, setIsSortPrice] = useState(false);
	const [isSortChange, setIsSortChange] = useState(false);

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
			const listMarketTamp = markets.slice(0, MAXELEMENT);

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
			setPageIndex(1);
			setMaxPage(Math.ceil(listMarketTamp.length / MAXELEMENT));
			listMarketTamp = listMarketTamp.slice(0, MAXELEMENT);
			setListMarket(listMarketTamp);
			setIsSortChange(false);
			setIsSortPairs(false);
			setIsSortPrice(false);
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

			setIsSortChange(false);
			setIsSortPairs(false);
			setIsSortPrice(false);
			setListMarket(listMarketTamp);
		}
	}, [valueSearch]);

	useEffect(() => {
		if (isSortChange) {
			const listMarketTamp = listMarket;
			if (sortChange) {
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
			setListMarket(listMarketTamp);
		}
		if (isSortPrice) {
			const listMarketTamp = listMarket;
			if (sortPrice) {
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
			setListMarket(listMarketTamp);
		}
	}, [tickers]);

	const onChangeTab = (nameTab: string) => {
		if (tab !== nameTab) {
			setTab(nameTab);
		}
	};

	const onSort = (typeSort: string) => {
		const listMarketTamp = listMarket;
		switch (typeSort) {
			case 'Trading Pairs':
				if (!isSortPairs) {
					setIsSortChange(false);
					setIsSortPairs(true);
					setIsSortPrice(false);
				}
				if (sortPairs) {
					listMarketTamp.sort((a, b) => {
						const textA = a.name.charAt(0);
						const textB = b.name.charAt(0);

						return textA > textB ? -1 : textA < textB ? 1 : 0;
					});
				} else {
					listMarketTamp.sort((a, b) => {
						const textA = a.name.charAt(0);
						const textB = b.name.charAt(0);

						return textA < textB ? -1 : textA > textB ? 1 : 0;
					});
				}

				setSortPairs(!sortPairs);

				break;
			case 'Latest  Price':
				if (!isSortPrice) {
					setIsSortChange(false);
					setIsSortPairs(false);
					setIsSortPrice(true);
				}
				if (sortPrice) {
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

				setSortPrice(!sortPrice);

				break;
			case '24h Change':
				if (!isSortChange) {
					setIsSortChange(true);
					setIsSortPairs(false);
					setIsSortPrice(false);
				}
				if (sortChange) {
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
				setSortChanges(!sortChange);
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
		setTab('all');
	};

	const renderTab = () => {
		const classname = (nameTab: String) =>
			classNames('td-market__body__selection__box__item', {
				'td-market__body__selection__box__item--active': nameTab === tab,
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
			let classActiveUpDown = 'd-flex flex-column justify-content-center td-market__body__info__item__icon';

			switch (name) {
				case 'Trading Pairs':
					if (isSortPairs) {
						classActiveUpDown = classNames(
							'd-flex flex-column justify-content-center td-market__body__info__item__icon',
							{ 'td-market__body__info__item__icon--active-up': sortPairs },
							{ 'td-market__body__info__item__icon--active-down': !sortPairs },
						);
					}
					break;
				case 'Latest  Price':
					if (isSortPrice) {
						classActiveUpDown = classNames(
							'd-flex flex-column justify-content-center td-market__body__info__item__icon',
							{ 'td-market__body__info__item__icon--active-up': sortPrice },
							{ 'td-market__body__info__item__icon--active-down': !sortPrice },
						);
					}
					break;
				case '24h Change':
					if (isSortChange) {
						classActiveUpDown = classNames(
							'd-flex flex-column justify-content-center td-market__body__info__item__icon',
							{ 'td-market__body__info__item__icon--active-up': !sortChange },
							{ 'td-market__body__info__item__icon--active-down': sortChange },
						);
					}
					break;
				default:
					break;
			}

			return (
				<th key={i}>
					<div className={classNames('td-market__body__info d-flex', { 'justify-content-end': i !== 0 })}>
						<div className="d-flex" onClick={() => onSort(name)}>
							<div className="td-market__body__info__item ">{name}</div>
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
					<tbody className="td-market__body__markets">
						<tr>
							<td className="td-market__body__markets__desc">Main</td>
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
			}
		};

		return listMarket.length === 0 ? <Empty /> : <NewPagination page={pageIndex} total={maxPage} toPage={goToPgae} />;
	};

	return (
		<div className="td-market">
			<HeaderSearch onSearch={onSearch} backToAll={backToAllList} />

			<div className="td-market__body ">
				<div className="td-market__body__selection ">
					<div className="td-market__body__selection__desc">Option</div>

					<div className="td-market__body__selection__box">{renderTab()}</div>
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
