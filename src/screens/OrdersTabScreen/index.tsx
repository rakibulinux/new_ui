// tslint:disable-next-line: ordered-imports
import React from 'react';
// tslint:disable-next-line: no-duplicate-imports
import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
// tslint:disable-next-line: ordered-imports
import { Decimal } from '../../components/Decimal';
import { localeDate, setTradeColor } from '../../helpers';
// tslint:disable-next-line: no-duplicate-imports
import { setDocumentTitle } from '../../helpers';
import {
	Market,
	marketsFetch,
	ordersCancelAllFetch,
	ordersHistoryCancelFetch,
	resetOrdersHistory,
	RootState,
	selectCancelAllFetching,
	selectCancelFetching,
	selectMarkets,
	selectOrdersHistory,
	selectOrdersHistoryLoading,
	selectUserLoggedIn,
	userOrdersHistoryAllFetch,
	userOrdersHistoryFetch,
} from '../../modules';
import { RangerConnectFetch, rangerConnectFetch } from '../../modules/public/ranger';
import { RangerState } from '../../modules/public/ranger/reducer';
import { selectRanger } from '../../modules/public/ranger/selectors';
import { OrderCommon } from '../../modules/types';
import { Pagination } from './../../components/PaginationOrdersHistory/index';

interface ReduxProps {
	marketsData: Market[];
	list: OrderCommon[];
	fetching: boolean;
	cancelAllFetching: boolean;
	cancelFetching: boolean;
	rangerState: RangerState;
	userLoggedIn: boolean;
}

interface DispatchProps {
	marketsFetch: typeof marketsFetch;
	ordersHistoryCancelFetch: typeof ordersHistoryCancelFetch;
	userOrdersHistoryFetch: typeof userOrdersHistoryFetch;
	ordersCancelAll: typeof ordersCancelAllFetch;
	resetOrdersHistory: typeof resetOrdersHistory;
	rangerConnect: typeof rangerConnectFetch;
	userOrdersHistoryAllFetch: typeof userOrdersHistoryAllFetch;
}

export const OrdersTabScreen = () => {
	const intl = useIntl();
	const type = 'open';
	const limitElem = 20;

	const reduxProps = useSelector(
		(state: RootState): ReduxProps => ({
			marketsData: selectMarkets(state),
			list: selectOrdersHistory(state),
			fetching: selectOrdersHistoryLoading(state),
			cancelAllFetching: selectCancelAllFetching(state),
			cancelFetching: selectCancelFetching(state),
			rangerState: selectRanger(state),
			userLoggedIn: selectUserLoggedIn(state),
		}),
	);

	const [pageIndex, setPageIndex] = useState(1);
	const [listData, setListData] = useState(reduxProps.list);
	const [maxPage, setMaxPage] = useState(1);

	const dispatch = useDispatch();
	const listFunction: DispatchProps = {
		marketsFetch: () => dispatch(marketsFetch()),
		ordersHistoryCancelFetch: payload => dispatch(ordersHistoryCancelFetch(payload)),
		userOrdersHistoryFetch: payload => dispatch(userOrdersHistoryFetch(payload)),
		ordersCancelAll: () => dispatch(ordersCancelAllFetch()),
		resetOrdersHistory: () => dispatch(resetOrdersHistory()),
		rangerConnect: (payload: RangerConnectFetch['payload']) => dispatch(rangerConnectFetch(payload)),
		userOrdersHistoryAllFetch: payload => dispatch(userOrdersHistoryAllFetch(payload)),
	};

	useEffect(() => {
		// lấy về trước 20 phần tử
		// listFunction.userOrdersHistoryFetch({ pageIndex: 1, type, limit: 25 });

		// hàm này chưa có api thaatj nên chạy sẽ bị lỗi
		listFunction.userOrdersHistoryAllFetch({ pageIndex: 1, type, limit: 25 });
		setDocumentTitle('Open Orders');
		const {
			rangerState: { connected },
			userLoggedIn,
		} = reduxProps;

		listFunction.marketsFetch();

		if (!connected) {
			listFunction.rangerConnect({ withAuth: userLoggedIn });
		}

		return () => {
			listFunction.resetOrdersHistory();
		};
	}, []);

	useEffect(() => {
		setListData(reduxProps.list);
		const newMaxPage =
			Math.ceil(reduxProps.list.length / limitElem) === 0 ? 1 : Math.ceil(reduxProps.list.length / limitElem);
		setMaxPage(newMaxPage);
	}, [reduxProps.list]);

	const renderHeadersTable = () => {
		// console.log("renderHeadersTable")
		const headersTable = [
			intl.formatMessage({ id: 'page.body.history.deposit.header.date' }),
			intl.formatMessage({ id: 'page.body.openOrders.header.orderType' }),
			intl.formatMessage({ id: 'page.body.openOrders.header.pair' }),
			intl.formatMessage({ id: 'page.body.openOrders.header.price' }),
			intl.formatMessage({ id: 'page.body.openOrders.header.amount' }),
			intl.formatMessage({ id: 'page.body.openOrders.header.executed' }),
			intl.formatMessage({ id: 'page.body.openOrders.header.remaining' }),
			intl.formatMessage({ id: 'page.body.openOrders.header.costRemaining' }),
			intl.formatMessage({ id: 'page.body.openOrders.header.status' }),
			<div className="text-center history-screen__tabs__content__table__header__item--icon">
				<span onClick={() => listFunction.ordersCancelAll()}>
					{intl.formatMessage({ id: 'page.body.openOrders.header.button.cancelAll' })} <FaTimes className="ml-2" />
				</span>
			</div>,
		];

		return headersTable.map((headerTable, index: number) => {
			return (
				<th scope="col" key={index}>
					{headerTable}
				</th>
			);
		});
	};

	// tslint:disable-next-line: no-shadowed-variable
	const getType = (side: string, orderType: string) => {
		if (!side || !orderType) {
			return '';
		}

		return intl.formatMessage({ id: `page.body.openOrders.header.orderType.${side}.${orderType}` });
	};

	const setOrderStatus = (status: string) => {
		// console.log(status);
		switch (status) {
			case 'done':
				return (
					<span className="history-screen__tabs__content__table__body__item-table--wait">
						<FormattedMessage id={`page.body.openOrders.content.status.done`} />
					</span>
				);
			case 'cancel':
				return (
					<span className="history-screen__tabs__content__table__body__item-table--failed">
						<FormattedMessage id={`page.body.openOrders.content.status.cancel`} />
					</span>
				);
			case 'wait':
				return (
					<span className="history-screen__tabs__content__table__body__item-table--succeed">
						<FormattedMessage id={`page.body.openOrders.content.status.wait`} />
					</span>
				);
			default:
				return status;
		}
	};

	const handleCancel = (id: number) => () => {
		const { cancelAllFetching, cancelFetching, list } = reduxProps;
		if (cancelAllFetching || cancelFetching) {
			return;
		}
		listFunction.ordersHistoryCancelFetch({ id, type, list });
	};

	const renderTableRow = (item, index) => {
		const {
			id,
			executed_volume,
			market,
			ord_type,
			price,
			avg_price,
			remaining_volume,
			origin_volume,
			// tslint:disable-next-line: no-shadowed-variable
			side,
			state,
			updated_at,
			created_at,
		} = item;
		const currentMarket = reduxProps.marketsData.find(m => m.id === market) || {
			name: '',
			price_precision: 0,
			amount_precision: 0,
		};
		const orderType = getType(side, ord_type);
		const marketName = currentMarket ? currentMarket.name : market;
		const costRemaining = remaining_volume * price; // price or avg_price ???
		const date = localeDate(updated_at ? updated_at : created_at, 'fullDate');
		const status = setOrderStatus(state);
		const actualPrice = ord_type === 'market' || status === 'done' ? avg_price : price;

		return (
			<tr key={index}>
				<td>{date}</td>
				<td style={{ color: setTradeColor(side).color }}>{orderType}</td>
				<td>{marketName}</td>
				<td>
					<Decimal key={id} fixed={currentMarket.price_precision}>
						{actualPrice}
					</Decimal>
				</td>
				<td>
					<Decimal key={id} fixed={currentMarket.amount_precision}>
						{origin_volume}
					</Decimal>
				</td>
				<td>
					<Decimal key={id} fixed={currentMarket.amount_precision}>
						{executed_volume}
					</Decimal>
				</td>
				<td>
					<Decimal key={id} fixed={currentMarket.amount_precision}>
						{remaining_volume}
					</Decimal>
				</td>
				<td>
					<Decimal key={id} fixed={currentMarket.amount_precision}>
						{costRemaining.toString()}
					</Decimal>
				</td>
				<td>{status}</td>
				<td className="text-center history-screen__tabs__content__table__body__item-table--icon">
					{state === 'wait' && <FaTimes key={id} onClick={handleCancel(id)} />}
				</td>
			</tr>
		);
	};

	const renderTable = () => {
		const { fetching } = reduxProps;
		const indexElemStart = (pageIndex - 1) * limitElem;
		const indexElemStop = (pageIndex - 1) * limitElem + limitElem;

		// console.log(indexElemStart, indexElemStop);
		const bodyTable = () =>
			[...listData].slice(indexElemStart, indexElemStop).map((item, index) => {
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

	return (
		<div className="history-screen history-screen-container">
			<div className="history-screen__title">Open Orders</div>
			<div className="history-screen__tabs ">
				<div className="history-screen__tabs__content">{renderTable()}</div>
				<div className="history-screen__tabs__content__pagination">{renderPagination()}</div>
			</div>
		</div>
	);
};
