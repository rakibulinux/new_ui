import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { ReactTable } from '../../components/ReactTable';
import Tabs, { TabPane } from 'rc-tabs';
import { getTabName, localeDate } from '../../helpers';
import { selectHistory, selectCurrencies, selectChildCurrencies } from '../../modules';
interface WithdrawHistoryProps {
	currency_id: string;
}

export const WithdrawHistory: React.FC<WithdrawHistoryProps> = (props: WithdrawHistoryProps) => {
	const intl = useIntl();

	// props
	const { currency_id } = props;

	// selector
	const list = useSelector(selectHistory);
	const currencies = useSelector(selectCurrencies);
	const child_currencies = useSelector(selectChildCurrencies);
	const child_currencies_ids = child_currencies.map(child => child.id);

	const formatTxState = (tx: string, confirmations?: number, minConfirmations?: number) => {
		const process = require('../../assets/status/wait.svg');
		const fail = require('../../assets/status/fail.svg');
		const success = require('../../assets/status/success.svg');
		const statusMapping = {
			confirming: <img src={process} alt="confirming" />,
			succeed: <img src={success} alt="succeed" />,
			failed: <img src={fail} alt="failed" />,
			accepted: <img src={process} alt="accepted" />,
			collected: <img src={success} alt="collected" />,
			canceled: <img src={fail} alt="canceled" />,
			rejected: <img src={fail} alt="rejected" />,
			processing: <img src={process} alt="processing" />,
			prepared: <img src={process} alt="prepared" />,
			fee_processing: <img src={process} alt="fee_processing" />,
			skipped: <img src={success} alt="skipped" />,
			submitted:
				confirmations !== undefined && minConfirmations !== undefined ? (
					`${confirmations}/${minConfirmations}`
				) : (
					<img src={process} alt="process" />
				),
		};

		return statusMapping[tx];
	};

	const columns = React.useMemo(() => {
		return [
			{
				Header: intl.formatMessage({ id: `page.body.history.withdraw.header.date` }),
				accessor: 'date',
			},
			{
				Header: 'Type Coin',
				accessor: 'type',
			},
			{
				Header: 'txID',
				accessor: 'txid',
			},
			{
				Header: intl.formatMessage({ id: `page.body.history.withdraw.header.status` }),
				accessor: 'state',
			},
			{
				Header: intl.formatMessage({ id: `page.body.history.withdraw.header.amount` }),
				accessor: 'amount',
			},
		];
	}, []);

	const main_list = list
		.filter((history: any) => history.currency === currency_id.toLowerCase())
		.map((history: any) => {
			const currency_index = currencies.findIndex(currency => currency.id === history.currency);
			const blockchain = getTabName(currencies[currency_index].blockchain_key || '');
			return {
				...history,
				type: blockchain,
			};
		});

	const child_list = list
		.filter((history: any) => child_currencies_ids.includes(history.currency))
		.map((history: any) => {
			const currency_index = child_currencies_ids.findIndex(child_id => child_id === history.currency);
			const blockchain = getTabName(child_currencies[currency_index].blockchain_key);
			return {
				...history,
				type: blockchain,
			};
		});
	const new_list = [...main_list, ...child_list];
	const data = new_list
		.sort((a, b) => {
			return new Date(a.created_at) > new Date(b.created_at) ? -1 : 1;
		})
		.map((history: any) => {
			const currency = currencies.find(cur => cur.id === history.currency);
			const blockchain_address = currency ? currency.explorer_address : '';
			const blockchainTxidAddress = blockchain_address
				? blockchain_address.replace('#{address}', history.blockchain_txid)
				: '';
			return {
				...history,
				date: localeDate(history.created_at, 'fullDate'),
				status: history.state,
				amount: history.amount,
				txid: (
					<a target="_blank" href={blockchainTxidAddress}>
						{history.blockchain_txid}
					</a>
				),
				state: formatTxState(history.state),
			};
		});

	const all_history = [...data];
	const confirming_history = [...data].filter(d => d.status === 'confirming');
	const success_history = [...data].filter(d => d.status === 'succeed');
	const error_history = [...data].filter(d => d.status === 'failed');

	return (
		<div id="withdraw-history" style={{ marginTop: '50px' }}>
			<h2>{intl.formatMessage({ id: `page.body.history.withdraw` })}</h2>
			<div className="react-tabs">
				<Tabs defaultActiveKey="recent_history">
					<TabPane tab="Recent" key="recent_history">
						<ReactTable columns={columns} data={all_history} headColor="#182034" />
					</TabPane>
					<TabPane tab="Confirming" key="confirming_history">
						<ReactTable columns={columns} data={confirming_history} headColor="#182034" />
					</TabPane>
					<TabPane tab="Success" key="success_history">
						<ReactTable columns={columns} data={success_history} headColor="#182034" />
					</TabPane>
					<TabPane tab="Error" key="error_history">
						<ReactTable columns={columns} data={error_history} headColor="#182034" />
					</TabPane>
				</Tabs>
			</div>
		</div>
	);
};
