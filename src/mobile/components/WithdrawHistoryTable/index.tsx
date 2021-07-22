import { Empty } from 'antd';
import classnames from 'classnames';
import { localeDate } from 'helpers';
import { useCurrenciesFetch, useHistoryFetch, useWalletsFetch } from 'hooks';
import { selectCurrencies, selectHistory, selectWallets } from 'modules';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { DEFAULT_CCY_PRECISION } from '../../../constants';
import { RowItem } from './Rowitem';

type CellData = string | number | React.ReactNode | undefined;

const DEFAULT_LIMIT = 6;

const WithdrawHistoryTable = (props: any) => {
	const intl = useIntl();
	const list = useSelector(selectHistory);
	const wallets = useSelector(selectWallets);
	const currencies = useSelector(selectCurrencies);

	useWalletsFetch();
	useCurrenciesFetch();
	useHistoryFetch({ type: props.type, currency: props.currency, limit: DEFAULT_LIMIT, page: 0 });

	const formatTxState = (tx: string, confirmations?: number, minConfirmations?: number) => {
		const process = require('assets/status/wait.svg');
		const fail = require('assets/status/fail.svg');
		const success = require('assets/status/success.svg');

		const statusMapping = {
			succeed: <img src={success} alt="" />,
			failed: <img src={fail} alt="" />,
			accepted: <img src={process} alt="" />,
			collected: <img src={success} alt="" />,
			canceled: <img src={fail} alt="" />,
			rejected: <img src={fail} alt="" />,
			processing: <img src={process} alt="" />,
			prepared: <img src={process} alt="" />,
			submitted:
				confirmations !== undefined && minConfirmations !== undefined ? (
					<img src={process} alt="" />
				) : (
					`${confirmations}/${minConfirmations}`
				),
			skipped: <img src={process} alt="" />,
		};

		return statusMapping[tx];
	};
	const retrieveData = () => {
		const { currency, type } = props;
		const { fixed } = wallets.find(w => w.currency === currency) || { fixed: DEFAULT_CCY_PRECISION };
		if (list.length === 0) {
			return [[intl.formatMessage({ id: 'page.noDataToShow' }), '', '']];
		}

		const histories = list
			.filter((history: any) => history.currency === currency)
			.sort((a, b) => {
				return localeDate(a.created_at, 'fullDate') > localeDate(b.created_at, 'fullDate') ? -1 : 1;
			})
			.map((item: any) => {
				const amount = 'amount' in item ? Number(item.amount) : Number(item.price) * Number(item.volume);
				const confirmations = type === 'deposits' && item.confirmations;
				const itemCurrency = currencies && currencies.find(cur => cur.id === currency);
				const minConfirmations = itemCurrency && itemCurrency.min_confirmations;
				const state = 'state' in item ? formatTxState(item.state, confirmations, minConfirmations) : '';

				return [<RowItem amount={amount} fixed={fixed} currency={currency} createdAt={item.created_at} />, state];
			});

		return histories.length > 0 ? histories : [[<Empty />]];
	};

	const tableData = retrieveData().map(row => row.map(a => a));

	const renderBody = (rows: CellData[][]) => {
		const rowElements = rows.map((row, i) => {
			const isEmpty = rows.length === 1 && row.length === 1;

			return (
				<tr key={i}>
					{row.map((c, j) => (
						<td
							className={classnames({
								'w-100': isEmpty,
							})}
							key={j}
						>
							{c}
						</td>
					))}
				</tr>
			);
		});

		return <tbody className={'td-mobile-cpn-history-table__table__body'}>{rowElements}</tbody>;
	};

	return (
		<div className="td-mobile-cpn-history-table">
			<table className="td-mobile-cpn-history-table__table">{renderBody(tableData)}</table>
		</div>
	);
};

export { WithdrawHistoryTable };
