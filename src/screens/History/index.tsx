import React from 'react';
// tslint:disable-next-line: no-duplicate-imports
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { localeDate, preciseData } from '../../helpers';
// tslint:disable-next-line: no-duplicate-imports
import { setDocumentTitle } from '../../helpers';
import {
	currenciesFetch,
	Currency,
	fetchHistory,
	historyAllFetch,
	Market,
	resetHistory,
	RootState,
	selectCurrencies,
	selectHistory,
	selectHistoryLoading,
	selectMarkets,
	selectWallets,
	Wallet,
	WalletHistoryList,
} from '../../modules';
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

export const HistoryScreen = () => {
	const [tab, setTab] = useState('deposits');
	const dispatch = useDispatch();
	const intl = useIntl();
	const tabMapping = ['deposits', 'withdraws'];
	const type = tab;
	const limitElem = 20;

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
	const onCurrentTabChange = (index: number) => {
		if (tabMapping[index] !== type) {
			dispatch(resetHistory());
			setTab(tabMapping[index]);
		}
	};

	const listFunction: DispatchProps = {
		fetchHistory: payload => dispatch(fetchHistory(payload)),
		fetchCurrencies: () => dispatch(currenciesFetch()),
		historyAllFetch: payload => dispatch(historyAllFetch(payload)),
	};

	useEffect(() => {
		const { currencies } = reduxProps;
		setDocumentTitle('History');
		// listFunction.fetchHistory({ page: 1, type, limit: 25 });
		// call get all data
		// vì đang lỗi nên có api thật mưới dùng đc
		listFunction.historyAllFetch({ page: 1, type, limit: 25 });
		if (currencies.length === 0) {
			// console.log('run fetch currencies ');
			listFunction.fetchCurrencies();
		}
	}, []);

	useEffect(() => {
		listFunction.fetchHistory({ page: 1, type, limit: 25 });
		setPageIndex(1);
		// call get all data
		// vì đang lỗi nên có api thật mưới dùng đc
		// listFunction.historyAllFetch({ page: 0, type, limit: 25 });
	}, [tab]);

	useEffect(() => {
		if (reduxProps.currencies.length === 0) {
			listFunction.fetchCurrencies();
		}
	}, [reduxProps.currencies]);

	useEffect(() => {
		const newMaxPage =
			Math.ceil(reduxProps.list.length / limitElem) === 0 ? 1 : Math.ceil(reduxProps.list.length / limitElem);
		setMaxPage(Math.ceil(newMaxPage));
		setListData(reduxProps.list);
	}, [reduxProps.list]);

	//// render tabs label //////////////////
	const renderTabsLabel = () => {
		// console.log('renderTabsLabel');
		const labelTabs = [
			{
				className:
					tab === 'deposits'
						? 'history-screen__tabs__label__item history-screen__tabs__label__item--active'
						: 'history-screen__tabs__label__item',
				label: intl.formatMessage({ id: 'page.body.history.deposit' }),
			},
			{
				className:
					tab === 'withdraws'
						? 'history-screen__tabs__label__item history-screen__tabs__label__item--active'
						: 'history-screen__tabs__label__item',
				label: intl.formatMessage({ id: 'page.body.history.withdraw' }),
			},
		];

		return (
			<React.Fragment>
				{labelTabs.map((label, index) => {
					return (
						<div className={label.className} onClick={() => onCurrentTabChange(index)} key={index}>
							{label.label}
						</div>
					);
				})}
			</React.Fragment>
		);
	};
	/////////////////////     render table      ////////////////////////////
	// tslint:disable-next-line: no-shadowed-variable
	const renderHeadersTable = (type: string) => {
		// console.log("renderHeadersTable")
		const headersTable = () => {
			switch (type) {
				case 'deposits':
					return [
						intl.formatMessage({ id: 'page.body.history.deposit.header.txid' }),
						intl.formatMessage({ id: 'page.body.history.deposit.header.date' }),
						intl.formatMessage({ id: 'page.body.history.deposit.header.currency' }),
						intl.formatMessage({ id: 'page.body.history.deposit.header.amount' }),
						intl.formatMessage({ id: 'page.body.history.deposit.header.status' }),
					];
				case 'withdraws':
					return [
						intl.formatMessage({ id: 'page.body.history.withdraw.header.address' }),
						intl.formatMessage({ id: 'page.body.history.withdraw.header.date' }),
						intl.formatMessage({ id: 'page.body.history.withdraw.header.currency' }),
						intl.formatMessage({ id: 'page.body.history.withdraw.header.amount' }),
						intl.formatMessage({ id: 'page.body.history.withdraw.header.fee' }),
						intl.formatMessage({ id: 'page.body.history.withdraw.header.status' }),
					];
				default:
					return [];
			}
		};

		return headersTable().map((headerTable, index) => {
			return (
				<th scope="col" key={index}>
					{headerTable}
				</th>
			);
		});
	};

	// tslint:disable-next-line: no-shadowed-variable
	const renderTableRow = (type: string, item, index) => {
		// console.log(item);
		const { currencies, wallets } = reduxProps;
		const getBlockchainLink = (currency: string, txid: string, rid?: string) => {
			const currencyInfo = wallets && wallets.find(wallet => wallet.currency === currency);
			if (currencyInfo) {
				if (txid && currencyInfo.explorerTransaction) {
					return currencyInfo.explorerTransaction.replace('#{txid}', txid);
				}
				if (rid && currencyInfo.explorerAddress) {
					return currencyInfo.explorerAddress.replace('#{address}', rid);
				}
			}

			return '';
		};
		switch (type) {
			case 'deposits': {
				const { amount, confirmations, created_at, currency, txid } = item;
				const blockchainLink = getBlockchainLink(currency, txid);
				const wallet = wallets.find(obj => obj.currency === currency);
				const itemCurrency = currencies && currencies.find(cur => cur.id === currency);
				const minConfirmations = itemCurrency && itemCurrency.min_confirmations;

				const state =
					item.state === 'submitted' && confirmations !== undefined && minConfirmations !== undefined
						? `${confirmations}/${minConfirmations}`
						: intl.formatMessage({ id: `page.body.history.deposit.content.status.${item.state}` });
				// tslint:disable-next-line: no-shadowed-variable
				const classname = (state: string) => {
					// tslint:disable-next-line: prefer-switch
					if (state === 'Wait confirmation' || state === 'Succeed') {
						return 'history-screen__tabs__content__table__body__item-table--succeed';
					}
					// tslint:disable-next-line: prefer-switch
					if (state === 'Rejected by Admin' || state === 'Rejected by System') {
						return 'history-screen__tabs__content__table__body__item-table--failed';
					}

					return '';
				};

				return (
					<tr key={index}>
						<td>
							<a href={blockchainLink} target="_blank" rel="noopener noreferrer">
								{txid}
							</a>
						</td>
						<td>{localeDate(created_at, 'fullDate')}</td>
						<td>{currency && currency.toUpperCase()}</td>
						<td>{wallet && preciseData(amount, wallet.fixed)}</td>
						<td className={classname(state)}>{state}</td>
					</tr>
				);
			}
			case 'withdraws': {
				const { txid, created_at, currency, amount, fee, rid } = item;
				const state = intl.formatMessage({ id: `page.body.history.withdraw.content.status.${item.state}` });
				const blockchainLink = getBlockchainLink(currency, txid, rid);
				const wallet = wallets.find(obj => obj.currency === currency);
				const classname =
					state === 'Succeed'
						? 'history-screen__tabs__content__table__body__item-table--succeed'
						: 'history-screen__tabs__content__table__body__item-table--failed';

				return (
					<tr key={index}>
						<td>
							<a href={blockchainLink} target="_blank" rel="noopener noreferrer">
								{txid || rid}
							</a>
						</td>
						<td>{localeDate(created_at, 'fullDate')}</td>
						<td>{currency && currency.toUpperCase()}</td>
						<td>{wallet && preciseData(amount, wallet.fixed)}</td>
						<td>{fee}</td>
						<td className={classname}>{state}</td>
					</tr>
				);
			}
			default: {
				return [];
			}
		}
	};

	const renderTable = () => {
		const { fetching } = reduxProps;

		const indexElemStart = (pageIndex - 1) * limitElem;
		const indexElemStop = (pageIndex - 1) * limitElem + limitElem;

		const bodyTable = () =>
			[...listData].slice(indexElemStart, indexElemStop).map((item, index) => {
				return renderTableRow(type, item, index);
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
						<tr>{renderHeadersTable(type)}</tr>
					</thead>
					<tbody className="history-screen__tabs__content__table__body">{bodyTable()}</tbody>
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
	return (
		<div className="history-screen history-screen-container">
			<div className="history-screen__title">History</div>
			<div className="history-screen__tabs ">
				<div className="history-screen__tabs__label   d-flex">{renderTabsLabel()}</div>
				<div className="history-screen__tabs__content">
					{renderTable()}
					<div className="history-screen__tabs__content__pagination">{renderPagination()}</div>
				</div>
			</div>
		</div>
	);
};
