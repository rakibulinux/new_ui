import * as moment from 'moment-timezone';
import React from 'react';
// tslint:disable-next-line: no-duplicate-imports
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import {
	currenciesFetch,
	Currency,
	fetchHistory,
	historyAllFetch,
	Market,
	RootState,
	selectCurrencies,
	selectHistory,
	selectHistoryLoading,
	selectMarkets,
	selectWallets,
	Wallet,
	WalletHistoryList,
} from '../../modules';

import { localeDate, setDocumentTitle, setTradesType } from '../../helpers';
import { FilterElement } from './../../components/FilterElementOrdersHistory/index';
import { Pagination } from './../../components/PaginationOrdersHistory/index';

interface DispatchProps {
	fetchCurrencies: typeof currenciesFetch;
	fetchHistory: typeof fetchHistory;
	historyAllFetch: typeof historyAllFetch;
}

interface ReduxProps {
	currencies: Currency[];
	marketsData: Market[];
	wallets: Wallet[];
	list: WalletHistoryList;
	fetching: boolean;
}

export const HistoryTradeScreen = () => {
	const intl = useIntl();
	const type = 'trades';
	const limitElem = 5;
	const reduxProps = useSelector(
		(state: RootState): ReduxProps => ({
			currencies: selectCurrencies(state),
			marketsData: selectMarkets(state),
			wallets: selectWallets(state),
			list: selectHistory(state),
			fetching: selectHistoryLoading(state),
		}),
	);

	const [listData, setListData] = useState(reduxProps.list);
	const [pageIndex, setPageIndex] = useState(1);
	const [maxPage, setMaxPage] = useState(1);

	const dispatch = useDispatch();
	const listFunction: DispatchProps = {
		fetchHistory: payload => dispatch(fetchHistory(payload)),
		fetchCurrencies: () => dispatch(currenciesFetch()),
		historyAllFetch: payload => dispatch(historyAllFetch(payload)),
	};

	useEffect(() => {
		const { currencies } = reduxProps;

		// listFunction.fetchHistory({ page: 0, type, limit: 25 });
		// call get all data
		// vì đang lỗi nên có api thật mưới dùng đc
		listFunction.historyAllFetch({ page: 2, type, limit: 25 });
		setDocumentTitle('History Trade');

		if (currencies.length === 0) {
			listFunction.fetchCurrencies();
		}
	}, []);

	useEffect(() => {
		if (reduxProps.currencies.length === 0) {
			listFunction.fetchCurrencies();
		}
	}, [reduxProps.currencies]);

	useEffect(() => {
		console.log(reduxProps.list);
		const newMaxPage =
			Math.ceil(reduxProps.list.length / limitElem) === 0 ? 1 : Math.ceil(reduxProps.list.length / limitElem);
		setMaxPage(Math.ceil(newMaxPage));
		setListData(reduxProps.list);
	}, [reduxProps.list]);

	const renderHeadersTable = () => {
		// console.log("renderHeadersTable")
		const headersTable = [
			intl.formatMessage({ id: 'page.body.history.trade.header.date' }),
			intl.formatMessage({ id: 'page.body.history.trade.header.side' }),
			intl.formatMessage({ id: 'page.body.history.trade.header.market' }),
			intl.formatMessage({ id: 'page.body.history.trade.header.price' }),
			intl.formatMessage({ id: 'page.body.history.trade.header.amount' }),
			intl.formatMessage({ id: 'page.body.history.trade.header.total' }),
		];

		return headersTable.map((headerTable, index) => {
			return (
				<th scope="col" key={index}>
					{headerTable}
				</th>
			);
		});
	};

	const renderTableRow = (item, index) => {
		const { marketsData } = reduxProps;
		const { created_at, side, market, price, amount, total } = item;
		const marketToDisplay = marketsData.find(m => m.id === market) || {
			name: '',
			price_precision: 0,
			amount_precision: 0,
		};
		const marketName = marketToDisplay ? marketToDisplay.name : market;
		const sideText = setTradesType(side).text.toLowerCase()
			? intl.formatMessage({ id: `page.body.history.trade.content.side.${setTradesType(side).text.toLowerCase()}` })
			: '';

		return (
			<tr key={index}>
				<td>{localeDate(created_at, 'fullDate')}</td>
				<td>
					{sideText}
					{side}
				</td>
				<td>{marketName}</td>
				<td>{price}</td>
				<td>{amount}</td>
				<td>{total}</td>
			</tr>
		);
	};

	const renderTable = () => {
		// tslint:disable-next-line: no-console
		console.log(listData);
		const { fetching } = reduxProps;
		const indexElemStart = (pageIndex - 1) * limitElem;
		const indexElemStop = (pageIndex - 1) * limitElem + limitElem;
		const bodyTable = () =>
			listData.slice(indexElemStart, indexElemStop).map((item, index) => {
				return renderTableRow(item, index);
			});
		const emptyData = () => {
			return [...listData].length === 0 ? (
				<div className="text-center history-screen__tabs__content__table pt-5 pb-5">
					Empty data . Please next page or prev page{' '}
				</div>
			) : (
				''
			);
		};

		return fetching ? (
			<div className="d-flex justify-content-center mt-5 mb-5">
				<div className="spinner-border text-success spinner-loadding" role="status"></div>
			</div>
		) : (
			<div>
				<table className="history-screen__tabs__content__table">
					<thead className=" history-screen__tabs__content__table__header">
						<tr>{renderHeadersTable()}</tr>
					</thead>
					<tbody className=" history-screen__tabs__content__table__body">{bodyTable()}</tbody>
				</table>
				{emptyData()}
			</div>
		);
	};
	//--------------------------render pagination--------------------------//

	const onclickFirstPage = () => {
		setPageIndex(1);
	};
	const onClickPrevPage = () => {
		const pageIndexTmp = pageIndex - 1;
		setPageIndex(pageIndexTmp);
	};
	const onClickLastPage = () => {
		setPageIndex(maxPage);
	};
	const onClickNextPage = () => {
		const pageIndexTmp = pageIndex + 1;
		setPageIndex(pageIndexTmp);
	};

	const renderPagination = () => {
		return (
			<Pagination
				pageIndex={pageIndex}
				max_page={maxPage}
				onclickFirstPage={onclickFirstPage}
				onClickPrevPage={onClickPrevPage}
				onClickLastPage={onClickLastPage}
				onClickNextPage={onClickNextPage}
			/>
		);
	};

	//--------------------------
	//-----------------      render fileter bar     ------------------//
	const renderFilterBar = () => {
		// tslint:disable-next-line: variable-name
		const onFilter = (date_form: string, date_to: string, base_unit: string, quote_unit: string, side: string) => {
			let dataFilter = reduxProps.list;
			// // filter by base_unit vs quote_unit
			// if (base_unit === 'all') {
			// 	// ko loc gì
			// } else {
			// 	if (quote_unit === 'all') {
			// 		// loc moi base unit
			// 		const baseStringLength = base_unit.length;
			// 		dataFilter = reduxProps.list.filter(e => e.market.slice(0, baseStringLength) === base_unit);
			// 	} else {
			// 		// loc cả hai base unit vs quote unit
			// 		// tslint:disable-next-line: restrict-plus-operands
			// 		const market = base_unit + quote_unit;
			// 		dataFilter = dataFilter.filter(e => e.market === market);
			// 	}
			// }
			// // filter by side
			// if (side !== 'all') {
			// 	dataFilter = dataFilter.filter(e => e.taker_type === side);
			// }

			// filter by time from
			if (date_form !== '') {
				dataFilter = dataFilter.filter(
					e => moment(e.created_at, 'YYYYMMDD').valueOf() >= moment(date_form, 'YYYYMMDD').valueOf(),
				);
			}
			// filter by time to
			if (date_to !== '') {
				dataFilter = dataFilter.filter(
					e => moment(e.created_at, 'YYYYMMDD').valueOf() <= moment(date_to, 'YYYYMMDD').valueOf(),
				);
			}

			setPageIndex(1);
			setListData(dataFilter);
			const newMaxPage = Math.ceil(dataFilter.length / limitElem) === 0 ? 1 : Math.ceil(dataFilter.length / limitElem);
			setMaxPage(newMaxPage);
		};

		const onRestFilter = () => {
			setListData(reduxProps.list);
			setPageIndex(1);
			const newMaxPage =
				Math.ceil(reduxProps.list.length / limitElem) === 0 ? 1 : Math.ceil(reduxProps.list.length / limitElem);
			setMaxPage(newMaxPage);
		};

		return <FilterElement onFilter={onFilter} onRestFilter={onRestFilter} />;
	};

	return (
		<div className="history-screen history-screen-container">
			<div className="history-screen__title"> Trade History</div>
			{renderFilterBar()}
			<div className="history-screen__tabs ">
				<div className="history-screen__tabs__content">{renderTable()}</div>
				<div className="history-screen__tabs__content__pagination">{renderPagination()}</div>
			</div>
		</div>
	);
};
