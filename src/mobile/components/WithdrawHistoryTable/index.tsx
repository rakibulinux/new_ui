import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Table } from '../../../components';
import { DEFAULT_CCY_PRECISION } from '../../../constants';
import { localeDate } from '../../../helpers';
import { useCurrenciesFetch, useHistoryFetch, useWalletsFetch } from '../../../hooks';
import { selectCurrencies } from '../../../modules/public/currencies';
import { selectHistory } from '../../../modules/user/history';
import { selectWallets } from '../../../modules/user/wallets';
import { RowItem } from './Rowitem';

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
		const process = require('../../../assets/status/wait.svg');
		const fail = require('../../../assets/status/fail.svg');
		const success = require('../../../assets/status/success.svg');

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

		return histories.length > 0 ? histories : [[]];
	};
	const mapRows = row => {
		return <div className="td-mobile-history-table__row">{row}</div>;
	};

	const tableData = retrieveData().map(row => row.map(mapRows));

	return (
		<div className="td-mobile-history-table">
			<Table data={tableData} />
		</div>
	);
};

export { WithdrawHistoryTable };
